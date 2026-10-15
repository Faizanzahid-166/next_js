export function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}


export function cacheHeaders({ publicCache = true, maxAge = 60, sMaxAge = 60, staleWhileRevalidate = 120 } = {}) {
  const visibility = publicCache ? "public" : "private";
  return {
    "Cache-Control": `${visibility}, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

export function successResponse(message, data = null, status = 200, extraHeaders = {}) {
  const payload = { status: "success", message };
  if (data !== null && data !== undefined) payload.data = data;
  return jsonResponse(payload, status, extraHeaders);
}


export function errorResponse(message = "Something went wrong", status = 400, extraHeaders = {}, code = null) {
  const payload = { status: "error", message };
  if (code) payload.code = code;
  return jsonResponse(payload, status, extraHeaders);
}