// frontend/src/draggableNode.js

export const DraggableNode = ({ type, label, icon }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ 
          cursor: 'grab', 
          minWidth: '45px', 
          height: '45px',
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: '8px',
          backgroundColor: 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          justifyContent: 'center', 
          flexDirection: 'column',
          gap: '2px'
        }} 
        draggable
      >
          {/* Icon Color inherits from text-primary */}
          <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{icon}</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: '500' }}>{label}</span>
      </div>
    );
  };