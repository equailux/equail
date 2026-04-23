import z from "zod";

//

const ConditionOp = ["<", "=", ">"] as const
type ConditionOp = (typeof ConditionOp)[number]

//

const ConditionSchema = z.object({
    id: z.coerce.number().int(),
    output: z.number(),
    operator: z.enum(ConditionOp),
    satisfied: z.boolean(),
    thresholdId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ConditionQuerySchema = ConditionSchema.partial()
const ConditionCreateSchema = ConditionSchema.pick({ output: true, operator: true, satisfied: true })
const ConditionUpdateSchema = ConditionSchema.pick({ output: true,  operator: true, satisfied: true }).partial()

//

type ConditionSchema = z.infer<typeof ConditionSchema>
type ConditionQuerySchema = z.infer<typeof ConditionQuerySchema>
type ConditionCreateSchema = z.infer<typeof ConditionCreateSchema>
type ConditionUpdateSchema = z.infer<typeof ConditionUpdateSchema>

//

export { 
    ConditionOp,
    ConditionSchema, 
    ConditionQuerySchema, 
    ConditionCreateSchema, 
    ConditionUpdateSchema,
}
