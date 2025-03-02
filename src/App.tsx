import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

// Define element interface
export interface Element {
  type: 'rectangle' | 'circle' | 'text';
  props: {
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    width?: number;
    height?: number;
    r?: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    textAnchor?: string;
  };
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);

  const addElement = (element: Element) => {
    setElements([...elements, element]);
  };

  const updateElementPosition = (index: number, x: number, y: number) => {
    setElements(prevElements => {
      const newElements = [...prevElements];
      const element = {...newElements[index]};
      
      if (element.type === 'rectangle' || element.type === 'text') {
        element.props = {
          ...element.props,
          x,
          y
        };
      } else if (element.type === 'circle') {
        element.props = {
          ...element.props,
          cx: x,
          cy: y
        };
      }
      
      newElements[index] = element;
      return newElements;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Present.io</h1>
        <div className="app-controls">
          <small>Shift+Click for multi-select • Escape to deselect all</small>
        </div>
      </header>
      <main className="app-main">
        <Toolbar onAddElement={addElement} />
        <Canvas 
          elements={elements} 
          onUpdateElementPosition={updateElementPosition}
        />
      </main>
    </div>
  );
};

export default App;