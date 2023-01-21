export type TInterceptionError = {
  (lineNumber: number, method: string, module: string, message?: string): never,
  (lineNumber: string, method: string, module: string, message?: string): never,
}

export const interceptionError: TInterceptionError = (lineNumber, method, module, message = 'message') => {
  throw new Error(`Line:[ ${lineNumber} ], method:[ ${method} ], module: ${module}, ${message}`)
}
