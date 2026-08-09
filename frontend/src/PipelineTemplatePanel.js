// frontend/src/PipelineTemplatePanel.js
import React from 'react';
import { TEMPLATES } from './pipelineTemplates';
import { useStore } from './store';
import { MdClose, MdLayers, MdCheckCircle, MdPlayArrow } from 'react-icons/md';

export const PipelineTemplatePanel = ({ isOpen, onClose }) => {
    const setPipeline = useStore((state) => state.setPipeline);

    const handleLoadTemplate = (template) => {
        // Load nodes and edges into the store
        setPipeline(template.nodes, template.edges, template.title);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            backgroundColor: 'var(--bg-color)', // Making it solid opaque
            borderLeft: '1px solid var(--border-color)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-4px 0 15px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease-in-out'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--input-bg)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                    <MdLayers size={22} />
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>Pipeline Templates</span>
                </div>
                <button 
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <MdClose size={24} />
                </button>
            </div>

            {/* Template List */}
            <div className='noscroll' style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {TEMPLATES.map((template) => (
                    <div 
                        key={template.id}
                        style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: 'var(--input-bg)',
                            transition: 'all 0.2s',
                            cursor: 'default'
                        }}
                    >
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            {template.tags.map(tag => (
                                <span key={tag} style={{
                                    fontSize: '10px',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    color: 'var(--primary-color)',
                                    fontWeight: '600'
                                }}>
                                    {tag.toUpperCase()}
                                </span>
                            ))}
                        </div>

                        {/* Title & Desc */}
                        <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{template.title}</h4>
                        <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {template.description}
                        </p>

                        {/* Requirements */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                                REQUIREMENTS:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {template.requirements.map(req => (
                                    <div key={req} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-primary)' }}>
                                        <MdPlayArrow size={14} color="#fbbf24" /> {req}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => handleLoadTemplate(template)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#818cf8',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background-color 0.2s',
                                fontSize: '14px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#6366f1';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#818cf8';
                            }}
                        >
                            <MdCheckCircle size={16} style={{pointerEvents: 'none'}} /> Use Template
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};