import CanvasEditor from '../components/canvas/CanvasEditor';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
          <span className="font-bold text-gray-900 tracking-tight">Polotno</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-400">Unsaved changes</span>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm">
            Save Canvas
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Editor Area */}
      <CanvasEditor />
    </main>
  );
}
