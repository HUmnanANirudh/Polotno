export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 ${className}`}>
      <div className="w-5 h-5 bg-blue-600 rounded-sm" />
    </div>
  );
}
