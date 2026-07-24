export function LoadingState({ labelHe = 'טוען...' }: { labelHe?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-surface-2 border-t-brand" />
      <p className="text-text-muted text-sm">{labelHe}</p>
    </div>
  )
}
