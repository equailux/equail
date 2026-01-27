import z from "zod";

//

const UserSignUpSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
})

//

type UserSignUpSchema = z.infer<typeof UserSignUpSchema>

//

export { UserSignUpSchema }
