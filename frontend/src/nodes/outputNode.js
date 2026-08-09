// frontend/src/nodes/outputNode.js
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { DynamicTextArea } from './DynamicTextArea';
import { MdOutput } from 'react-icons/md';
import { useStore } from '../store';

export const OutputNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Default values
  const outputName = data?.outputName ?? id.replace('customOutput-', 'output_');
  const outputType = data?.outputType || 'Text';

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      icon={<MdOutput />}
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: 'value' }
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Name
          <div style={{ marginTop: '4px' }}>
            <DynamicTextArea 
                value={outputName} 
                onChange={(e) => updateNodeField(id, 'outputName', e.target.value)} 
            />
          </div>
        </label>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Type
          <select 
            value={outputType} 
            onChange={(e) => updateNodeField(id, 'outputType', e.target.value)}
            className="nodrag"
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};