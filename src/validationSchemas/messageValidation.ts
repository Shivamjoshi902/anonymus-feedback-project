import {z} from "zod"

export const messageValidation = z.object({
    content : z.string().
                min(10, "content should be at least 10 characters").
                max(100, "content should be at most 100 characters")
})