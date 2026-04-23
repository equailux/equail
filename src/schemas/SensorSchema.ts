import z from "zod";

//

const SensorSchema = z.object({
    id: z.coerce.number().int(),
    tag: z.string().min(1),
    name: z.string().min(1),
    interval: z.coerce.number().int(),
    lastread: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const SensorQuerySchema = SensorSchema.partial()
const SensorCreateSchema = SensorSchema.pick({ tag: true, name: true, interval: true, lastread: true })
const SensorUpdateSchema = SensorSchema.pick({ tag: true, name: true, interval: true, lastread: true }).partial()

//

type SensorSchema = z.infer<typeof SensorSchema>
type SensorQuerySchema = z.infer<typeof SensorQuerySchema>
type SensorCreateSchema = z.infer<typeof SensorCreateSchema>
type SensorUpdateSchema = z.infer<typeof SensorUpdateSchema>

//

export { SensorSchema, SensorQuerySchema, SensorCreateSchema, SensorUpdateSchema }
