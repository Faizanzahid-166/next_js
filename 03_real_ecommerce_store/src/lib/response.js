export function successResponse(message, data = null, status = 200) {
  return new Response(
    JSON.stringify({ status: "success", message, data }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export function errorResponse(message = "Something went wrong", status = 400) {
  return new Response(
    JSON.stringify({ status: "error", message }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}
