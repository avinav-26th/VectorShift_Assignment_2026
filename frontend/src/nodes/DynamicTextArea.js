import React, { useState, useRef } from 'react';

export const DynamicTextArea = ({ value, onChange, placeholder = "" }) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    
    // Soft limits for maximum expansion before scrolling kicks in
    const softMaxWidth = '300px';
    const softMaxHeight = '400px';

    const handleChange = (e) => {
        let val = e.target.value;
        const cursor = e.target.selectionStart;

        // Auto-close double curly braces
        // If the user just typed '{' resulting in '{{' before the cursor
        if (cursor >= 2 && val.substring(cursor - 2, cursor) === '{{') {
            // Check if it doesn't already have closing braces right after it
            if (val.substring(cursor, cursor + 2) !== '}}') {
                val = val.substring(0, cursor) + '}}' + val.substring(cursor);
                
                // Create a fake event to pass up to the parent
                const fakeEvent = {
                    ...e,
                    target: { ...e.target, value: val }
                };
                onChange(fakeEvent);

                // Asynchronously move cursor back inside the braces
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.setSelectionRange(cursor, cursor);
                    }
                }, 0);
                return;
            }
        }
        
        onChange(e);
    };

    return (
        <div 
            className="dynamic-textarea-container"
            style={{
                display: 'grid',
                width: '100%',
                // ALWAYS apply maximums so there is absolutely no jumping on focus/blur
                maxWidth: softMaxWidth,
                maxHeight: softMaxHeight,
                overflow: 'auto',
                position: 'relative',
                borderRadius: '6px',
            }}
        >
            {/* Hidden measuring element that mirrors text perfectly */}
            <div 
                style={{
                    gridArea: '1 / 1',
                    visibility: 'hidden',
                    // ALWAYS use pre-wrap so the text actually wraps when it hits the 300px maxWidth!
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    padding: '8px',
                    border: '1px solid transparent', 
                }}
            >
                {/* Adding a space ensures empty trailing newlines render correctly in HTML */}
                {value + ' '} 
            </div>
            
            {/* Actual Textarea that perfectly covers the grid cell */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="nodrag" // Prevents react-flow node dragging when interacting with this
                style={{
                    gridArea: '1 / 1',
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    lineHeight: '1.4',
                    overflow: 'hidden', // Let the parent container handle scrolling
                    transition: 'border-color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onMouseOut={(e) => { if (!isFocused) e.target.style.borderColor = 'var(--border-color)' }}
            />
        </div>
    );
};
