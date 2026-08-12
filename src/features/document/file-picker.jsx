export function FilePicker({
  children,
  disabled = false,
  inputRef,
  onChange,
  variant = 'secondary',
}) {
  return (
    <label
      className={`button button--${variant} file-picker`}
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
      <span aria-hidden="true">{children}</span>
    </label>
  )
}
