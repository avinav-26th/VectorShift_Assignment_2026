# VectorShift Pipeline Demo

**A Resilient, Low-Code AI Pipeline Orchestration Tool.**

VectorShift Pipeline Demo is a drag-and-drop editor that allows users to design, validate, and simulate complex AI workflows. It mimics the behavior of production-grade tools like LangFlow or ComfyUI, offering a seamless experience from "Idea" to "Execution Simulation." It features a custom-built Breadth-First Search (BFS) execution engine, real-time variable detection, robust state management, and a Python-powered DAG validator.

---
### [See Live Frontend](https://vectorshift-pipeline-frontend.vercel.app/) | [Walkthrough Demo](https://youtu.be/placeholder-link)
---

## Key Features & Nuances Handled

* **Theatrical Simulation Engine:** Unlike static "Run" buttons, this uses a custom BFS (Breadth-First Search) algorithm to traverse the graph. Nodes light up sequentially (Input -> LLM -> Output), and edges animate to visualize data packets flowing in real-time.
* **Smart Variable Detection:** The `TextNode` features a mini-compiler that parses `{{variable_name}}` patterns in real-time (supporting alphanumeric keys). It automatically creates dynamic input handles for every variable detected, enabling complex data chaining.
* **Intelligent Auto-Resizing Inputs:** A custom `DynamicTextArea` component uses a CSS Grid mirroring technique to seamlessly auto-expand node widths and heights as the user types, respecting proportional soft-limits and degrading to sleek, custom scrollbars. It also features **IDE-style auto-completion** (automatically closing `{{}}` braces and centering the cursor).
* **Template Library Integration:** Ships with pre-built pipeline architectures (e.g., Chatbot, Image Generation, Data Ingestion). Loading a template dynamically calculates node positioning and injects proper edge styling automatically.
* **"Ghost Edge" Prevention:** The persistence layer includes a sanitation check on load. It filters out "Ghost Edges" (connections to nodes that no longer exist), preventing the dreaded "React Flow handle not found" crash.
* **Backend DAG Validation:** A Python/FastAPI backend implements Depth-First Search (DFS) for cycle detection, rigorously ensuring the pipeline forms a valid Directed Acyclic Graph (DAG) before execution. Results are presented via a polished SweetAlert2 modal.
* **Robust History Stack:** Full Undo/Redo (Ctrl+Z / Ctrl+Y) capability that tracks not just position, but deep data changes (like tweaking a prompt or changing an API method).

---

## Tech Stack

* **Frontend:** React 18, React Flow (Core Engine), Zustand (State Management), Pure CSS Modules, SweetAlert2.
* **Backend:** Python 3, FastAPI (DAG Validation), Uvicorn.
* **State Management:** `zustand` + `zustand/shallow` for high-performance selective re-rendering.
* **Styling:** CSS Variables for global deep-blue Dark Mode, glassmorphism UI, and custom scrollbars.

---

## Architecture and Project Structure

The project follows a Monorepo-style structure separating the Visual Engine (Frontend) from the Logic Validator (Backend).

```bash
vectorshift-monorepo
 |-- backend                   # THE LOGIC VALIDATOR (Python/FastAPI)
 |    |-- main.py              # The Entry Point. Contains the FastAPI app, the `/pipelines/parse` endpoint, and the DAG cycle detection logic.
 |    |-- requirements.txt     # List of Python libraries needed (fastapi, uvicorn, pydantic).
 |
 |-- frontend                  # THE VISUAL EDITOR (React)
      |-- package.json         # Project manifest. Scripts (start, build) and dependency list.
      |-- README.md            # Documentation for the frontend.
      |
      |-- src                  # SOURCE CODE
           |-- nodes           # CUSTOM NODE COMPONENTS
           |    |-- BaseNode.js         # The Higher-Order Component. Wraps *all* nodes with common UI (border, handles, delete btn, resizing).
           |    |-- DynamicTextArea.js  # Smart auto-resizing text component using CSS grid mirroring.
           |    |-- inputNode.js        # Node for User Inputs (Type: Text/File).
           |    |-- outputNode.js       # Node for Final Results (Type: Text/Image).
           |    |-- textNode.js         # The "Smart" Node. Handles {{variable}} detection and dynamic handles.
           |    |-- llmNode.js          # Node for LLM Settings (Model, Prompt, Temperature).
           |    |-- integrationNodes.js # Collection of Integration Nodes: Timer, API, Database, Slack, Note.
           |
           |-- App.js                  # The Layout Root. Holds the Header, Toolbar, Canvas, and Properties Panel together.
           |-- ButtonEdge.js           # Custom Edge Component. Renders the connection line with a custom delete button.
           |-- draggableNode.js        # The draggable items in the Toolbar (Sidebar).
           |-- index.css               # Global Styles. Handles Variables (Colors), Dark Mode overrides, and Animations.
           |-- index.js                # The React Entry Point. Mounts <App /> to the DOM.
           |-- PipelineTemplatePanel.js # The UI Modal/Panel for selecting pre-built templates.
           |-- pipelineTemplates.js    # The "Database" of hardcoded templates (JSON data for Resume Parser, Chatbot, etc.).
           |-- store.js                # The Brain (Zustand). Manages Nodes, Edges, Undo/Redo history, and the Simulation Engine state.
           |-- submit.js               # The Submit Button logic. Sends graph data to the Backend API.
           |-- toolbar.js              # The Node Selector Bar (Left/Top). Contains the draggable icons.
           |-- ui.js                   # The React Flow Canvas Wrapper. Handles Drop events, MiniMap, and Grid.
```

