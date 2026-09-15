'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line as ShapeLine, Arrow, Image as KonvaImage, Transformer } from 'react-konva';
import { useCanvasStore } from '../../store/canvas';
import type Konva from 'konva';

function URLImage({ el, commonProps }: { el: any, commonProps: any }) {
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);
  
  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = 'Anonymous';
    image.src = el.src;
    image.onload = () => setImg(image);
  }, [el.src]);
  
  return <KonvaImage key={el.id} {...commonProps} image={img} />;
}

export default function CanvasStage() {
  const { elements, selectedId, selectElement, updateElement, setStageRef } = useCanvasStore();
  const trRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
  }, [setStageRef]);

  useEffect(() => {
    if (selectedId && trRef.current && layerRef.current) {
      const node = layerRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer()?.batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const state = useCanvasStore.getState();
      if (!state.selectedId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        state.deleteElement(state.selectedId);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const el = state.elements.find(el => el.id === state.selectedId);
        if (el) state.updateElement(state.selectedId, { y: el.y - 1 });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const el = state.elements.find(el => el.id === state.selectedId);
        if (el) state.updateElement(state.selectedId, { y: el.y + 1 });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const el = state.elements.find(el => el.id === state.selectedId);
        if (el) state.updateElement(state.selectedId, { x: el.x - 1 });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const el = state.elements.find(el => el.id === state.selectedId);
        if (el) state.updateElement(state.selectedId, { x: el.x + 1 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectElement(null);
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={typeof window !== 'undefined' ? window.innerWidth - 320 - 64 : 800} // Rough calc: screen - right panel - left rail
      height={typeof window !== 'undefined' ? window.innerHeight - 64 : 600}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      className="bg-white shadow-sm border border-gray-200"
    >
      <Layer ref={layerRef}>
        {elements.map((el) => {
          const commonProps = {
            id: el.id,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation,
            scaleX: 1,
            scaleY: 1,
            draggable: true,
            onClick: () => selectElement(el.id),
            onTap: () => selectElement(el.id),
            onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
              updateElement(el.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            },
            onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              
              if (el.type === 'line' && el.points) {
                const newPoints = el.points.map((p, i) => i % 2 === 0 ? p * scaleX : p * scaleY);
                updateElement(el.id, {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  points: newPoints,
                });
              } else {
                updateElement(el.id, {
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  width: Math.max(5, node.width() * scaleX),
                  height: Math.max(5, node.height() * scaleY),
                });
              }
            },
          };

          if (el.type === 'rectangle') {
            return (
              <Rect
                key={el.id}
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
                key={el.id}
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
                key={el.id}
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
          if (el.type === 'image') {
            return <URLImage key={el.id} el={el} commonProps={commonProps} />;
          }
          if (el.type === 'line') {
            const lineProps = {
              ...commonProps,
              points: el.points || [0, 0, 100, 100],
              stroke: el.stroke || '#000000',
              strokeWidth: el.strokeWidth || 2,
              lineCap: 'round' as const,
              lineJoin: 'round' as const,
              hitStrokeWidth: 20,
            };
            return el.pointerAtEnd ? (
              <Arrow key={el.id} {...lineProps} pointerLength={10} pointerWidth={10} />
            ) : (
              <ShapeLine key={el.id} {...lineProps} />
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
