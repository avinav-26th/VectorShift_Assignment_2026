# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Set
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

app = FastAPI(title="VectorShift Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all sources for the assessment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Strict Pydantic Data Structures for Validation
class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]] = Field(default_factory=list, description="List of nodes in the pipeline")
    edges: List[Dict[str, Any]] = Field(default_factory=list, description="List of edges connecting nodes")

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

@app.get('/')
def read_root() -> Dict[str, str]:
    """Health check endpoint."""
    return {'status': 'healthy', 'service': 'vectorshift-backend'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineData) -> PipelineResponse:
    """
    Parses a pipeline graph, returning the number of nodes, edges, 
    and whether it forms a Directed Acyclic Graph (DAG).
    """
    try:
        nodes = pipeline.nodes
        edges = pipeline.edges
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Determine if the graph is a DAG
        is_dag = check_if_dag(nodes, edges)

        return PipelineResponse(
            num_nodes=num_nodes, 
            num_edges=num_edges, 
            is_dag=is_dag
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing pipeline: {str(e)}")


def check_if_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Checks if a graph defined by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses Depth-First Search (DFS) for cycle detection.
    """
    # Build Adjacency List: { node_id: [target_id_1, target_id_2] }
    adj_list: Dict[str, List[str]] = defaultdict(list)
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            adj_list[source].append(target)
    
    # State tracking for DFS
    visited: Set[str] = set()
    recursion_stack: Set[str] = set()

    def has_cycle(node_id: str) -> bool:
        visited.add(node_id)
        recursion_stack.add(node_id)

        # Traverse neighbors
        for neighbor in adj_list.get(node_id, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in recursion_stack:
                return True  # Back-edge detected -> Cycle exists

        recursion_stack.remove(node_id)
        return False

    # Check for cycles starting from every unvisited node
    for node in nodes:
        node_id = node.get('id')
        if node_id and node_id not in visited:
            if has_cycle(node_id):
                return False  # Not a DAG if cycle is found

    return True  # DAG if no cycles found