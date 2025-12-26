import { z } from "zod";

export const siginSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})