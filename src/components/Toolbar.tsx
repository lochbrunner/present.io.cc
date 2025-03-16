import React from 'react';
import { ToolType } from '../App';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  showSettings?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  activeTool, 
  onToolChange,
  showSettings = false
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Draw</h3>
        <div className="tool-buttons">
          <button 
            className={`tool-button ${activeTool === 'rectangle' ? 'active' : ''}`}
            onClick={() => onToolChange('rectangle')}
            title="Rectangle Tool"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
            </svg>
            <span>Rectangle</span>
          </button>

          <button
            className={`tool-button ${activeTool === 'circle' ? 'active' : ''}`}
            onClick={() => onToolChange('circle')}
            title="Circle Tool"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
            </svg>
            <span>Circle</span>
          </button>
        </div>

        <button 
          className={`${activeTool === 'text' ? 'active' : ''}`}
          onClick={() => onToolChange('text')}
          title="Text Tool"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M5,5h14v3h-2V7H7v10h3v2H5V5z M15,11h-4v2h2.5c0.8,0,1.5,0.7,1.5,1.5v2c0,0.8-0.7,1.5-1.5,1.5H9v-2h4v-2h-2.5 c-0.8,0-1.5-0.7-1.5-1.5v-2c0-0.8,0.7-1.5,1.5-1.5H15V11z" fill="currentColor" />
          </svg>
          Text Tool
        </button>
      </div>
      
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button 
            className={`tool-button ${activeTool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
            title="Select Tool"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M13.75,6.4L20,12.65V19a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V5A2,2,0,0,1,6,3h6.35l1.4,3.4ZM8.4,13.32l2.57,2.57,5.65-5.65-2.57-2.57Z" fill="currentColor" />
            </svg>
            <span>Select</span>
          </button>
          
          <button 
            className={`tool-button ${activeTool === 'scale' ? 'active' : ''}`}
            onClick={() => onToolChange('scale')}
            title="Scale Tool"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M20,6.91V4a1,1,0,0,0-1-1H16.09a.5.5,0,0,0-.35.85l1.06,1.06L12.85,8.86a.5.5,0,0,0,0,.71l1.42,1.42a.5.5,0,0,0,.71,0l3.95-4L20,8.06A.5.5,0,0,0,20.85,7.71.49.49,0,0,0,20,6.91ZM13.27,17.42,11.85,19a.5.5,0,0,0,0,.71l1.42,1.42a.5.5,0,0,0,.71,0l1.57-1.56L16.61,20.5a.5.5,0,0,0,.85-.35V16.91a.5.5,0,0,0-.5-.5H13.71a.5.5,0,0,0-.35.85Z M4.4,4H7.79a.5.5,0,0,0,.35-.85L7.08,2.08,8.64.52a.5.5,0,0,0,0-.71L7.23,1.23a.5.5,0,0,1-.71,0L5,2.74,3.94,1.65A.5.5,0,0,0,3.59,2.5H7.09a.5.5,0,0,1,.5.5V7.24a.5.5,0,0,0,.85.35L9.5,6.53,11.07,8.1a.5.5,0,0,1,0,.71L9.65,10.23a.5.5,0,0,1-.71,0L7.38,8.67,6.32,9.74a.5.5,0,0,0,.35.85H3.59a.5.5,0,0,0-.35.85l1.06,1.06L3.24,13.56a.5.5,0,0,0,0,.71L4.65,15.7a.5.5,0,0,0,.71,0l1.06-1.06a.5.5,0,0,0-.35-.85H3.4a1,1,0,0,1-1-1V4.91A1,1,0,0,1,3.4,4Z" fill="currentColor" />
            </svg>
            <span>Scale</span>
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Options</h3>
        <button 
          className={`settings-button ${showSettings ? 'active' : ''}`}
          onClick={() => onToolChange('settings')}
          title="Settings"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor" />
          </svg>
          Canvas Settings
        </button>
      </div>

      <div className="toolbar-section">
        <h3>Instructions</h3>
        <div className="toolbar-instructions">
          <p>Select a drawing tool and drag on the canvas to create elements.</p>
          <p>Use the Select tool to move elements or select multiple with Shift+Click.</p>
          <p>Use the Scale tool to resize elements.</p>
          <p>Press Escape to cancel drawing or deselect all.</p>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;