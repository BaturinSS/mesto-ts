export type TInterceptionError = {
  (lineNumber: number, method: string, module: string, message?: string): never;
  (lineNumber: string, method: string, module: string, message?: string): never;
};

export const interceptionError: TInterceptionError = (
  lineNumber,
  method,
  module,
  message = "message"
) => {
  throw new Error(
    `Line:[ ${lineNumber} ], method:[ ${method} ], module: ${module}, ${message}`
  );
};

(function (): void {
  const elementCopyright: HTMLSpanElement | null =
    document.querySelector(".footer__copyright");
  if (elementCopyright) {
    elementCopyright.textContent = `© 2022 - ${new Date().getFullYear()}. Батурин Сергей`;
  } else {
    throw new Error('No element "footer__copyright"');
  }
})();
