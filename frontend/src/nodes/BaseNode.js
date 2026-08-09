// frontend/src/nodes/BaseNode.js
import { Handle, NodeResizer } from 'reactflow'; 
import { useStore } from '../store';
import { MdExtension } from 'react-icons/md';
import { shallow } from 'zustand/shallow';

export const BaseNode = ({ id, data, title, children, handles = [], icon, selected, style = {} }) => {
  const removeNode = useStore((state) => state.removeNode);
  
  // Use selector to specifically check if this node is active during simulation
  const isActive = useStore(
    (state) => state.activeNodes.includes(id),
    shallow 
  );

  return (
    <div 
      className={`base-node ${selected ? 'selected' : ''} ${isActive ? 'active-sim' : ''}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        minWidth: '220px', 
        minHeight: '80px',
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative', 
        ...style,
      }}
    >
      <NodeResizer 
        color="var(--primary-color)" 
        isVisible={selected} 
        minWidth={220} 
        minHeight={80} 
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />

      {/* Close Button */}
      <button 
        onClick={() => removeNode(id)}
        style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
            e.target.style.color = '#fff';
            e.target.style.background = 'var(--danger-color)';
        }}
        onMouseOut={(e) => {
            e.target.style.color = 'var(--text-secondary)';
            e.target.style.background = 'rgba(255,255,255,0.05)';
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          padding: '14px 16px 10px 16px',
          borderBottom: '1px solid var(--border-color)' 
      }}>
        <div style={{ 
            fontSize: '18px', 
            color: 'var(--primary-color)', 
            display: 'flex',
            background: 'var(--input-bg)',
            padding: '6px',
            borderRadius: '8px'
        }}>
            {icon || <MdExtension />}
        </div>
        <span style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.3px' }}>{title}</span>
      </div>

      {/* Content */}
      <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          padding: '16px',
          overflow: 'hidden' 
      }}>
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${id}-${handle.id}-${index}`}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={{
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};