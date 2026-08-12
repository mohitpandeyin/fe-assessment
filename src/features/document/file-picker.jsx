export function FilePicker({
  children,
  disabled = false,
  icon: Icon,
  inputRef,
  onChange,
  size = 'default',
  variant = 'secondary',
}) {
  return (
    <label
      className={`button button--${variant} button--${size} file-picker`}
      data-disabled={disabled || undefined}
    >
      <input
        ref={inputRef}
        accept=".md,.markdown,text/markdown"
        aria-label={children}
        className="sr-only"
        disabled={disabled}
        onChange={onChange}
        type="file"
      />
      {Icon ? <Icon aria-hidden="true" size={16} strokeWidth={1.8} /> : null}
      <span aria-hidden="true">{children}</span>
    </label>
  )
}
