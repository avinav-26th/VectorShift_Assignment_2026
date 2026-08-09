// frontend/src/Properties.js
import React, { useState, useRef } from 'react';
import { useStore } from './store';
import { MdSettings, MdClose } from 'react-icons/md';

// --- Shared Styles ---
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' };
const inputStyle = { width: '100%', marginBottom: '15px' };

// --- Property Sub-Components ---
const InputNodeProperties = ({ node, handleChange }) => {
    const inputName = node.data.inputName || node.id.replace('customInput-', 'input_');
    return (
        <>
            <label style={labelStyle}>Field Name</label>
            <input type="text" value={inputName} onChange={(e) => handleChange('inputName', e.target.value)} style={inputStyle} />
            
            <label style={labelStyle}>Data Type</label>
            <select value={node.data.inputType || 'Text'} onChange={(e) => handleChange('inputType', e.target.value)} style={inputStyle}>
                <option value="Text">Text</option>
                <option value="File">File</option>
                <option value="JSON">JSON</option>
            </select>
        </>
    );
};

const OutputNodeProperties = ({ node, handleChange }) => {
    const outputName = node.data.outputName ?? node.id.replace('customOutput-', 'output_');
    return (
        <>
            <label style={labelStyle}>Output Name</label>
            <input type="text" value={outputName} onChange={(e) => handleChange('outputName', e.target.value)} style={inputStyle} />
            
            <label style={labelStyle}>Output Type</label>
            <select value={node.data.outputType || 'Text'} onChange={(e) => handleChange('outputType', e.target.value)} style={inputStyle}>
                <option value="Text">Text</option>
                <option value="Image">Image</option>
            </select>
        </>
    );
};

const LLMNodeProperties = ({ node, handleChange }) => (
    <>
         <label style={labelStyle}>Model</label>
         <select value={node.data.model || 'gpt-3.5'} onChange={(e) => handleChange('model', e.target.value)} style={inputStyle}>
            <option value="gpt-3.5">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3">Claude 3 Opus</option>
         </select>

         <label style={labelStyle}>Temperature: {node.data.temperature ?? 0.5}</label>
         <input 
            type="range" min="0" max="1" step="0.1"
            value={node.data.temperature ?? 0.5} 
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            style={{
                width: '100%', marginBottom: '15px', 
                accentColor: 'var(--primary-color)', 
                outline: 'none', background: 'transparent', padding: 0
            }}
         />

         <label style={labelStyle}>System Prompt</label>
         <textarea 
            rows={4} 
            value={node.data.systemMessage || ''} 
            onChange={(e) => handleChange('systemMessage', e.target.value)}
            style={inputStyle}
            className="nodrag"
         />
    </>
);

const TextNodeProperties = ({ node, handleChange }) => (
    <>
        <label style={labelStyle}>Text Content</label>
        <textarea 
            rows={4} 
            value={node.data.text || ''} 
            onChange={(e) => handleChange('text', e.target.value)}
            style={inputStyle}
            className="nodrag"
        />
        <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>
            Variables detected: {
                (node.data.text?.match(/{{[a-zA-Z_$][a-zA-Z0-9_$]*}}/g) || [])
                .map(v => v.replace(/{{|}}/g, '')).join(', ') || 'None'
            }
        </div>
    </>
);

