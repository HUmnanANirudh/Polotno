import dynamic from 'next/dynamic';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasProperties } from './CanvasProperties';

const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false });

export default function CanvasEditor() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <CanvasToolbar />
      <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50">
        <CanvasStage />
      </div>
      <CanvasProperties />
    </div>
  );
}
