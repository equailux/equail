import z from "zod";

//

const ActuatorSchema = z.object({
    id: z.coerce.number().int(),
    tag: z.string().min(1),
    name: z.string().min(1),
    input: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ActuatorQuerySchema = ActuatorSchema.partial()
const ActuatorCreateSchema = ActuatorSchema.pick({ tag: true, name: true, input: true })
const ActuatorUpdateSchema = ActuatorSchema.pick({ tag: true, name: true, input: true }).partial()

//

type ActuatorSchema = z.infer<typeof ActuatorSchema>
type ActuatorQuerySchema = z.infer<typeof ActuatorQuerySchema>
type ActuatorCreateSchema = z.infer<typeof ActuatorCreateSchema>
type ActuatorUpdateSchema = z.infer<typeof ActuatorUpdateSchema>

//

export { ActuatorSchema, ActuatorQuerySchema, ActuatorCreateSchema, ActuatorUpdateSchema }
