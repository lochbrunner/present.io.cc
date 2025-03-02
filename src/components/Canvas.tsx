import React, { useState, useEffect } from 'react';
import { Element } from '../App';

interface CanvasProps {
  elements: Element[];
  onUpdateElementPosition: (index: number, x: number, y: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ elements, onUpdateElementPosition }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && activeIndex !== null) {
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
    };

    const handleMouseUp = () => {
      setDragging(false);
      setActiveIndex(null);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Clear selection when Escape is pressed
      if (e.key === 'Escape') {
        setSelectedIndices([]);
      }
    };

    if (dragging) {
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
  }, [dragging, elements, selectedIndices, activeIndex, startPos, onUpdateElementPosition]);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setDragging(true);
    setActiveIndex(index);
    setStartPos({ x: e.clientX, y: e.clientY });
    
    // Handle multi-select with Shift key
    if (e.shiftKey) {
      // If element is already selected, remove it from selection
      if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter(i => i !== index));
      } else {
        // Add to existing selection
        setSelectedIndices([...selectedIndices, index]);
      }
    } else {
      // Regular click (no shift) - select only this element
      if (!selectedIndices.includes(index)) {
        setSelectedIndices([index]);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicking on the canvas (not an element), deselect all
    // But only if shift isn't pressed
    if (e.target === e.currentTarget && !e.shiftKey) {
      setSelectedIndices([]);
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
            style={{ cursor: selectedIndices.includes(index) ? 'move' : 'pointer' }}
          >
            {renderElement(element, index)}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Canvas;