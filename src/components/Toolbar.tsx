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
        width: 100,
        height: 80,
        fill: '#4CAF50',
        stroke: '#333',
        strokeWidth: 2
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
        fill: '#2196F3',
        stroke: '#333',
        strokeWidth: 2
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
        fontFamily: 'Arial',
        fill: '#333',
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
        <button onClick={addRectangle}>Rectangle</button>
        <button onClick={addCircle}>Circle</button>
        <button onClick={addText}>Text</button>
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
              <path d="M7,2L7,2l10,10l-10,10V2z" fill="currentColor" />
            </svg>
            <span>Select</span>
          </button>
          
          <button 
            className={`tool-button ${activeTool === 'scale' ? 'active' : ''}`}
            onClick={() => onToolChange('scale')}
            title="Scale Tool"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3,3h6v2H5v4H3V3z M21,3h-6v2h4v4h2V3z M3,21h6v-2H5v-4H3V21z M21,21h-6v-2h4v-4h2V21z" fill="currentColor" />
            </svg>
            <span>Scale</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;