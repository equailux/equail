import z from "zod";

//

const ActionSchema = z.object({
    id: z.coerce.number().int(),
    input: z.coerce.number(),
    delay: z.coerce.number().int(),
    duration: z.coerce.number().int(),
    actuatorId: z.coerce.number().int(),
    thresholdId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ActionQuerySchema = ActionSchema.partial()
const ActionCreateSchema = ActionSchema.pick({ input: true, delay: true, duration: true })
const ActionUpdateSchema = ActionSchema.pick({ input: true, delay: true, duration: true }).partial()

//

type ActionSchema = z.infer<typeof ActionSchema>
type ActionQuerySchema = z.infer<typeof ActionQuerySchema>
type ActionCreateSchema = z.infer<typeof ActionCreateSchema>
type ActionUpdateSchema = z.infer<typeof ActionUpdateSchema>

//

export { ActionSchema, ActionQuerySchema, ActionCreateSchema, ActionUpdateSchema }
