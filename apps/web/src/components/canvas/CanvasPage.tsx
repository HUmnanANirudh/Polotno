'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCanvasStore } from '../../store/canvas';
import { useAuthStore } from '../../store/auth';
import { SpinnerGapIcon, ArrowLeftIcon, FloppyDiskIcon, CheckIcon } from '@phosphor-icons/react';
import CanvasEditor from './CanvasEditor';

export default function CanvasPage({ canvasId }: { canvasId: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { canvasName, isDirty, isSaving, loadCanvas, saveCanvas, resetCanvas } = useCanvasStore();

  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load canvas
  useEffect(() => {
    if (!user) return;

    loadCanvas(canvasId)
      .then(() => setLoaded(true))
      .catch(() => setLoadError(true));

    return () => resetCanvas();
  }, [canvasId, user, loadCanvas, resetCanvas]);

  // Keyboard shortcut: Ctrl/Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveCanvas();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCanvas]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerGapIcon size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Canvas not found.</p>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-500">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerGapIcon size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-sm" />
            <span className="font-semibold text-gray-900 text-sm">{canvasName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
          <button
            onClick={() => saveCanvas()}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-md transition-colors shadow-sm"
          >
            {isSaving ? (
              <SpinnerGapIcon size={14} className="animate-spin" />
            ) : isDirty ? (
              <FloppyDiskIcon size={14} />
            ) : (
              <CheckIcon size={14} />
            )}
            Save
          </button>
        </div>
      </header>

      {/* Editor */}
      <CanvasEditor />
    </main>
  );
}
