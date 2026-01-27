import z from "zod";

//

const UserSignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

const UserSignUpSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
})

//

type UserSignInSchema = z.infer<typeof UserSignInSchema>
type UserSignUpSchema = z.infer<typeof UserSignUpSchema>

//

export { UserSignInSchema, UserSignUpSchema }
