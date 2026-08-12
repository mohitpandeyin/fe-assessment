import { LoaderCircle } from 'lucide-react'

function joinClassNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function Button({
  children,
  className,
  disabled = false,
  icon: Icon,
  isLoading = false,
  size = 'default',
  variant = 'secondary',
  ...props
}) {
  const ButtonIcon = isLoading ? LoaderCircle : Icon

  return (
    <button
      {...props}
      aria-busy={isLoading || undefined}
      className={joinClassNames(
        'button',
        `button--${variant}`,
        `button--${size}`,
        className,
      )}
      disabled={disabled || isLoading}
    >
      {ButtonIcon ? (
        <ButtonIcon
          aria-hidden="true"
          className={isLoading ? 'button__spinner' : undefined}
          size={16}
          strokeWidth={1.8}
        />
      ) : null}
      {children}
    </button>
  )
}
