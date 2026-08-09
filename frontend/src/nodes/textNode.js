// frontend/src/nodes/textNode.js
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { DynamicTextArea } from './DynamicTextArea';
import { useStore } from '../store';
import { MdTextFields } from 'react-icons/md';

export const TextNode = ({ id, data, selected, width, height }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  // Use nullish coalescing so an empty string "" is not overwritten by the default
  const text = data?.text ?? '{{input}}';

  // 1. Logic: Extract unique variables (now allows numbers and underscores)
  const regex = /{{([a-zA-Z0-9_$]+)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
  }
  const uniqueVars = [...new Set(matches)];

  // 2. Logic: Create dynamic handles (plus a default one if there are no variables)
  let handles = uniqueVars.map((variable, index) => ({
      id: variable,
      type: 'target', 
      position: Position.Left,
      style: { top: `${(index + 1) * (100 / (uniqueVars.length + 1))}%` } 
  }));

  // If there are no variables, provide a default target handle so it always has at least 2 connectors
  if (handles.length === 0) {
      handles.push({ id: 'input', type: 'target', position: Position.Left });
  }

  return (
    <BaseNode
        id={id}
        data={data}
        title="Text"
        icon={<MdTextFields />}
        selected={selected}
        handles={[
            ...handles, 
            { type: 'source', position: Position.Right, id: 'output' }
        ]}
    >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '5px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Text Content:
            </label>
            
            <DynamicTextArea
                value={text} 
                onChange={(e) => updateNodeField(id, 'text', e.target.value)} 
            />

            {/* Variable Chips */}
            {uniqueVars.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                    {uniqueVars.map((v) => (
                        <span key={v} style={{
                            fontSize: '9px',
                            background: 'rgba(99, 102, 241, 0.2)', 
                            color: 'var(--primary-color)',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                            {v}
                        </span>
                    ))}
                </div>
            )}
        </div>
    </BaseNode>
  );
};