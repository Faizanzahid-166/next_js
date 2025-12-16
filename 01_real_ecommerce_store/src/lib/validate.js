import { ZodError } from "zod";


export async function validateBody(schema, req) {
const body = await req.json();
try {
const parsed = schema.parse(body);
return { ok: true, data: parsed };
} catch (err) {
if (err instanceof ZodError) {
return { ok: false, error: err.errors.map(e => ({ path: e.path.join('.'), msg: e.message })) };
}
throw err;
}
}