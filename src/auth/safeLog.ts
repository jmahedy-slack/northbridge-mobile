/** Development diagnostics that must never include secrets or customer payloads. */
export function logDev(message: string, meta?: Record<string, string>): void {
  if (!__DEV__) return;
  if (meta) {
    console.log(`[northbridge] ${message}`, meta);
    return;
  }
  console.log(`[northbridge] ${message}`);
}
