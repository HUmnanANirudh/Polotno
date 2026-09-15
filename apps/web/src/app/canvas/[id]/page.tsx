import CanvasPage from '../../../components/canvas/CanvasPage';

export default async function CanvasEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CanvasPage canvasId={id} />;
}
