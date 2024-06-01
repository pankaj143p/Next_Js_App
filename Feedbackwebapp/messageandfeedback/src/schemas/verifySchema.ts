import {z} from 'zod'

export const verifySchema = z.object({
    code : z.string().max(6,"verification code must be 6 digits")
    .regex(/0-9/,"code only cotains digits")
})
