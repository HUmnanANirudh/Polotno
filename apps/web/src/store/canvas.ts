import { create } from 'zustand';
import { api } from '../lib/api';
import type { CanvasElement, CanvasResponse } from '@polotno/types';

interface CanvasState {
  // Canvas metadata
  canvasId: string | null;
  canvasName: string;
  isDirty: boolean;
  isSaving: boolean;
  stageRef: any;

  // History
  past: CanvasElement[][];
  future: CanvasElement[][];

  // Elements
  elements: CanvasElement[];
  selectedId: string | null;

  // Element actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, data: Partial<CanvasElement>) => void;
  updateElementVisual: (id: string, data: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setStageRef: (ref: any) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // API actions
  loadCanvas: (id: string) => Promise<void>;
  saveCanvas: () => Promise<void>;
  resetCanvas: () => void;
}

const pushHistory = (state: CanvasState) => ({
  past: [...state.past, state.elements],
  future: [],
  canUndo: true,
  canRedo: false,
});

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasId: null,
  canvasName: 'Untitled',
  isDirty: false,
  isSaving: false,
  stageRef: null,
  setStageRef: (ref) => set({ stageRef: ref }),

  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  elements: [],
  selectedId: null,

  setElements: (elements) =>
    set((state) => ({
      ...pushHistory(state),
      elements,
      isDirty: true,
    })),

  addElement: (element) =>
    set((state) => ({
      ...pushHistory(state),
      elements: [...state.elements, element],
      isDirty: true,
    })),

  updateElement: (id, data) =>
    set((state) => ({
      ...pushHistory(state),
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...data } as CanvasElement) : el
      ),
      isDirty: true,
    })),

  updateElementVisual: (id, data) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...data } as CanvasElement) : el
      ),
      isDirty: true,
    })),

  deleteElement: (id) =>
    set((state) => ({
      ...pushHistory(state),
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      isDirty: true,
    })),

  selectElement: (id) => set({ selectedId: id }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const newPast = [...state.past];
      const previous = newPast.pop()!;
      return {
        past: newPast,
        future: [state.elements, ...state.future],
        elements: previous,
        isDirty: true,
        canUndo: newPast.length > 0,
        canRedo: true,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const newFuture = [...state.future];
      const next = newFuture.shift()!;
      return {
        past: [...state.past, state.elements],
        future: newFuture,
        elements: next,
        isDirty: true,
        canUndo: true,
        canRedo: newFuture.length > 0,
      };
    }),

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
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        });
      }
    } catch (err) {
      console.error('Failed to load canvas:', err);
      throw err;
    }
  },

  saveCanvas: async () => {
    const { canvasId, elements, stageRef } = get();
    if (!canvasId) return;

    set({ isSaving: true });
    try {
      let thumbnail = null;
      if (stageRef) {
        // Generate a thumbnail (scaled down to save space)
        thumbnail = stageRef.toDataURL({ pixelRatio: 0.3 });
      }

      await api.put(`/canvases/${canvasId}`, { elements, thumbnail });
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
  stageRef: null,
  setStageRef: (ref) => set({ stageRef: ref }),
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
}));
