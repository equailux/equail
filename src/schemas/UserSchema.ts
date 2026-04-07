import z from "zod"

//

const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    email: z.string().email(),
    image: z.string().or(z.null()).or(z.undefined()),
    emailVerified: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

//

type UserSchema = z.infer<typeof UserSchema>

//

export { UserSchema }