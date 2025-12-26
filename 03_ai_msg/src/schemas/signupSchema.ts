import {z} from 'zod'

export const userValidation = z
      .string()
      .min(2,"Username must be atleast 2 chracters")
      .max(20, "Username must be no more than 20")
      .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special chracter")


export const signupSchema = z.object({
    username: userValidation,
    email: z.string().email({message:'invalid email address'}),
    password: z.string().min(6, {message:'password must be at least 6 chracter'
    })
})