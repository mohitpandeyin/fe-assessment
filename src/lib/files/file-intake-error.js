export class FileIntakeError extends Error {
  constructor(code, message, options) {
    super(message, options)
    this.name = 'FileIntakeError'
    this.code = code
  }
}
