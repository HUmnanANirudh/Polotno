'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva';
import { useCanvasStore } from '../../store/canvas';
import type { CanvasElement } from '@polotno/types';

export default function CanvasStage() {
  const { elements, selectedId, selectElement, updateElement } = useCanvasStore();
  const trRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedId && trRef.current) {
      const node = layerRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectElement(null);
    }
  };

  return (
    <Stage
      width={typeof window !== 'undefined' ? window.innerWidth - 320 - 64 : 800} // Rough calc: screen - right panel - left rail
      height={typeof window !== 'undefined' ? window.innerHeight - 64 : 600}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      className="bg-white shadow-sm border border-gray-200"
    >
      <Layer ref={layerRef}>
        {elements.map((el) => {
          const isSelected = el.id === selectedId;
          const commonProps = {
            key: el.id,
            id: el.id,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation,
            draggable: true,
            onClick: () => selectElement(el.id),
            onTap: () => selectElement(el.id),
            onDragEnd: (e: any) => {
              updateElement(el.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            },
            onTransformEnd: (e: any) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              updateElement(el.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5, node.height() * scaleY),
              });
            },
          };

          if (el.type === 'rectangle') {
            return (
              <Rect
                {...commonProps}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth || 0}
                cornerRadius={el.cornerRadius || 0}
              />
            );
          }
          if (el.type === 'circle') {
            // Konva Circle uses radius, but we treat width/height as bounding box in our schema
            return (
              <Circle
                {...commonProps}
                radius={Math.min(el.width, el.height) / 2}
                fill={el.fill}
                stroke={el.stroke}
                strokeWidth={el.strokeWidth || 0}
              />
            );
          }
          if (el.type === 'text') {
            return (
              <Text
                {...commonProps}
                text={el.text}
                fontSize={el.fontSize}
                fontFamily={el.fontFamily}
                fill={el.fill}
                align={el.align}
                fontStyle={el.fontStyle}
              />
            );
          }
          return null;
        })}
        {selectedId && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
          />
        )}
      </Layer>
    </Stage>
  );
}
