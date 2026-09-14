'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Square, Circle, Type, Image as ImageIcon, Minus } from '@phosphor-icons/react';
import { useCanvasStore } from '../../store/canvas';
import { v4 as uuidv4 } from 'uuid';

// Dynamically import the Konva stage so it doesn't break SSR
const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false });

export default function CanvasEditor() {
  const { addElement, selectedId, elements, updateElement, deleteElement } = useCanvasStore();

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleAddRectangle = () => {
    addElement({
      id: uuidv4(),
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      rotation: 0,
      zIndex: elements.length,
      opacity: 1,
      fill: '#cccccc',
    });
  };

  const handleAddCircle = () => {
    addElement({
      id: uuidv4(),
      type: 'circle',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: elements.length,
      opacity: 1,
      fill: '#3b82f6',
    });
  };

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 300,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: elements.length,
      opacity: 1,
      text: 'Double click to edit',
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      align: 'left',
    });
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Left Toolbar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <button onClick={handleAddRectangle} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Rectangle">
          <Square size={24} weight="regular" />
        </button>
        <button onClick={handleAddCircle} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Circle">
          <Circle size={24} weight="regular" />
        </button>
        <button onClick={handleAddText} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors" title="Text">
          <Type size={24} weight="regular" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <CanvasStage />
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Properties</h2>
        
        {selectedElement ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase">{selectedElement.type}</span>
              <button 
                onClick={() => deleteElement(selectedElement.id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.x)} 
                  onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                  className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.y)} 
                  onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                  className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.width)} 
                  onChange={(e) => updateElement(selectedElement.id, { width: Math.max(5, Number(e.target.value)) })}
                  className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.height)} 
                  onChange={(e) => updateElement(selectedElement.id, { height: Math.max(5, Number(e.target.value)) })}
                  className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            {selectedElement.type === 'rectangle' || selectedElement.type === 'circle' ? (
              <div className="pt-2">
                <label className="block text-xs text-gray-500 mb-1">Fill</label>
                <input 
                  type="color" 
                  value={(selectedElement as any).fill || '#cccccc'} 
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="w-full h-8 cursor-pointer rounded" 
                />
              </div>
            ) : null}

            {selectedElement.type === 'text' && (
              <div className="pt-2 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Text</label>
                  <textarea 
                    value={(selectedElement as any).text} 
                    onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                  <input 
                    type="number" 
                    value={(selectedElement as any).fontSize} 
                    onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <input 
                    type="color" 
                    value={(selectedElement as any).fill || '#000000'} 
                    onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                    className="w-full h-8 cursor-pointer rounded" 
                  />
                </div>
              </div>
            )}
            
          </div>
        ) : (
          <div className="text-sm text-gray-400 text-center mt-10">
            Select an element to view and edit its properties.
          </div>
        )}
      </div>
    </div>
  );
}
