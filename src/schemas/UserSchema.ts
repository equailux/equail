import z from "zod"

//

const UserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    image: z.string().or(z.null()).or(z.undefined()),
    password: z.string().min(8),
    emailVerified: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const UserSafeSchema = UserSchema.omit({ password: true })
const UserSignUpSchema = UserSchema.pick({ name: true, email: true, password: true })
const UserSignInSchema = UserSchema.pick({ email: true, password: true })
const UserForgotPasswordSchema = UserSchema.pick({ email: true })

const UserResetPasswordSchema = UserSchema
    .pick({ password: true })
	.extend({ confirm: z.string().min(8) })
	.refine(v => v.password === v.confirm, { message: "Passwords do not match.", path: ["confirm"] })

//

type UserSchema = z.infer<typeof UserSchema>
type UserSafeSchema = z.infer<typeof UserSafeSchema>
type UserSignUpSchema = z.infer<typeof UserSignUpSchema>
type UserSignInSchema = z.infer<typeof UserSignInSchema>
type UserForgotPasswordSchema = z.infer<typeof UserForgotPasswordSchema>
type UserResetPasswordSchema = z.infer<typeof UserResetPasswordSchema>

//

export {
    UserSchema,
    UserSafeSchema,
    UserSignUpSchema,
    UserSignInSchema,
    UserForgotPasswordSchema,
    UserResetPasswordSchema,
}
