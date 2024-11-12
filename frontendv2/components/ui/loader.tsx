// components/ui/loader.tsx

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={`w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