const APINodeProperties = ({ node, handleChange }) => (
    <>
        <label style={labelStyle}>API Url</label>
        <input type="text" value={node.data.url || ''} onChange={(e) => handleChange('url', e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Method</label>
        <select value={node.data.method || 'GET'} onChange={(e) => handleChange('method', e.target.value)} style={inputStyle}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
        </select>

        <label style={labelStyle}>Headers (JSON)</label>
        <textarea 
            rows={3} 
            value={node.data.headers || '{"Content-Type": "application/json"}'} 
            onChange={(e) => handleChange('headers', e.target.value)}
            style={inputStyle}
            className="nodrag"
        />
    </>
);

const SlackNodeProperties = ({ node, handleChange }) => (
    <>
        <label style={labelStyle}>Slack Channel</label>
        <input type="text" value={node.data.channel || ''} onChange={(e) => handleChange('channel', e.target.value)} style={inputStyle} placeholder="#general" />
    </>
);

const DatabaseNodeProperties = ({ node, handleChange }) => (
    <>
        <label style={labelStyle}>Database / File Name</label>
        <input type="text" value={node.data.fileName || ''} onChange={(e) => handleChange('fileName', e.target.value)} style={inputStyle} />
    </>
);

const TimerNodeProperties = ({ node, handleChange }) => {
    const interval = node.data.interval || 5;
    const unit = node.data.unit || 'mins';
    return (
        <>
            <label style={labelStyle}>Interval</label>
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <input 
                    type="number" min="1" 
                    value={interval} 
                    onChange={(e) => handleChange('interval', e.target.value)} 
                    style={{...inputStyle, marginBottom: 0, flex: 1}} 
                />
                <select 
                    value={unit} 
                    onChange={(e) => handleChange('unit', e.target.value)} 
                    style={{...inputStyle, marginBottom: 0, flex: 1}}
                >
                    <option value="ms">Milliseconds</option>
                    <option value="secs">Seconds</option>
                    <option value="mins">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
            </div>
        </>
    );
};

const NoteNodeProperties = ({ node, handleChange }) => (
    <>
        <label style={labelStyle}>Note Content</label>
        <textarea 
            rows={4} 
            value={node.data.text || ''} 
            onChange={(e) => handleChange('text', e.target.value)}
            style={inputStyle}
            className="nodrag"
        />
    </>
);

// --- Component Registry Mapping ---
const PropertyComponents = {
    customInput: InputNodeProperties,
    customOutput: OutputNodeProperties,
    llm: LLMNodeProperties,
    text: TextNodeProperties,
    api: APINodeProperties,
    slack: SlackNodeProperties,
    database: DatabaseNodeProperties,
    timer: TimerNodeProperties,
    note: NoteNodeProperties
};

// --- Main Panel Component ---
export const PropertiesPanel = () => {
    const nodes = useStore((state) => state.nodes);
    const updateNodeField = useStore((state) => state.updateNodeField);
    
    const selectedNode = nodes.find((n) => n.selected);

    // Widget State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 80 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    // Keyboard shortcut for Cmd/Ctrl + i
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                if (selectedNode) {
                    setIsCollapsed((prev) => !prev);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNode]);

    const handleMouseDown = (e) => {
        dragging.current = true;
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (dragging.current) {
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y
            });
        }
    };

    const handleMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleChange = (field, value) => {
        if (selectedNode) updateNodeField(selectedNode.id, field, value);
    };

    if (!selectedNode) return null;

    // Dynamically select the correct component based on node type
    const SpecificProperties = PropertyComponents[selectedNode.type];

    return (
        <div style={{
            position: 'absolute',
            left: isCollapsed ? 'auto' : position.x,
            right: isCollapsed ? 20 : 'auto',
            top: isCollapsed ? 100 : position.y,
            width: isCollapsed ? '50px' : '300px',
            backgroundColor: 'var(--node-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: isCollapsed ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        }}>
            {/* Header / Drag Handle */}
            <div 
                onMouseDown={!isCollapsed ? handleMouseDown : undefined}
                style={{
                    padding: '12px 15px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderBottom: !isCollapsed ? '1px solid var(--border-color)' : 'none',
                    cursor: !isCollapsed ? 'move' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    color: 'var(--text-primary)'
                }}
                onClick={() => isCollapsed && setIsCollapsed(false)}
            >
                {isCollapsed ? (
                    <MdSettings size={24} />
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MdSettings />
                            <span style={{fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px'}}>Properties</span>
                        </div>
                        <div 
                            onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }} 
                            style={{ cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '4px' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                             <MdClose /> 
                        </div>
                    </>
                )}
            </div>

            {/* Content Area */}
            {!isCollapsed && (
                <div style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                     
                     {/* Common Info Header */}
                     <div style={{
                         marginBottom: '20px', paddingBottom: '15px', 
                         borderBottom: '1px solid var(--border-color)',
                         background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px'
                     }}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <div style={{fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px'}}>Type</div>
                                <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--primary-color)'}}>
                                    {selectedNode.data.label || selectedNode.type === 'customInput' ? 'Input' : 
                                     selectedNode.type === 'customOutput' ? 'Output' : 
                                     selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                                </div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px'}}>ID</div>
                                <div style={{fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-primary)', opacity: 0.8}}>
                                    {selectedNode.id}
                                </div>
                            </div>
                        </div>
                     </div>

                     {/* Dynamic Fields */}
                     {SpecificProperties ? (
                         <SpecificProperties node={selectedNode} handleChange={handleChange} />
                     ) : (
                         <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>No properties available for this node type.</div>
                     )}

                </div>
            )}
        </div>
    );
};