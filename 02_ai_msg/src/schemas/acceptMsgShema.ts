import { z } from "zod";

export const acceptMsgShema = z.object({
    acceptMessages: z.string(),
})