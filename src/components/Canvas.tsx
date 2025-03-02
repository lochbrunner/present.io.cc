import React, { useState, useEffect } from 'react';
import { Element, ToolType } from '../App';

interface CanvasProps {
  elements: Element[];
  onUpdateElementPosition: (index: number, x: number, y: number) => void;
  onResizeElement: (index: number, width: number, height: number) => void;
  selectedIndices: number[];
  onSelectionChange: (indices: number[]) => void;
  activeTool: ToolType;
}

interface ResizeHandlePosition {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ 
  elements, 
  onUpdateElementPosition, 
  onResizeElement,
  selectedIndices,
  onSelectionChange,
  activeTool
}) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeHandlePosition, setResizeHandlePosition] = useState<ResizeHandlePosition | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [elementInitialSize, setElementInitialSize] = useState({ width: 0, height: 0 });
  const [elementInitialPos, setElementInitialPos] = useState({ x: 0, y: 0 });

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      setActiveIndex(null);
      setResizeHandlePosition(null);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Clear selection when Escape is pressed
      if (e.key === 'Escape') {
        onSelectionChange([]);
      }
    };

    if (dragging || resizing) {
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
    onUpdateElementPosition, onResizeElement, onSelectionChange
  ]);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicking on the canvas (not an element), deselect all
    // But only if shift isn't pressed
    if (e.target === e.currentTarget && !e.shiftKey) {
      onSelectionChange([]);
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

  const getCursor = (index: number) => {
    if (activeTool === 'scale' && selectedIndices.includes(index)) {
      return 'nwse-resize';
    }
    return selectedIndices.includes(index) ? 'move' : 'pointer';
  };

  return (
    <div className="canvas-container">
      <svg 
        className="svg-canvas" 
        width="800" 
        height="600"
        onClick={handleCanvasClick}
      >
        {elements.map((element, index) => (
          <g 
            key={index} 
            onMouseDown={(e) => handleMouseDown(e, index)}
            className={selectedIndices.includes(index) ? 'selected-element' : ''}
            style={{ cursor: getCursor(index) }}
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