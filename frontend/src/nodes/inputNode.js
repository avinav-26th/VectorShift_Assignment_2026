// frontend/src/nodes/inputNode.js
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { DynamicTextArea } from './DynamicTextArea';
import { MdInput } from 'react-icons/md';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Default values if not set in data
  const inputName = data?.inputName || id.replace('customInput-', 'input_');
  const inputType = data?.inputType || 'Text';

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      icon={<MdInput />}
      selected={selected}
      handles={[
        { type: 'source', position: Position.Right, id: 'value' }
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Name
          <div style={{ marginTop: '4px' }}>
            <DynamicTextArea 
                value={inputName} 
                onChange={(e) => updateNodeField(id, 'inputName', e.target.value)} 
            />
          </div>
        </label>
        
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Type
          <select 
            value={inputType} 
            onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}
            className="nodrag"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="JSON">JSON</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};