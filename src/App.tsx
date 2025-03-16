import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import SettingsPanel from './components/SettingsPanel';

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
export type ToolType = 'select' | 'scale' | 'rectangle' | 'circle' | 'text' | 'settings';

// Settings interface
export interface CanvasSettings {
  showGrid: boolean;
  gridSpacing: number;
  snapToGrid: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CanvasSettings>({
    showGrid: false,
    gridSpacing: 20,
    snapToGrid: false,
    canvasWidth: 800,
    canvasHeight: 600
  });
  
  const addElement = (element: Element) => {
    setElements([...elements, element]);
  };

  const updateElementPosition = (index: number, x: number, y: number) => {
    setElements(prevElements => {
      const newElements = [...prevElements];
      const element = {...newElements[index]};
      
      // Apply grid snapping if enabled
      const newX = settings.snapToGrid ? Math.round(x / settings.gridSpacing) * settings.gridSpacing : x;
      const newY = settings.snapToGrid ? Math.round(y / settings.gridSpacing) * settings.gridSpacing : y;
      
      if (element.type === 'rectangle' || element.type === 'text') {
        element.props = {
          ...element.props,
          x: newX,
          y: newY
        };
      } else if (element.type === 'circle') {
        element.props = {
          ...element.props,
          cx: newX,
          cy: newY
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
      
      // Apply grid snapping if enabled
      const snappedWidth = settings.snapToGrid 
        ? Math.round(newWidth / settings.gridSpacing) * settings.gridSpacing 
        : newWidth;
      const snappedHeight = settings.snapToGrid 
        ? Math.round(newHeight / settings.gridSpacing) * settings.gridSpacing 
        : newHeight;
      
      if (element.type === 'rectangle') {
        element.props = {
          ...element.props,
          width: snappedWidth,
          height: snappedHeight
        };
      } else if (element.type === 'circle') {
        // For circles, use the average of width and height for radius
        const newRadius = Math.max(snappedWidth, snappedHeight) / 2;
        element.props = {
          ...element.props,
          r: newRadius
        };
      } else if (element.type === 'text') {
        // For text, scale font size proportionally to height
        const currentFontSize = element.props.fontSize || 16;
        const originalHeight = 20; // Approximate default text height
        const scaleFactor = snappedHeight / originalHeight;
        
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
    if (tool === 'settings') {
      setShowSettings(!showSettings);
    } else {
      setActiveTool(tool);
    }
  };

  const updateSettings = (newSettings: Partial<CanvasSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Present.io</h1>
        <div className="app-controls">
          <small>Select a drawing tool and drag on canvas • Shift+Click for multi-select • Escape to cancel/deselect</small>
        </div>
      </header>
      <main className="app-main">
        <Toolbar 
          activeTool={activeTool}
          onToolChange={handleToolChange}
          showSettings={showSettings}
        />
        <div className="canvas-wrapper">
          <Canvas 
            elements={elements} 
            onUpdateElementPosition={updateElementPosition}
            onResizeElement={resizeElement}
            selectedIndices={selectedIndices}
            onSelectionChange={setSelectedIndices}
            activeTool={activeTool}
            onAddElement={addElement}
            settings={settings}
          />
          {showSettings && (
            <SettingsPanel 
              settings={settings}
              onSettingsChange={updateSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;