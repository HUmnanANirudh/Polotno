import React from 'react';
import { useCanvasStore } from '../../store/canvas';

function PropertyInput({ label, value, onChange, type = "number", min }: any) {
  const [localValue, setLocalValue] = React.useState(value?.toString() || '');
  
  React.useEffect(() => {
    setLocalValue(value?.toString() || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (type === "number") {
      let num = parseFloat(localValue);
      if (isNaN(num)) num = value;
      if (min !== undefined && num < min) num = min;
      setLocalValue(num.toString());
      onChange(num);
    } else {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
      <input 
        type={type === 'number' ? 'text' : type}
        value={localValue} 
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
      />
    </div>
  );
}

export function CanvasProperties() {
  const { elements, selectedId, updateElement, deleteElement } = useCanvasStore();
  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-5 overflow-y-auto shrink-0 z-10">
      <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5">Properties</h2>
      
      {selectedElement ? (
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700 capitalize">{selectedElement.type}</span>
            <button 
              onClick={() => deleteElement(selectedElement.id)}
              className="text-red-500 text-xs font-medium hover:underline"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PropertyInput label="X" value={Math.round(selectedElement.x)} onChange={(v: number) => updateElement(selectedElement.id, { x: v })} />
            <PropertyInput label="Y" value={Math.round(selectedElement.y)} onChange={(v: number) => updateElement(selectedElement.id, { y: v })} />
            <PropertyInput label="W" min={5} value={Math.round(selectedElement.width)} onChange={(v: number) => updateElement(selectedElement.id, { width: v })} />
            <PropertyInput label="H" min={5} value={Math.round(selectedElement.height)} onChange={(v: number) => updateElement(selectedElement.id, { height: v })} />
          </div>

          {selectedElement.type === 'rectangle' && (
            <div className="pt-2">
              <PropertyInput label="Corner Radius" min={0} value={(selectedElement as any).cornerRadius || 0} onChange={(v: number) => updateElement(selectedElement.id, { cornerRadius: v })} />
            </div>
          )}

          {selectedElement.type === 'rectangle' || selectedElement.type === 'circle' ? (
            <div className="pt-2">
              <label className="block text-xs text-gray-500 mb-1">Fill</label>
              <input 
                type="color" 
                value={(selectedElement as any).fill || '#cccccc'} 
                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                className="w-full h-8 cursor-pointer rounded border border-gray-200" 
              />
            </div>
          ) : null}

          {selectedElement.type === 'line' ? (
            <div className="pt-2 space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={(selectedElement as any).pointerAtEnd || false}
                  onChange={(e) => updateElement(selectedElement.id, { pointerAtEnd: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Arrowhead</span>
              </label>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stroke Color</label>
                <input 
                  type="color" 
                  value={(selectedElement as any).stroke || '#000000'} 
                  onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                  className="w-full h-8 cursor-pointer rounded border border-gray-200" 
                />
              </div>
              <PropertyInput label="Stroke Width" min={1} value={(selectedElement as any).strokeWidth || 2} onChange={(v: number) => updateElement(selectedElement.id, { strokeWidth: v })} />
            </div>
          ) : null}

          {selectedElement.type === 'text' && (
            <div className="pt-2 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text</label>
                <textarea 
                  value={(selectedElement as any).text} 
                  onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded px-2 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <PropertyInput label="Font Size" min={1} value={(selectedElement as any).fontSize || 24} onChange={(v: number) => updateElement(selectedElement.id, { fontSize: v })} />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <input 
                    type="color" 
                    value={(selectedElement as any).fill || '#000000'} 
                    onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                    className="w-full h-8 cursor-pointer rounded border border-gray-200" 
                  />
                </div>
              </div>
            </div>
          )}
          
        </div>
      ) : (
        <div className="text-sm text-gray-400 text-center mt-8">
          Select an element to view and edit its properties.
        </div>
      )}
    </div>
  );
}
