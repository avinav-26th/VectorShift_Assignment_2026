// frontend/src/nodes/llmNode.js
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { DynamicTextArea } from './DynamicTextArea';
import { MdChat } from 'react-icons/md';

import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      icon={<MdChat />}
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: 'system', style: { top: '30%' } },
        { type: 'target', position: Position.Left, id: 'prompt', style: { top: '70%' } },
        { type: 'source', position: Position.Right, id: 'response' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', height: '100%' }}>
        
        {/* Main info area that grows */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '2px' }}>
                System Prompt:
            </div>
            <DynamicTextArea 
                value={data.systemMessage ?? "You are a helpful assistant..."}
                onChange={(e) => updateNodeField(id, 'systemMessage', e.target.value)}
                isResized={data?.isResized}
            />
        </div>
        
        {/* Footer info */}
        <div style={{ 
            fontSize: '9px', color: 'var(--primary-color)', 
            marginTop: 'auto', paddingTop: '5px', borderTop: '1px solid var(--border-color)' 
        }}>
            <span>Model: {data.model || 'gpt-3.5'}</span> | 
            <span title="Controls randomness/creativity (0 = deterministic, 1 = creative)"> Temp: {data.temperature || 0.5}</span>
        </div>
      </div>
    </BaseNode>
  );
};