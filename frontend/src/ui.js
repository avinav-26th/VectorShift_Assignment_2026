// frontend/src/ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, MarkerType } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import ButtonEdge from './ButtonEdge'; 

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TimerNode, SlackNode, DatabaseNode, APINode, NoteNode } from './nodes/integrationNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  timer: TimerNode,
  slack: SlackNode,
  database: DatabaseNode,
  api: APINode,
  note: NoteNode
};

const edgeTypes = {
  customEdge: ButtonEdge,
};

const defaultEdgeOptions = {
    type: 'customEdge',
    animated: true,
    markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
    style: { strokeWidth: 2 }
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
            if (typeof type === 'undefined' || !type) return;
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // We pass edges directly to ReactFlow so their internal references don't break during node drags
    return (
        <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}> 
            <ReactFlow
                nodes={nodes}
                edges={edges} 
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes} 
                defaultEdgeOptions={defaultEdgeOptions}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                deleteKeyCode={["Backspace", "Delete"]}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap 
                    style={{ height: 100, width: 150, left: 40, bottom: 10 }} 
                    zoomable pannable 
                />
            </ReactFlow>
        </div>
    )
}