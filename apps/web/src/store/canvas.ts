import { create } from 'zustand';
import { api } from '../lib/api';
import type { CanvasElement, CanvasResponse } from '@polotno/types';

interface CanvasState {
  // Canvas metadata
  canvasId: string | null;
  canvasName: string;
  isDirty: boolean;
  isSaving: boolean;

  // Elements
  elements: CanvasElement[];
  selectedId: string | null;

  // Element actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, data: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;

  // API actions
  loadCanvas: (id: string) => Promise<void>;
  saveCanvas: () => Promise<void>;
  resetCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasId: null,
  canvasName: 'Untitled',
  isDirty: false,
  isSaving: false,

  elements: [],
  selectedId: null,

  setElements: (elements) => set({ elements, isDirty: true }),

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      isDirty: true,
    })),

  updateElement: (id, data) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...data } as CanvasElement) : el
      ),
      isDirty: true,
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      isDirty: true,
    })),

  selectElement: (id) => set({ selectedId: id }),

  loadCanvas: async (id) => {
    try {
      const res = await api.get<CanvasResponse>(`/canvases/${id}`);
      if (res.data) {
        set({
          canvasId: res.data.id,
          canvasName: res.data.name,
          elements: (res.data.elements || []) as CanvasElement[],
          selectedId: null,
          isDirty: false,
        });
      }
    } catch (err) {
      console.error('Failed to load canvas:', err);
      throw err;
    }
  },

  saveCanvas: async () => {
    const { canvasId, elements } = get();
    if (!canvasId) return;

    set({ isSaving: true });
    try {
      await api.put(`/canvases/${canvasId}`, { elements });
      set({ isDirty: false, isSaving: false });
    } catch (err) {
      console.error('Failed to save canvas:', err);
      set({ isSaving: false });
      throw err;
    }
  },

  resetCanvas: () =>
    set({
      canvasId: null,
      canvasName: 'Untitled',
      elements: [],
      selectedId: null,
      isDirty: false,
      isSaving: false,
    }),
}));
