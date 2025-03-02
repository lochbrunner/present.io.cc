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

// Tool types that can be selected
export type ToolType = 'select' | 'scale';

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  
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

  const resizeElement = (index: number, newWidth: number, newHeight: number) => {
    setElements(prevElements => {
      const newElements = [...prevElements];
      const element = {...newElements[index]};
      
      if (element.type === 'rectangle') {
        element.props = {
          ...element.props,
          width: newWidth,
          height: newHeight
        };
      } else if (element.type === 'circle') {
        // For circles, use the average of width and height for radius
        const newRadius = Math.max(newWidth, newHeight) / 2;
        element.props = {
          ...element.props,
          r: newRadius
        };
      } else if (element.type === 'text') {
        // For text, scale font size proportionally to height
        const currentFontSize = element.props.fontSize || 16;
        const originalHeight = 20; // Approximate default text height
        const scaleFactor = newHeight / originalHeight;
        
        element.props = {
          ...element.props,
          fontSize: currentFontSize * scaleFactor
        };
      }
      
      newElements[index] = element;
      return newElements;
    });
  };

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Present.io</h1>
        <div className="app-controls">
          <small>Shift+Click for multi-select • Escape to deselect all • Use Scale tool to resize elements</small>
        </div>
      </header>
      <main className="app-main">
        <Toolbar 
          onAddElement={addElement} 
          activeTool={activeTool}
          onToolChange={handleToolChange}
        />
        <div className="canvas-wrapper">
          <Canvas 
            elements={elements} 
            onUpdateElementPosition={updateElementPosition}
            onResizeElement={resizeElement}
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            activeTool={activeTool}
          />
        </div>
      </main>
    </div>
  );
};

export default App;