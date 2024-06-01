
import {z} from 'zod'
export const messageSchema = z.object({
    content : z.string()
    .min(10,"message must be greather than 10 characters")
    .max(500,"message must be less than 500 characters")


})