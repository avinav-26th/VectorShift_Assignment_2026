import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  MdInput, MdOutput, MdTextFields, MdChat, 
  MdTimer, MdApi, MdStorage, MdMessage, MdNote,
  MdDelete, MdAdd
} from 'react-icons/md';

export const PipelineToolbar = () => {
    const clearCanvas = useStore((state) => state.clearCanvas); 
    const [showModal, setShowModal] = useState(false);
    const [dontAsk, setDontAsk] = useState(false);
    const [showCustomMsg, setShowCustomMsg] = useState(false);

    const handleClearClick = () => {
        if (localStorage.getItem('skipClearConfirm') === 'true') {
            clearCanvas();
        } else {
            setShowModal(true);
        }
    };

    const confirmClear = () => {
        if (dontAsk) localStorage.setItem('skipClearConfirm', 'true');
        clearCanvas();
        setShowModal(false);
    };

    const handleModalKeyDown = (e) => {
        if (e.key === 'Enter') confirmClear();
    };

    const handleCustomClick = () => {
        setShowCustomMsg(true);
        setTimeout(() => setShowCustomMsg(false), 5000);
    };

    return (
        <div style={{
            backgroundColor: 'var(--node-bg)', 
            padding: '8px 20px', 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '24px', 
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)'
        }}>
            {/* General Section */}
            <div>
                <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    General
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <DraggableNode type='customInput' label='Input' icon={<MdInput />} />
                    <DraggableNode type='llm' label='LLM' icon={<MdChat />} />
                    <DraggableNode type='customOutput' label='Output' icon={<MdOutput />} />
                    <DraggableNode type='text' label='Text' icon={<MdTextFields />} />
                </div>
            </div>

            {/* Divider */}
            <div style={{height: '34px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 8px'}}></div>
            
            {/* Integrations Section */}
            <div>
                <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Integrations
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <DraggableNode type='timer' label='Timer' icon={<MdTimer />} />
                    <DraggableNode type='api' label='API' icon={<MdApi />} />
                    <DraggableNode type='database' label='Data' icon={<MdStorage />} />
                    <DraggableNode type='slack' label='Slack' icon={<MdMessage />} />
                    <DraggableNode type='note' label='Note' icon={<MdNote />} />
                </div>
            </div>

            {/* Divider */}
            <div style={{height: '34px', width: '1px', backgroundColor: 'var(--border-color)', margin: '0 8px'}}></div>

            {/* Custom Section */}
            <div>
                <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Custom
                </div>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <button 
                        onClick={handleCustomClick}
                        style={{
                            background: 'var(--input-bg)',
                            border: '1px dashed var(--border-color)',
                            color: 'var(--text-secondary)',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                            e.currentTarget.style.color = 'var(--primary-color)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <MdAdd size={20} />
                    </button>
                    {showCustomMsg && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: '8px',
                            background: 'var(--primary-color)',
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                            zIndex: 100,
                            lineHeight: '1.4',
                            textAlign: 'center'
                        }}>
                            Future Feature: Create a custom node<br/>by selecting fields, options, and logic.
                        </div>
                    )}
                </div>
            </div>

            {/* Clear Button */}
            <button 
                onClick={handleClearClick}
                style={{
                    marginLeft: 'auto', 
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--danger-color)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    height: '30px'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--danger-color)';
                    e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = 'var(--danger-color)';
                }}
            >
                <MdDelete size={16} /> Clear Canvas
            </button>

            {/* Confirmation Modal */}
            {showModal && ReactDOM.createPortal(
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onKeyDown={handleModalKeyDown}
                >
                    <div style={{
                        background: 'var(--bg-color)', padding: '24px', borderRadius: '12px',
                        width: '320px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                        border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column'
                    }}>
                        <h3 style={{marginTop: 0, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '10px'}}>Clear Canvas?</h3>
                        <p style={{fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: 0}}>
                            Are you sure you want to clear the entire canvas? All unsaved work will be lost.
                        </p>
                        
                        <label style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', cursor: 'pointer', width: 'fit-content'}}>
                            <input type="checkbox" checked={dontAsk} onChange={(e) => setDontAsk(e.target.checked)} style={{margin: 0, width: 'auto'}} />
                            Do not ask again
                        </label>
                        
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px'}}>
                            <button onClick={() => setShowModal(false)} style={{
                                padding: '8px 16px', borderRadius: '6px', background: 'transparent', 
                                border: '1px solid var(--border-color)', cursor: 'pointer', 
                                color: 'var(--text-primary)', fontWeight: '600'
                            }}>
                                Cancel
                            </button>
                            <button autoFocus onClick={confirmClear} style={{
                                padding: '8px 16px', borderRadius: '6px', background: 'var(--danger-color)', 
                                color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                            }}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};