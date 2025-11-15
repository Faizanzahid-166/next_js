import { serialize } from "cookie";


const isProduction = process.env.NODE_ENV === "production";


export function createSetCookieHeader(name, value, options = {}) {
const base = {
httpOnly: true,
secure: isProduction,
sameSite: "lax",
path: "/",
maxAge: 60 * 60 * 24 * 7, // default 7 days
...options,
};


// cookie.serialize expects plain object keys lowercased for some flags
return serialize(name, value, base);
}


export function parseCookies(cookieHeader) {
if (!cookieHeader) return {};
return Object.fromEntries(cookieHeader.split(";").map(part => {
const [k, ...v] = part.split("=");
return [k.trim(), decodeURIComponent(v.join("="))];
}));
}