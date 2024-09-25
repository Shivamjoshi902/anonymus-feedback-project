import {z} from "zod"
export const userNameValidation = z.string()
                                .min(2,'userName should be at least 2 characters')
                                .max(20,'userName should be at most 20 characters')
                                .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')

export const signupValidation = z.object(
    {
        userName : userNameValidation,
        email : z.string()
                .email('Invalid email address'),
        password : z.string()
                    .min(6,'password must be of length 6 or more'),
    }
)