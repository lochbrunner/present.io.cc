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
          <button 
            className={`header-settings-button ${showSettings ? 'active' : ''}`}
            onClick={() => handleToolChange('settings')}
            title="Canvas Settings"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor" />
            </svg>
            <span>Settings</span>
          </button>
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