import z from "zod";

//

const RemarkSchema = z.object({
    id: z.coerce.number().int(),
    comment: z.string().default(""),
    approved: z.coerce.string().transform((a) => a !== "0").optional(),
    captureId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const RemarkQuerySchema = RemarkSchema.partial()
const RemarkCreateSchema = RemarkSchema.pick({ comment: true, approved: true })
const RemarkUpdateSchema = RemarkSchema.pick({ comment: true, approved: true }).partial()

//

type RemarkSchema = z.infer<typeof RemarkSchema>
type RemarkQuerySchema = z.infer<typeof RemarkQuerySchema>
type RemarkCreateSchema = z.infer<typeof RemarkCreateSchema>
type RemarkUpdateSchema = z.infer<typeof RemarkUpdateSchema>

//

export { RemarkSchema, RemarkQuerySchema, RemarkCreateSchema, RemarkUpdateSchema }
