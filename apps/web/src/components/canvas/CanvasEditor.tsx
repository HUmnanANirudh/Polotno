'use client';
import type { CanvasElement } from '@polotno/types';
import dynamic from 'next/dynamic';
import { 
  SquareIcon, 
  CircleIcon, 
  ArticleIcon, 
  MinusIcon, 
  ImageIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon
} from '@phosphor-icons/react';
import { useCanvasStore } from '../../store/canvas';
import { v4 as uuidv4 } from 'uuid';

const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false });

function ToolbarButton({ onClick, icon: Icon, tooltip, disabled = false }: { onClick?: () => void, icon: any, tooltip: string, disabled?: boolean }) {
  return (
    <div className="relative group">
      <button 
        onClick={onClick}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg text-gray-600 transition-colors"
      >
        <Icon size={24} weight="regular" />
      </button>
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {tooltip}
      </div>
    </div>
  );
}

export default function CanvasEditor() {
  const { elements, selectedId, addElement, updateElement, deleteElement, undo, redo, canUndo, canRedo } = useCanvasStore();

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleAddRect = () => {
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
      x: 300,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: elements.length,
      opacity: 1,
      fill: '#4287f5',
    });
  };

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 200,
      y: 300,
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

  const handleAddLine = () => {
    addElement({
      id: uuidv4(),
      type: 'line',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: elements.length,
      opacity: 1,
      points: [0, 0, 100, 100],
      stroke: '#000000',
      strokeWidth: 4,
      pointerAtEnd: false,
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Toolbar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 shrink-0 z-10">
        <ToolbarButton onClick={handleAddRect} icon={SquareIcon} tooltip="Rectangle" />
        <ToolbarButton onClick={handleAddCircle} icon={CircleIcon} tooltip="Circle" />
        <ToolbarButton onClick={handleAddText} icon={ArticleIcon} tooltip="Text" />
        <ToolbarButton onClick={handleAddLine} icon={MinusIcon} tooltip="Line" />
        <ToolbarButton icon={ImageIcon} tooltip="Image (Coming soon)" />
        <div className="w-8 h-px bg-gray-200 my-2" />
        <ToolbarButton onClick={undo} disabled={!canUndo} icon={ArrowCounterClockwiseIcon} tooltip="Undo (Ctrl+Z)" />
        <ToolbarButton onClick={redo} disabled={!canRedo} icon={ArrowClockwiseIcon} tooltip="Redo (Ctrl+Shift+Z)" />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50">
        <CanvasStage />
      </div>

      {/* Right Properties Panel */}
      <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 z-10">
        <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Properties</h2>
        
        {selectedElement ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase">{selectedElement.type}</span>
              <button 
                onClick={() => deleteElement(selectedElement.id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">X</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.x)} 
                  onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                  className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Y</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.y)} 
                  onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                  className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">W</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.width)} 
                  onChange={(e) => updateElement(selectedElement.id, { width: Math.max(5, Number(e.target.value)) })}
                  className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">H</label>
                <input 
                  type="number" 
                  value={Math.round(selectedElement.height)} 
                  onChange={(e) => updateElement(selectedElement.id, { height: Math.max(5, Number(e.target.value)) })}
                  className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>

            {selectedElement.type === 'rectangle' || selectedElement.type === 'circle' ? (
              <div className="pt-1">
                <label className="block text-[10px] text-gray-500 mb-0.5">Fill</label>
                <input 
                  type="color" 
                  value={(selectedElement as CanvasElement & { fill?: string }).fill || '#cccccc'} 
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="w-full h-6 cursor-pointer rounded border border-gray-200" 
                />
              </div>
            ) : null}

            {selectedElement.type === 'line' ? (
              <div className="pt-1 space-y-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Stroke</label>
                  <input 
                    type="color" 
                    value={(selectedElement as CanvasElement & { stroke?: string }).stroke || '#000000'} 
                    onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                    className="w-full h-6 cursor-pointer rounded border border-gray-200" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Width</label>
                  <input 
                    type="number" 
                    value={(selectedElement as CanvasElement & { strokeWidth?: number }).strokeWidth || 2} 
                    onChange={(e) => updateElement(selectedElement.id, { strokeWidth: Number(e.target.value) })}
                    className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
            ) : null}

            {selectedElement.type === 'text' && (
              <div className="pt-1 space-y-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Text</label>
                  <textarea 
                    value={(selectedElement as CanvasElement & { text?: string }).text} 
                    onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Size</label>
                    <input 
                      type="number" 
                      value={(selectedElement as CanvasElement & { fontSize?: number }).fontSize} 
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                      className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Color</label>
                    <input 
                      type="color" 
                      value={(selectedElement as CanvasElement & { fill?: string }).fill || '#000000'} 
                      onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                      className="w-full h-6 cursor-pointer rounded border border-gray-200" 
                    />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        ) : (
          <div className="text-xs text-gray-400 text-center mt-6">
            Select an element to view and edit its properties.
          </div>
        )}
      </div>
    </div>
  );
}
