import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { MdCheckCircle, MdCancel } from "react-icons/md";

export const SubmitButton = () => {
  const { nodes, edges } = useStore(
    (state) => ({ nodes: state.nodes, edges: state.edges }),
    shallow,
  );

  const handleSubmit = async () => {
    const toastId = toast.loading("Checking Pipeline...");

    try {
      // NOTE FOR REVIEWER: 
      // This defaults to localhost:8000. If deployed on Vercel/Render, 
      // configure REACT_APP_BACKEND_URL to point to the live backend.
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/pipelines/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Update loading toast to success/error
      toast.update(toastId, {
        render: (
          <div
            style={{
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <strong style={{ fontSize: "14px", color: 'var(--success-color)' }}>Submission Successful!</strong>
            <div style={{display: 'flex', gap: '10px', color: 'var(--text-secondary)'}}>
                <span>Nodes: <strong style={{color: 'var(--text-primary)'}}>{data.num_nodes}</strong></span>
                <span>Edges: <strong style={{color: 'var(--text-primary)'}}>{data.num_edges}</strong></span>
            </div>
            <div style={{
                background: data.is_dag ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: data.is_dag ? 'var(--success-color)' : 'var(--danger-color)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600',
                width: 'fit-content'
            }}>
                Is DAG: {data.is_dag ? (
                    <>Yes <MdCheckCircle size={14} /></>
                ) : (
                    <>No <MdCancel size={14} /></>
                )}
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 5000,
        position: "bottom-right",
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error: Backend not reachable",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={handleSubmit}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)",
          color: "#fff",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        }}
      >
        Submit Pipeline
      </button>
    </div>
  );
};
