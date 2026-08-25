/**
 * Invokes App Router route handlers (GET/POST/PATCH/DELETE) directly,
 * the same way Next.js's runtime does: a standard Request object plus a
 * { params } object for dynamic segments. This exercises the real route
 * handler function — apiHandler(), Zod validation, Mongoose queries and
 * all — without needing a running HTTP server.
 */

type RouteHandler = (req: Request, ctx?: { params: Record<string, string> }) => Promise<Response>;

export function makeRequest(method: string, url: string, body?: unknown): Request {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
}

export async function callRoute(
  handler: RouteHandler,
  method: string,
  url: string,
  options: { body?: unknown; params?: Record<string, string> } = {}
): Promise<{ status: number; body: any }> {
  const req = makeRequest(method, url, options.body);
  const res = await handler(req, { params: options.params ?? {} });
  const status = res.status;
  let responseBody: any = null;
  try {
    responseBody = await res.json();
  } catch {
    // no JSON body
  }
  return { status, body: responseBody };
}
