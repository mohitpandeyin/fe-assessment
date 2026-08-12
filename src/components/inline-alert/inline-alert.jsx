import { AlertCircle, X } from 'lucide-react'

import { Button } from '../button/button.jsx'

export function InlineAlert({ description, onDismiss, title }) {
  return (
    <div className="inline-alert" role="alert">
      <AlertCircle aria-hidden="true" className="inline-alert__icon" size={18} />
      <div className="inline-alert__content">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
      </div>
      {onDismiss ? (
        <Button
          aria-label="Dismiss message"
          icon={X}
          onClick={onDismiss}
          size="compact"
          type="button"
          variant="quiet"
        />
      ) : null}
    </div>
  )
}
