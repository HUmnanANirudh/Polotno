'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth';
import { api } from '../../lib/api';
import { PlusIcon, TrashIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import type { CanvasResponse } from '@polotno/types';

export default function DashboardView() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuthStore();

  const [canvases, setCanvases] = useState<CanvasResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchCanvases = async () => {
    try {
      const res = await api.get<CanvasResponse[]>('/canvases');
      setCanvases(res.data || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  // Fetch canvases
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCanvases();
  }, [user]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await api.post<CanvasResponse>('/canvases', {
        name: `Untitled Canvas`,
      });
      if (res.data?.id) {
        router.push(`/canvas/${res.data.id}`);
      }
    } catch {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/canvases/${id}`);
      setCanvases((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // silently fail
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerGapIcon size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm" />
          <span className="font-bold text-gray-900 tracking-tight">Polotno</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">My Canvases</h1>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <PlusIcon size={16} weight="bold" />
            {creating ? 'Creating...' : 'New Canvas'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <SpinnerGapIcon size={32} className="animate-spin text-gray-400" />
          </div>
        ) : canvases.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <PlusIcon size={28} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">No canvases yet</h2>
            <p className="text-sm text-gray-500 mb-6">Create your first canvas to get started.</p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {creating ? 'Creating...' : 'Create Canvas'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {canvases.map((canvas) => (
              <div
                key={canvas.id}
                onClick={() => router.push(`/canvas/${canvas.id}`)}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
              >
                {/* Preview area */}
                <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                  <span className="text-xs text-gray-300 font-medium">
                    {canvas.width} × {canvas.height}
                  </span>
                </div>

                {/* Info */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{canvas.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(canvas.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, canvas.id)}
                    className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
