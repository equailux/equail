import z from "zod";

//

const MortalitySchema = z.object({
    id: z.coerce.number().int(),
    count: z.coerce.number().int().min(1),
    date: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const MortalityCreateSchema = MortalitySchema.pick({ count: true, date: true })

//

type MortalitySchema = z.infer<typeof MortalitySchema>
type MortalityCreateSchema = z.infer<typeof MortalityCreateSchema>

//

export { MortalitySchema, MortalityCreateSchema }