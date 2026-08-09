// frontend/src/nodes/integrationNodes.js
import { useState, useEffect } from 'react';
import { MdTimer, MdApi, MdStorage, MdMessage, MdNote, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { DynamicTextArea } from './DynamicTextArea';

export const TimerNode = ({ id, data, selected }) => (
    <BaseNode id={id} data={data} title="Timer" icon={<MdTimer />} selected={selected} handles={[{ type: 'source', position: Position.Right, id: 'time' }]}>
       <div style={{fontSize: '12px', color: '#aaa'}}>Runs every {data?.interval ?? '5'} {data?.unit ?? 'mins'}</div>
    </BaseNode>
);

export const SlackNode = ({ id, data, selected }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const channel = data?.channel ?? '#general';

    return (
        <BaseNode id={id} data={data} title="Slack" icon={<MdMessage />} selected={selected} handles={[{ type: 'target', position: Position.Left, id: 'msg' }]}>
            <label style={{display:'block', fontSize:'11px', color:'var(--text-secondary)', marginBottom:'4px'}}>Channel</label>
            <DynamicTextArea 
                value={channel}
                onChange={(e) => updateNodeField(id, 'channel', e.target.value)}
            />
        </BaseNode>
    );
};

export const DatabaseNode = ({ id, data, selected }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    
    // We keep uploading state local because it's purely ephemeral UI state
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileName = data?.fileName || '';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (ext !== 'pdf' && ext !== 'csv') {
                alert("Only .pdf and .csv files are allowed.");
                return;
            }
            setUploading(true);
            setProgress(0);
        }
    };

    useEffect(() => {
        let interval;
        if (uploading) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setUploading(false);
                        updateNodeField(id, 'fileName', "knowledge_base.pdf");
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
        return () => clearInterval(interval);
    }, [uploading, id, updateNodeField]);

    return (
        <BaseNode id={id} data={data} title="Knowledge Base" icon={<MdStorage />} selected={selected} handles={[{ type: 'source', position: Position.Right, id: 'data' }]}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>
                    Upload PDF/CSV to index.
                </div>
                
                {!fileName && !uploading && (
                     <label style={{
                         border: '1px dashed var(--border-color)', borderRadius: '6px', padding: '10px',
                         display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                         color: 'var(--text-secondary)', fontSize: '10px'
                     }}>
                         <MdCloudUpload size={20} />
                         <span>Click to Upload</span>
                         <input type="file" accept=".pdf,.csv" style={{display: 'none'}} onChange={handleFileChange} />
                     </label>
                )}

                {uploading && (
                    <div style={{width: '100%', background: 'var(--border-color)', height: '6px', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{width: `${progress}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.2s'}}></div>
                    </div>
                )}

                {fileName && !uploading && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--success-color)'}}>
                        <MdCheckCircle />
                        <span style={{color: 'var(--text-primary)'}}>{fileName}</span>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export const APINode = ({ id, data, selected }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const url = data?.url ?? '';

    return (
        <BaseNode id={id} data={data} title="API Call" icon={<MdApi />} selected={selected} handles={[
            { type: 'target', position: Position.Left, id: 'req' },
            { type: 'source', position: Position.Right, id: 'res' }
        ]}>
            <label style={{display:'block', fontSize:'11px', color:'var(--text-secondary)', marginBottom:'4px'}}>Endpoint</label>
            <DynamicTextArea 
                value={url}
                onChange={(e) => updateNodeField(id, 'url', e.target.value)}
                placeholder="https://api..." 
            />
        </BaseNode>
    );
};

export const NoteNode = ({ id, data, selected }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const text = data?.text ?? '';

    return (
        <BaseNode id={id} data={data} title="Note" icon={<MdNote />} selected={selected}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '80px' }}>
                <DynamicTextArea
                    value={text}
                    onChange={(e) => updateNodeField(id, 'text', e.target.value)}
                    placeholder="Type your note..."
                />
            </div>
        </BaseNode>
    );
};