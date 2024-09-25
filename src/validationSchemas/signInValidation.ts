import {z} from "zod"

export const signInValidation = z.object({
    identifier : z.string(),
    password : z.string()
                .min(6,'password must be of length 6 or more'),
})