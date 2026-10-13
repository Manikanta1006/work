// In-memory sliding-window rate limiter. Best-effort only: state lives in
// the memory of a single warm serverless instance, so it doesn't coordinate
// across cold starts or concurrent instances. Still meaningfully raises the
// bar against a single script hammering an endpoint, at zero added
// infrastructure or cost.
const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the map doesn't grow unbounded on a long-lived
  // warm instance.
  for (const [k, timestamps] of requestLog) {
    if (now - timestamps[timestamps.length - 1] > windowMs) {
      requestLog.delete(k);
    }
  }

  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  requestLog.set(key, timestamps);

  return timestamps.length > max;
}
