import * as ToastPrimitive from '@radix-ui/react-toast'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const COLORS: Record<ToastKind, string> = {
  success: 'text-ok',
  error: 'text-danger',
  info: 'text-text',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, kind }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="up" duration={3500}>
        {children}
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind]
          return (
            <ToastPrimitive.Root
              key={toast.id}
              onOpenChange={(open) => !open && removeToast(toast.id)}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 shadow-lg data-[state=closed]:opacity-0 transition-opacity"
            >
              <Icon size={18} className={cn('shrink-0', COLORS[toast.kind])} aria-hidden />
              <ToastPrimitive.Description className="text-sm">{toast.message}</ToastPrimitive.Description>
            </ToastPrimitive.Root>
          )
        })}
        <ToastPrimitive.Viewport className="fixed bottom-24 inset-x-0 z-[60] mx-auto flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
