import { create } from 'zustand';
import type { CanvasElement } from '@polotno/types';

interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, data: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  elements: [],
  selectedId: null,
  setElements: (elements) => set({ elements }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (id, data) => 
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...data } : el))
    })),
  deleteElement: (id) => 
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId
    })),
  selectElement: (id) => set({ selectedId: id }),
}));
