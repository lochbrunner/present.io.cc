import React, { useState } from 'react';
import { CanvasSettings } from '../App';

interface SettingsPanelProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: Partial<CanvasSettings>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onSettingsChange,
  onClose
}) => {
  const [canvasWidth, setCanvasWidth] = useState(settings.canvasWidth.toString());
  const [canvasHeight, setCanvasHeight] = useState(settings.canvasHeight.toString());
  
  const handleGridSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onSettingsChange({ gridSpacing: value });
    }
  };

  const handleCanvasSizeChange = () => {
    const width = parseInt(canvasWidth);
    const height = parseInt(canvasHeight);
    
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      onSettingsChange({ 
        canvasWidth: Math.min(2000, Math.max(300, width)), // Limit size between 300-2000px
        canvasHeight: Math.min(2000, Math.max(300, height))
      });
    }
  };

  // Handle pressing Enter in input fields
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCanvasSizeChange();
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Canvas Settings</h3>
        <button className="close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      <div className="settings-group">
        <h4>Canvas Size</h4>
        
        <div className="settings-row canvas-size">
          <div className="size-input-group">
            <label htmlFor="canvas-width">Width</label>
            <div className="input-with-unit">
              <input
                type="text"
                id="canvas-width"
                value={canvasWidth}
                onChange={(e) => setCanvasWidth(e.target.value)}
                onBlur={handleCanvasSizeChange}
                onKeyPress={handleKeyPress}
              />
              <span className="unit">px</span>
            </div>
          </div>
          
          <div className="size-input-group">
            <label htmlFor="canvas-height">Height</label>
            <div className="input-with-unit">
              <input
                type="text"
                id="canvas-height"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(e.target.value)}
                onBlur={handleCanvasSizeChange}
                onKeyPress={handleKeyPress}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
        
        <div className="settings-row preset-sizes">
          <button 
            className="preset-button" 
            onClick={() => {
              setCanvasWidth('800');
              setCanvasHeight('600');
              onSettingsChange({ canvasWidth: 800, canvasHeight: 600 });
            }}
          >
            800×600
          </button>
          <button 
            className="preset-button"
            onClick={() => {
              setCanvasWidth('1024');
              setCanvasHeight('768');
              onSettingsChange({ canvasWidth: 1024, canvasHeight: 768 });
            }}
          >
            1024×768
          </button>
          <button 
            className="preset-button"
            onClick={() => {
              setCanvasWidth('1280');
              setCanvasHeight('720');
              onSettingsChange({ canvasWidth: 1280, canvasHeight: 720 });
            }}
          >
            1280×720
          </button>
        </div>
      </div>
      
      <div className="settings-group">
        <h4>Grid</h4>
        
        <div className="settings-row">
          <label htmlFor="show-grid" className="toggle-label">
            <span>Show Grid</span>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="show-grid"
                checked={settings.showGrid}
                onChange={(e) => onSettingsChange({ showGrid: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
        
        <div className="settings-row">
          <label htmlFor="grid-spacing" className="range-label">
            <span>Grid Spacing</span>
            <input
              type="range"
              id="grid-spacing"
              min="5"
              max="50"
              step="5"
              value={settings.gridSpacing}
              onChange={handleGridSpacingChange}
              disabled={!settings.showGrid}
            />
            <span className="value">{settings.gridSpacing}px</span>
          </label>
        </div>
        
        <div className="settings-row">
          <label htmlFor="snap-to-grid" className="toggle-label">
            <span>Snap to Grid</span>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="snap-to-grid"
                checked={settings.snapToGrid}
                onChange={(e) => onSettingsChange({ snapToGrid: e.target.checked })}
                disabled={!settings.showGrid}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;