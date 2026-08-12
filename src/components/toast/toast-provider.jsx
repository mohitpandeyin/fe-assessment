import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { Button } from '../button/button.jsx'
import { ToastContext } from './toast-context.js'

const toastIcons = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextIdRef = useRef(0)
  const timersRef = useRef(new Set())

  useEffect(
    () => () => {
      for (const timer of timersRef.current) {
        window.clearTimeout(timer)
      }
    },
    [],
  )

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    )
  }, [])

  const showToast = useCallback(
    ({ description, title, tone = 'success' }) => {
      const id = nextIdRef.current
      nextIdRef.current += 1
      setToasts((currentToasts) => [
        ...currentToasts.filter((toast) => toast.title !== title),
        { description, id, title, tone },
      ])

      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer)
        dismissToast(id)
      }, 4000)
      timersRef.current.add(timer)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic="false"
        aria-live="polite"
        className="toast-viewport"
      >
        {toasts.map((toast) => {
          const ToastIcon = toastIcons[toast.tone] ?? Info

          return (
            <div
              key={toast.id}
              className="toast"
              data-tone={toast.tone}
              role={toast.tone === 'error' ? 'alert' : 'status'}
            >
              <ToastIcon aria-hidden="true" size={18} />
              <div className="toast__content">
                <p className="font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-ink-secondary">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <Button
                aria-label="Dismiss notification"
                icon={X}
                onClick={() => dismissToast(toast.id)}
                size="compact"
                type="button"
                variant="quiet"
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