---

## Setup Instructions

### Prerequisites

* Node.js (v16+)
* Python (v3.9+)

### 1. Frontend Setup (The Visual Editor)

```bash
cd frontend
npm install

# To run normally (pointing to local backend):
npm start

# OR: To run without starting the local backend (points to live Render backend):
REACT_APP_BACKEND_URL=https://vectorshift-backend-po8u.onrender.com npm start
# (Replace with your actual Render URL if different)
```

### 2. Backend Setup (The DAG Validator)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://127.0.0.1:8000
# Docs available at http://127.0.0.1:8000/docs
```

---

## Screenshots

*(Insert Screenshots Here)*

---

## Engineering Challenges & Edge Cases Handling Details

### 1. The "Over-Rendering" Lag (Performance)
* **Challenge:** Initially, dragging a single node caused the entire canvas to lag. This was because the `BaseNode` was subscribing to the entire `store.activeNodes` array. Even if Node A moved, Node B would re-render to check if it was "active".
* **Solution:** We implemented **Selective Subscriptions** using `zustand/shallow`. Now, a node only re-renders if its *specific* ID enters or leaves the active list.

### 2. Handling Circular Dependencies in Simulation
* **Challenge:** If a user created a loop (Node A -> Node B -> Node A), a naive recursive simulation would crash the browser with a stack overflow.
* **Solution:** The Simulation Engine in `store.js` implements a `visited` Set during its BFS traversal. It tracks nodes processed in the current run cycle and explicitly prevents re-triggering a node that is already "lit," effectively handling loops gracefully.

### 3. Dynamic Text Area Constraints
* **Challenge:** We wanted nodes to auto-resize horizontally and vertically as users typed, but standard text areas natively only support vertical auto-resize (`react-textarea-autosize`), which often broke standard flex layouts.
* **Solution:** We developed `DynamicTextArea.js`, which renders a hidden `<div white-space="pre">` in a 1x1 CSS grid perfectly mirroring the user's text. This natively forces the parent grid to expand precisely to the dimensions of the text block, seamlessly dictating the React Flow node size. When blurred, soft limits apply and a sleek custom scrollbar appears.

### 4. "Ghost Edge" Crashes (Persistence Sanitization)
* **Challenge:** When loading a pipeline from Local Storage, if a saved edge pointed to a node that was deleted in a previous session, React Flow would throw a hard error and crash the entire app.
* **Solution:** We added a sanitization layer in the `loadPipeline` action. It filters the edges against the *current* list of loaded node IDs, silently discarding any "Ghost Edges" before they reach the render engine.

---

## Architecture Decision Record (ADR)

### Why Zustand over Redux?
We chose Zustand because its transient update model is superior for high-frequency updates like dragging nodes (60hz). Redux boilerplate would have made handling the `onNodesChange` events excessively verbose and slower.

### Why separate `BaseNode.js`?
Instead of repeating styling logic (borders, shadows, delete buttons) in every node file, we created a Higher-Order Component (`BaseNode`). This ensures that if we want to change the "Selected" color, we change it in one file, and it propagates to all node types instantly.

### Why Client-Side BFS Simulation?
Instead of requiring a heavy backend execution for simple visual testing, we built a client-side Breadth-First Search (BFS) engine. This allows users to instantly visualize the *flow* of logic without needing valid API keys or server resources, providing immediate tactile feedback.

---

## Future Roadmap & Scalability

* **Branched Numbered Flow Run (Figma-Style):** Support for executing specific sub-flows separately, similar to Figma prototypes where you can run distinct "User Journeys" within a larger board.
* **Real Backend Execution Engine:** Sending the JSON graph to a Python Celery worker to orchestrate actual agentic tasks (e.g., using LangChain/LlamaIndex) based on the topological DAG sorting.
* **Collaborative Editing:** Integrating `yjs` or `Liveblocks` to allow multiple users to drag nodes in the same workspace simultaneously (multiplayer).
* **Custom Node Creator GUI:** Allowing non-technical users to define new node types via a UI builder instead of writing JavaScript components.
* **Versioning and Snapshots:** Storing pipeline diffs to allow users to roll back to previous "published" versions of a flow.

---

## Frequently Asked Questions (FAQ)

**Q: Can I connect any node to any node?**
A: No. The system allows specific, logical connections. The UI actively rejects nonsensical edge creation to keep the pipeline coherent.

**Q: Does it save my work?**
A: Yes. The app uses Local Storage persistence. You can close the tab, restart your browser, and your graph will be exactly where you left it.

**Q: How do I delete a link?**
A: Hover over any connecting line. A red "X" button will appear. Click it to sever the connection.

**Q: Why doesn't the Text Node show scrollbars while typing?**
A: We use a custom-engineered auto-resizing grid. The node physically grows with your content while focused, so you never have to scroll inside a tiny box. Soft constraints only apply when you click away.

---

**Built by Avii 💚**