import {z} from "zod"

export const verifyValidation = z.object({
    verifyCode : z.string().length(6,'verification code must be of length 6')
})