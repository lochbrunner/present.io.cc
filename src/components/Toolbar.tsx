import React from 'react';
import { Element } from '../App';

interface ToolbarProps {
  onAddElement: (element: Element) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddElement }) => {
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
      <button onClick={addRectangle}>Rectangle</button>
      <button onClick={addCircle}>Circle</button>
      <button onClick={addText}>Text</button>
    </div>
  );
};

export default Toolbar;