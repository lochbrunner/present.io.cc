import React, { useState, useEffect, useRef } from 'react';
import { Element, ToolType, CanvasSettings } from '../App';

interface CanvasProps {
  elements: Element[];
  onUpdateElementPosition: (index: number, x: number, y: number) => void;
  onResizeElement: (index: number, width: number, height: number) => void;
  selectedIndices: number[];
  onSelectionChange: (indices: number[]) => void;
  activeTool: ToolType;
  onAddElement: (element: Element) => void;
  settings: CanvasSettings;
}

interface ResizeHandlePosition {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

interface DrawingState {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  onUpdateElementPosition, 
  onResizeElement,
  selectedIndices,
  onSelectionChange,
  activeTool,
  onAddElement,
  settings
}) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeHandlePosition, setResizeHandlePosition] = useState<ResizeHandlePosition | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [elementInitialSize, setElementInitialSize] = useState({ width: 0, height: 0 });
  const [elementInitialPos, setElementInitialPos] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState<DrawingState>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Get SVG coordinates from mouse event
  const getSvgCoordinates = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svgElement = svgRef.current;
    const svgPoint = svgElement.createSVGPoint();
    
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    
    const ctm = svgElement.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    
    const transformedPoint = svgPoint.matrixTransform(ctm.inverse());
    
    return { 
      x: transformedPoint.x, 
      y: transformedPoint.y 
    };
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle drawing
      if (drawing.active && (activeTool === 'rectangle' || activeTool === 'circle')) {
        const coords = getSvgCoordinates(e);
        setDrawing(prev => ({
          ...prev,
          currentX: coords.x,
          currentY: coords.y
        }));
        return;
      }

      // Handle dragging elements
      if (dragging && activeIndex !== null && !resizing) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        
        // Move all selected elements
        selectedIndices.forEach(index => {
          const element = elements[index];
          let newX = 0;
          let newY = 0;
          
          if (element.type === 'rectangle' || element.type === 'text') {
            newX = (element.props.x || 0) + dx;
            newY = (element.props.y || 0) + dy;
          } else if (element.type === 'circle') {
            newX = (element.props.cx || 0) + dx;
            newY = (element.props.cy || 0) + dy;
          }
          
          onUpdateElementPosition(index, newX, newY);
        });
        
        setStartPos({ x: e.clientX, y: e.clientY });
      }
      
      // Handle resizing elements
      if (resizing && activeIndex !== null && resizeHandlePosition) {
        const element = elements[activeIndex];
        let newWidth = elementInitialSize.width;
        let newHeight = elementInitialSize.height;
        let newX = elementInitialPos.x;
        let newY = elementInitialPos.y;
        
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        
        // Horizontal resizing
        if (resizeHandlePosition.right) {
          newWidth = Math.max(20, elementInitialSize.width + dx);
        } else if (resizeHandlePosition.left) {
          const widthChange = Math.min(elementInitialSize.width - 20, dx);
          newWidth = elementInitialSize.width - widthChange;
          newX = elementInitialPos.x + widthChange;
        }
        
        // Vertical resizing
        if (resizeHandlePosition.bottom) {
          newHeight = Math.max(20, elementInitialSize.height + dy);
        } else if (resizeHandlePosition.top) {
          const heightChange = Math.min(elementInitialSize.height - 20, dy);
          newHeight = elementInitialSize.height - heightChange;
          newY = elementInitialPos.y + heightChange;
        }
        
        // Update element position if needed
        if (newX !== elementInitialPos.x || newY !== elementInitialPos.y) {
          if (element.type === 'rectangle' || element.type === 'text') {
            onUpdateElementPosition(activeIndex, newX, newY);
          } else if (element.type === 'circle') {
            onUpdateElementPosition(activeIndex, newX + newWidth/2, newY + newHeight/2);
          }
        }
        
        // Update element size
        onResizeElement(activeIndex, newWidth, newHeight);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Handle finishing a drawing
      if (drawing.active) {
        const coords = getSvgCoordinates(e);
        setDrawing(prev => ({
          ...prev,
          active: false,
          currentX: coords.x,
          currentY: coords.y
        }));

        // Add the element based on the current drawing tool
        if (activeTool === 'rectangle') {
          const x = Math.min(drawing.startX, coords.x);
          const y = Math.min(drawing.startY, coords.y);
          const width = Math.abs(coords.x - drawing.startX);
          const height = Math.abs(coords.y - drawing.startY);
          
          // Only add if it has some size
          if (width > 5 && height > 5) {
            const rectangle: Element = {
              type: 'rectangle',
              props: {
                x,
                y,
                width,
                height,
                fill: '#10b981', // Emerald color
                stroke: 'rgba(0, 0, 0, 0.15)',
                strokeWidth: 1
              }
            };
            onAddElement(rectangle);
          }
        } else if (activeTool === 'circle') {
          const centerX = (drawing.startX + coords.x) / 2;
          const centerY = (drawing.startY + coords.y) / 2;
          const radius = Math.sqrt(
            Math.pow(coords.x - drawing.startX, 2) + 
            Math.pow(coords.y - drawing.startY, 2)
          ) / 2;
          
          // Only add if it has some size
          if (radius > 5) {
            const circle: Element = {
              type: 'circle',
              props: {
                cx: centerX,
                cy: centerY,
                r: radius,
                fill: '#6366f1', // Indigo color
                stroke: 'rgba(0, 0, 0, 0.15)',
                strokeWidth: 1
              }
            };
            onAddElement(circle);
          }
        } else if (activeTool === 'text') {
          const text: Element = {
            type: 'text',
            props: {
              x: coords.x,
              y: coords.y,
              text: 'Hello SVG',
              fontSize: 24,
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              fill: '#1e293b', // Slate 800 color
              stroke: '',
              strokeWidth: 0,
              textAnchor: 'middle'
            }
          };
          onAddElement(text);
        }
      }

      setDragging(false);
      setResizing(false);
      setActiveIndex(null);
      setResizeHandlePosition(null);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Clear selection when Escape is pressed
      if (e.key === 'Escape') {
        if (drawing.active) {
          setDrawing({
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
          });
        } else {
          onSelectionChange([]);
        }
      }
    };

    if (dragging || resizing || drawing.active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // Add keyboard listener for escape key
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    dragging, resizing, elements, selectedIndices, activeIndex, 
    startPos, resizeHandlePosition, elementInitialSize, elementInitialPos,
    onUpdateElementPosition, onResizeElement, onSelectionChange, drawing,
    activeTool, onAddElement
  ]);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    // Don't handle element interactions when in drawing mode
    if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'text') {
      return;
    }
    
    e.stopPropagation();
    
    // Don't select when in scale mode and already selected
    if (activeTool === 'scale' && selectedIndices.includes(index)) {
      return;
    }
    
    setDragging(true);
    setActiveIndex(index);
    setStartPos({ x: e.clientX, y: e.clientY });
    
    // Handle multi-select with Shift key
    if (e.shiftKey) {
      // If element is already selected, remove it from selection
      if (selectedIndices.includes(index)) {
        onSelectionChange(selectedIndices.filter(i => i !== index));
      } else {
        // Add to existing selection
        onSelectionChange([...selectedIndices, index]);
      }
    } else {
      // Regular click (no shift) - select only this element
      if (!selectedIndices.includes(index)) {
        onSelectionChange([index]);
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Handle starting a drawing
    if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'text') {
      const coords = getSvgCoordinates(e);
      
      setDrawing({
        active: true,
        startX: coords.x,
        startY: coords.y,
        currentX: coords.x,
        currentY: coords.y
      });
      
      // For click-based text placement
      if (activeTool === 'text') {
        // We'll create the text element on mouse up
      }
      
      return;
    }
    
    // If clicking on the canvas (not an element), deselect all
    // But only if shift isn't pressed
    if (e.target === e.currentTarget && !e.shiftKey) {
      onSelectionChange([]);
    }
  };

  const handleResizeHandleMouseDown = (
    e: React.MouseEvent, 
    index: number, 
    handlePosition: ResizeHandlePosition
  ) => {
    e.stopPropagation();
    setResizing(true);
    setActiveIndex(index);
    setResizeHandlePosition(handlePosition);
    setStartPos({ x: e.clientX, y: e.clientY });
    
    const element = elements[index];
    
    if (element.type === 'rectangle' || element.type === 'text') {
      setElementInitialSize({ 
        width: element.props.width || 0, 
        height: element.props.height || 0 
      });
      setElementInitialPos({ 
        x: element.props.x || 0, 
        y: element.props.y || 0 
      });
    } else if (element.type === 'circle') {
      const radius = element.props.r || 0;
      setElementInitialSize({ 
        width: radius * 2, 
        height: radius * 2 
      });
      setElementInitialPos({ 
        x: (element.props.cx || 0) - radius, 
        y: (element.props.cy || 0) - radius
      });
    }
  };

  const renderElement = (element: Element, index: number) => {
    const { type, props } = element;
    
    if (type === 'rectangle') {
      return (
        <rect
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={props.strokeWidth}
        />
      );
    } else if (type === 'circle') {
      return (
        <circle
          cx={props.cx}
          cy={props.cy}
          r={props.r}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={props.strokeWidth}
        />
      );
    } else if (type === 'text') {
      return (
        <text
          x={props.x}
          y={props.y}
          fontSize={props.fontSize}
          fontFamily={props.fontFamily}
          fill={props.fill}
          textAnchor={props.textAnchor}
        >
          {props.text}
        </text>
      );
    }
    return null;
  };

  const renderResizeHandles = (element: Element, index: number) => {
    if (activeTool !== 'scale') return null;
    
    let x = 0, y = 0, width = 0, height = 0;
    
    if (element.type === 'rectangle' || element.type === 'text') {
      x = element.props.x || 0;
      y = element.props.y || 0;
      width = element.props.width || 0;
      height = element.props.height || 0;
    } else if (element.type === 'circle') {
      const r = element.props.r || 0;
      x = (element.props.cx || 0) - r;
      y = (element.props.cy || 0) - r;
      width = r * 2;
      height = r * 2;
    }
    
    const handleSize = 8;
    
    return (
      <>
        {/* Top-left handle */}
        <rect
          className="resize-handle"
          x={x - handleSize/2}
          y={y - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { top: true, left: true })}
        />
        
        {/* Top-right handle */}
        <rect
          className="resize-handle"
          x={x + width - handleSize/2}
          y={y - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { top: true, right: true })}
        />
        
        {/* Bottom-left handle */}
        <rect
          className="resize-handle"
          x={x - handleSize/2}
          y={y + height - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { bottom: true, left: true })}
        />
        
        {/* Bottom-right handle */}
        <rect
          className="resize-handle"
          x={x + width - handleSize/2}
          y={y + height - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { bottom: true, right: true })}
        />
        
        {/* Top-middle handle */}
        <rect
          className="resize-handle"
          x={x + width/2 - handleSize/2}
          y={y - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { top: true })}
        />
        
        {/* Bottom-middle handle */}
        <rect
          className="resize-handle"
          x={x + width/2 - handleSize/2}
          y={y + height - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { bottom: true })}
        />
        
        {/* Left-middle handle */}
        <rect
          className="resize-handle"
          x={x - handleSize/2}
          y={y + height/2 - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { left: true })}
        />
        
        {/* Right-middle handle */}
        <rect
          className="resize-handle"
          x={x + width - handleSize/2}
          y={y + height/2 - handleSize/2}
          width={handleSize}
          height={handleSize}
          onMouseDown={(e) => handleResizeHandleMouseDown(e, index, { right: true })}
        />
      </>
    );
  };

  // Render preview of the element being drawn
  const renderDrawingPreview = () => {
    if (!drawing.active) return null;
    
    if (activeTool === 'rectangle') {
      const x = Math.min(drawing.startX, drawing.currentX);
      const y = Math.min(drawing.startY, drawing.currentY);
      const width = Math.abs(drawing.currentX - drawing.startX);
      const height = Math.abs(drawing.currentY - drawing.startY);
      
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#10b981"
          fillOpacity={0.5}
          stroke="#10b981"
          strokeWidth={1}
          strokeDasharray="5,5"
        />
      );
    }
    
    if (activeTool === 'circle') {
      const centerX = (drawing.startX + drawing.currentX) / 2;
      const centerY = (drawing.startY + drawing.currentY) / 2;
      const radius = Math.sqrt(
        Math.pow(drawing.currentX - drawing.startX, 2) + 
        Math.pow(drawing.currentY - drawing.startY, 2)
      ) / 2;
      
      return (
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#6366f1"
          fillOpacity={0.5}
          stroke="#6366f1"
          strokeWidth={1}
          strokeDasharray="5,5"
        />
      );
    }
    
    return null;
  };

  const getCursor = () => {
    if (activeTool === 'rectangle' || activeTool === 'circle') {
      return drawing.active ? 'crosshair' : 'crosshair';
    }
    
    if (activeTool === 'text') {
      return 'text';
    }
    
    if (activeTool === 'scale') {
      return 'default';
    }
    
    return 'default';
  };

  const getElementCursor = (index: number) => {
    if (activeTool === 'scale' && selectedIndices.includes(index)) {
      return 'nwse-resize';
    }
    
    if (activeTool === 'select') {
      return selectedIndices.includes(index) ? 'move' : 'pointer';
    }
    
    // Don't change cursor for elements when in drawing mode
    return 'default';
  };

  // Render grid lines
  const renderGrid = () => {
    if (!settings.showGrid) return null;
    
    const gridLines = [];
    const { canvasWidth, canvasHeight, gridSpacing: spacing } = settings;
    
    // Vertical lines
    for (let x = spacing; x < canvasWidth; x += spacing) {
      gridLines.push(
        <line 
          key={`v-${x}`} 
          x1={x} 
          y1={0} 
          x2={x} 
          y2={canvasHeight} 
          stroke="rgba(0, 0, 0, 0.1)" 
          strokeWidth="1" 
        />
      );
    }
    
    // Horizontal lines
    for (let y = spacing; y < canvasHeight; y += spacing) {
      gridLines.push(
        <line 
          key={`h-${y}`} 
          x1={0} 
          y1={y} 
          x2={canvasWidth} 
          y2={y} 
          stroke="rgba(0, 0, 0, 0.1)" 
          strokeWidth="1" 
        />
      );
    }
    
    return (
      <g className="grid-lines">
        {gridLines}
      </g>
    );
  };

  return (
    <div className="canvas-container">
      <svg 
        className="svg-canvas" 
        width={settings.canvasWidth}
        height={settings.canvasHeight}
        onMouseDown={handleCanvasMouseDown}
        ref={svgRef}
        style={{ cursor: getCursor() }}
      >
        {/* Grid */}
        {renderGrid()}
        
        {/* Drawing preview */}
        {renderDrawingPreview()}
        
        {/* Rendered elements */}
        {elements.map((element, index) => (
          <g 
            key={index} 
            onMouseDown={(e) => handleMouseDown(e, index)}
            className={selectedIndices.includes(index) ? 'selected-element' : ''}
            style={{ cursor: getElementCursor(index) }}
          >
            {renderElement(element, index)}
            {selectedIndices.includes(index) && renderResizeHandles(element, index)}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Canvas;