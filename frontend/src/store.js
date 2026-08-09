// frontend/src/store.js
import { createWithEqualityFn } from 'zustand/traditional';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import { toast } from 'react-toastify';

// Define connection rules
const CONNECTION_GUIDELINES = {
    customInput: ['llm', 'text', 'api', 'database', 'slack', 'note'],
    llm: ['customOutput', 'text', 'api', 'database', 'slack', 'note'],
    text: ['llm', 'customOutput', 'api', 'database', 'slack', 'note'],
    timer: ['llm', 'api', 'database', 'slack', 'text'],
    api: ['llm', 'customOutput', 'text', 'database', 'slack'],
    database: ['llm', 'customOutput', 'text'],
    slack: [], 
    note: ['*'] 
};

export const useStore = createWithEqualityFn((set, get) => ({
    pipelineTitle: 'Untitled Pipeline',
    nodes: [],
    edges: [],
    nodeIDs: {},
    
    // SIMULATION STATE
    isRunning: false,
    activeNodes: [], // List of Node IDs currently "lit up"
    activeEdges: [], // List of Edge IDs currently "lit up"

    saveStatus: 'idle', // 'idle' | 'saving' | 'saved'

    // ACTIONS
    setPipelineTitle: (title) => {
        set({ pipelineTitle: title });
        get().savePipeline();
    },

    getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
    },

    addToHistory: () => {
        const { nodes, edges } = get();
        set({ 
            history: [...(get().history || []), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
            future: [] 
        });
    },

    undo: () => {
        const { history } = get();
        if (!history || history.length === 0) return;
        const previousState = history[history.length - 1];
        const newHistory = history.slice(0, history.length - 1);
        set({
            future: [...(get().future || []), { nodes: get().nodes, edges: get().edges }],
            nodes: previousState.nodes,
            edges: previousState.edges,
            history: newHistory,
        });
    },

    redo: () => {
        const { future } = get();
        if (!future || future.length === 0) return;
        const nextState = future[future.length - 1];
        const newFuture = future.slice(0, future.length - 1);
        set({
            history: [...(get().history || []), { nodes: get().nodes, edges: get().edges }],
            nodes: nextState.nodes,
            edges: nextState.edges,
            future: newFuture,
        });
    },

    // Clear Canvas action
    clearCanvas: () => {
        set({ 
            nodes: [], 
            edges: [], 
            history: [], 
            future: [],
            activeNodes: [], // Clear simulation state too
            activeEdges: []
        });
        get().savePipeline(); // Persist the empty state
    },

    // SMART SIMULATION ENGINE
    runSimulation: () => {
        const { nodes, edges } = get();
        set({ isRunning: true, activeNodes: [], activeEdges: [] });

        // Adjacency List for Graph Traversal
        const adjacency = {};
        nodes.forEach(n => adjacency[n.id] = []);
        edges.forEach(e => {
            if (!adjacency[e.source]) adjacency[e.source] = [];
            adjacency[e.source].push({ target: e.target, edgeId: e.id });
        });

        // Find Entry Nodes (Nodes with 0 incoming edges OR specific types like Input/Timer)
        const incomingCount = {};
        nodes.forEach(n => incomingCount[n.id] = 0);
        edges.forEach(e => incomingCount[e.target] = (incomingCount[e.target] || 0) + 1);
        
        let queue = nodes.filter(n => incomingCount[n.id] === 0).map(n => n.id);
        
        // Fallback: If circular graph (no start), pick the first node
        if (queue.length === 0 && nodes.length > 0) queue = [nodes[0].id];

        // Async Execution Loop (BFS)
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        (async () => {
            let visited = new Set();
            let currentLayer = queue;

            // Loop while there are nodes to process
            while (currentLayer.length > 0) {
                
                // A. Highlight Current Nodes
                const layerNodeIDs = currentLayer;
                set(state => ({ activeNodes: [...state.activeNodes, ...layerNodeIDs] }));
                
                await sleep(500); // Wait for nodes to light up

                // B. Find Next Layer & Highlight Outgoing Edges
                let nextLayer = [];
                let layerEdgeIDs = [];

                for (const nodeId of currentLayer) {
                    if (visited.has(nodeId)) continue; // Prevent infinite loops in cycles
                    visited.add(nodeId);

                    const neighbors = adjacency[nodeId] || [];
                    for (const { target, edgeId } of neighbors) {
                        layerEdgeIDs.push(edgeId);
                        if (!visited.has(target)) {
                            nextLayer.push(target);
                        }
                    }
                }

                // C. Highlight Edges
                if (layerEdgeIDs.length > 0) {
                    set(state => ({ 
                        activeEdges: [...state.activeEdges, ...layerEdgeIDs],
                        edges: state.edges.map(e => layerEdgeIDs.includes(e.id) ? {
                            ...e,
                            animated: true,
                            className: 'running-flow',
                            style: { ...e.style, stroke: 'var(--primary-color)', strokeWidth: 3, opacity: 1, transition: 'all 0.3s ease' }
                        } : e)
                    }));
                    await sleep(800); // Wait for packets to flow
                }

                // D. Prepare Next Iteration
                currentLayer = [...new Set(nextLayer)]; // Deduplicate
            }

            // End Simulation after a delay
            await sleep(2000);
            set(state => ({ 
                isRunning: false, 
                activeNodes: [], 
                activeEdges: [],
                edges: state.edges.map(e => {
                    const { stroke, strokeWidth, opacity, transition, ...restStyle } = e.style || {};
                    return {
                        ...e,
                        animated: true, // Default edges are animated
                        className: '',
                        style: restStyle // Restore original style
                    };
                })
            }));
        })();
    },

    setPipeline: (nodes, edges, title = 'Untitled Pipeline') => {
        set({ nodes, edges, pipelineTitle: title, history: [], future: [] });
        get().savePipeline();
    },

    savePipeline: () => {
        set({ saveStatus: 'saving' }); // Immediate feedback

        const { nodes, edges, pipelineTitle } = get();
        localStorage.setItem('pipeline_nodes', JSON.stringify(nodes));
        localStorage.setItem('pipeline_edges', JSON.stringify(edges));
        localStorage.setItem('pipeline_title', pipelineTitle);

        // Wait 500ms before showing "Saved" to prevent flickering
        setTimeout(() => {
            set({ saveStatus: 'saved' });
        }, 500);
        
        // Fade out after 2 seconds
        setTimeout(() => {
            set({ saveStatus: 'idle' });
        }, 2500);
    },

    loadPipeline: () => {
        const storedNodes = localStorage.getItem('pipeline_nodes');
        const storedEdges = localStorage.getItem('pipeline_edges');
        const storedTitle = localStorage.getItem('pipeline_title');
        
        if (storedNodes && storedEdges) {
            set({
                nodes: JSON.parse(storedNodes),
                edges: JSON.parse(storedEdges),
                pipelineTitle: storedTitle || 'Untitled Pipeline',
                history: [],
                future: []
            });
            return true;
        }
        return false;
    },

    addNode: (node) => {
        get().addToHistory();
        set({ nodes: [...get().nodes, node] });
    },

    removeNode: (id) => {
        get().addToHistory();
        set({
            nodes: get().nodes.filter((node) => node.id !== id),
            edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
    },

    deleteEdge: (id) => {
        get().addToHistory();
        set({ edges: get().edges.filter((edge) => edge.id !== id) });
    },

    onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
    },

    onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    onConnect: (connection) => {
        const { nodes } = get();
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);

        if (sourceNode && targetNode) {
            const allowedTargets = CONNECTION_GUIDELINES[sourceNode.type] || [];
            
            if (!allowedTargets.includes('*') && !allowedTargets.includes(targetNode.type)) {
                toast.error(`Cannot connect ${sourceNode.type} to ${targetNode.type}.`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                return;
            }
        }

        get().addToHistory();
        set({ edges: addEdge(connection, get().edges) });
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
    },
}));