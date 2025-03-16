import React from 'react';
import { Element, ToolType } from '../App';

interface ToolbarProps {
  onAddElement: (element: Element) => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onAddElement, 
  activeTool, 
  onToolChange 
}) => {
  const addRectangle = () => {
    const rectangle: Element = {
      type: 'rectangle',
      props: {
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        fill: '#10b981', // Use emerald color from our theme
        stroke: 'rgba(0, 0, 0, 0.15)',
        strokeWidth: 1
      }
    };
    onAddElement(rectangle);
  };

  const addCircle = () => {
    const circle: Element = {
      type: 'circle',
      props: {
        cx: 150,
        cy: 150,
        r: 50,
        fill: '#6366f1', // Use indigo color from our theme
        stroke: 'rgba(0, 0, 0, 0.15)',
        strokeWidth: 1
      }
    };
    onAddElement(circle);
  };

  const addText = () => {
    const text: Element = {
      type: 'text',
      props: {
        x: 150,
        y: 150,
        text: 'Hello SVG',
        fontSize: 24,
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        fill: '#1e293b', // Slate 800 from our theme
        stroke: '',
        strokeWidth: 0,
        textAnchor: 'middle'
      }
    };
    onAddElement(text);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Add Elements</h3>
        <div className="tool-buttons">
          <button 
            onClick={addRectangle}
            className="tool-button"
            title="Add Rectangle"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
            </svg>
            <span>Rectangle</span>
          </button>

          <button
            onClick={addCircle}
            className="tool-button"
            title="Add Circle"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
            </svg>
            <span>Circle</span>
          </button>
        </div>

        <button 
          onClick={addText}
          title="Add Text"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M5,5h14v3h-2V7H7v10h3v2H5V5z M15,11h-4v2h2.5c0.8,0,1.5,0.7,1.5,1.5v2c0,0.8-0.7,1.5-1.5,1.5H9v-2h4v-2h-2.5 c-0.8,0-1.5-0.7-1.5-1.5v-2c0-0.8,0.7-1.5,1.5-1.5H15V11z" fill="currentColor" />
          </svg>
          Add Text
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
    </div>
  );
};

export default Toolbar;