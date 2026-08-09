// frontend/src/App.js
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { PropertiesPanel } from './Properties';
import { PipelineTemplatePanel } from './PipelineTemplatePanel';
import { useState, useEffect } from 'react';
import { useStore } from './store'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDarkMode, MdLightMode, MdPlayArrow, MdFeaturedPlayList, MdCheckCircle, MdEdit } from 'react-icons/md';

function App() {
  const { undo, redo, isRunning, loadPipeline, savePipeline, saveStatus, pipelineTitle, setPipelineTitle } = useStore(state => ({
    undo: state.undo,
    redo: state.redo,
    isRunning: state.isRunning,
    loadPipeline: state.loadPipeline,
    savePipeline: state.savePipeline,
    saveStatus: state.saveStatus,
    pipelineTitle: state.pipelineTitle,
    setPipelineTitle: state.setPipelineTitle
  }));

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  useEffect(() => {
    const handleUnload = () => savePipeline();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [savePipeline]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleRun = () => {
    useStore.getState().runSimulation();
  };

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
        setPipelineTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 24px', height: '50px', borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--node-bg)', backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ 
                width: '32px', height: '32px', borderRadius: '8px', 
                background: 'linear-gradient(135deg, var(--primary-color), #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px'
            }}>
                VS
            </div>
            <div style={{fontWeight: '700', fontSize: '16px', color: 'var(--text-primary)', letterSpacing: '-0.5px'}}>
                VectorShift
            </div>
        </div>

        {/* CENTER TITLE */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isEditingTitle ? (
                <input
                    autoFocus
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                    style={{
                        background: 'var(--input-bg)',
                        border: '1px solid var(--primary-color)',
                        color: 'var(--text-primary)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                        outline: 'none',
                        width: '200px'
                    }}
                />
            ) : (
                <div 
                    onClick={() => {
                        setTempTitle(pipelineTitle);
                        setIsEditingTitle(true);
                    }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {pipelineTitle}
                    </span>
                    <MdEdit size={14} color="var(--text-secondary)" />
                </div>
            )}
        </div>
        
        <div style={{display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end'}}>
           
           {/* save status indicator */}
           <div style={{ width: '80px', display: 'flex', justifyContent: 'flex-end' }}>
               {saveStatus === 'saving' && (
                    <div style={{
                        padding: '4px 10px', borderRadius: '20px', backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        <span className="spinner" style={{width: 12, height: 12, border: '2px solid var(--text-secondary)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite'}}></span>
                        Saving...
                    </div>
               )}
               {saveStatus === 'saved' && (
                    <div style={{
                        padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--success-color)', fontSize: '12px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s'
                    }}>
                        <MdCheckCircle size={14} color="var(--success-color)" /> Saved
                    </div>
               )}
           </div>

           <button 
             onClick={() => setIsTemplatePanelOpen(true)}
             style={{
               display: 'flex', alignItems: 'center', gap: '6px',
               background: 'var(--input-bg)', border: '1px solid var(--border-color)', 
               color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', 
               cursor: 'pointer', fontSize: '12px', fontWeight: '600',
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => e.currentTarget.style.background = 'var(--border-color)'}
             onMouseOut={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
           >
             <MdFeaturedPlayList size={16} /> Templates
           </button>

           <button 
             onClick={handleRun}
             disabled={isRunning}
             style={{
               display: 'flex', alignItems: 'center', gap: '6px',
               background: isRunning ? 'var(--input-bg)' : 'rgba(16, 185, 129, 0.1)', 
               border: isRunning ? 'none' : '1px solid rgba(16, 185, 129, 0.3)',
               color: isRunning ? 'var(--text-secondary)' : 'var(--success-color)', 
               padding: '6px 12px', borderRadius: '6px', 
               cursor: isRunning ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600',
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => {
                 if(!isRunning) {
                     e.currentTarget.style.background = 'var(--success-color)';
                     e.currentTarget.style.color = '#fff';
                 }
             }}
             onMouseOut={(e) => {
                 if(!isRunning) {
                     e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                     e.currentTarget.style.color = 'var(--success-color)';
                 }
             }}
           >
             <MdPlayArrow size={18} /> {isRunning ? 'Running...' : 'Run'}
           </button>

           <SubmitButton /> 

           <div style={{width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 4px'}}></div>

           <button 
             onClick={toggleTheme}
             style={{
               background: 'var(--input-bg)', border: '1px solid var(--border-color)', 
               color: 'var(--text-primary)', padding: '8px', borderRadius: '50%',
               cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
               transition: 'all 0.2s'
             }}
           >
             {isDarkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
           </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             <PipelineToolbar />
             <div style={{ flex: 1, position: 'relative' }}>
                <PipelineUI />
             </div>
          </div>

          <PropertiesPanel />
          
          <PipelineTemplatePanel 
            isOpen={isTemplatePanelOpen} 
            onClose={() => setIsTemplatePanelOpen(false)} 
          />
      </div>

      <ToastContainer position="bottom-right" theme={isDarkMode ? "dark" : "light"} />
    </div>
  );
}

export default App;