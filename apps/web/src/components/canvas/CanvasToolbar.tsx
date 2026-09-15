import React, { useRef } from 'react';
import { 
  SquareIcon, 
  CircleIcon, 
  ArticleIcon, 
  MinusIcon, 
  ImageIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  DownloadIcon
} from '@phosphor-icons/react';
import { useCanvasStore } from '../../store/canvas';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../../lib/api';

function ToolbarButton({ onClick, icon: Icon, tooltip, disabled = false, children }: any) {
  return (
    <div className="relative group flex items-center justify-center">
      <button 
        onClick={onClick}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg text-gray-600 transition-colors relative"
      >
        <Icon size={24} weight="regular" />
        {children}
      </button>
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {tooltip}
      </div>
    </div>
  );
}

export function CanvasToolbar() {
  const { elements, addElement, undo, redo, canUndo, canRedo, stageRef } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRect = () => {
    addElement({
      id: uuidv4(),
      type: 'rectangle',
      x: 100, y: 100, width: 150, height: 100,
      rotation: 0, zIndex: elements.length, opacity: 1, fill: '#cccccc', cornerRadius: 0,
    });
  };

  const handleAddCircle = () => {
    addElement({
      id: uuidv4(),
      type: 'circle',
      x: 300, y: 150, width: 100, height: 100,
      rotation: 0, zIndex: elements.length, opacity: 1, fill: '#4287f5',
    });
  };

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 200, y: 300, width: 200, height: 50,
      rotation: 0, zIndex: elements.length, opacity: 1, text: 'Double click to edit',
      fontSize: 24, fontFamily: 'Arial',
      fill: '#000000', align: 'left',
    });
  };

  const handleAddLine = () => {
    addElement({
      id: uuidv4(),
      type: 'line',
      x: 100, y: 100, width: 100, height: 100,
      rotation: 0, zIndex: elements.length, opacity: 1, points: [0, 0, 100, 100],
      stroke: '#000000', strokeWidth: 4, pointerAtEnd: false,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post<{ url: string }>('/upload/image', formData);

      if (res.data?.url) {
        addElement({
          id: uuidv4(),
          type: 'image',
          x: 100, y: 100, width: 300, height: 300,
          rotation: 0, zIndex: elements.length, opacity: 1, src: res.data.url,
        });
      }
    } catch (err) {
      console.error('Failed to upload image', err);
      alert('Image upload failed');
    }
  };

  const handleExport = () => {
    if (!stageRef) return;
    const dataURL = stageRef.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'polotno-export.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 shrink-0 z-10">
      <ToolbarButton onClick={handleAddRect} icon={SquareIcon} tooltip="Rectangle" />
      <ToolbarButton onClick={handleAddCircle} icon={CircleIcon} tooltip="Circle" />
      <ToolbarButton onClick={handleAddText} icon={ArticleIcon} tooltip="Text" />
      <ToolbarButton onClick={handleAddLine} icon={MinusIcon} tooltip="Line / Arrow" />
      <ToolbarButton onClick={() => fileInputRef.current?.click()} icon={ImageIcon} tooltip="Upload Image">
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
      </ToolbarButton>
      <div className="w-8 h-px bg-gray-200 my-2" />
      <ToolbarButton onClick={undo} disabled={!canUndo} icon={ArrowCounterClockwiseIcon} tooltip="Undo (Ctrl+Z)" />
      <ToolbarButton onClick={redo} disabled={!canRedo} icon={ArrowClockwiseIcon} tooltip="Redo (Ctrl+Shift+Z)" />
      <div className="w-8 h-px bg-gray-200 my-2" />
      <ToolbarButton onClick={handleExport} icon={DownloadIcon} tooltip="Export as PNG" />
    </div>
  );
}
