import z from "zod";

//

const MortalityCreateSchema = z.object({
    count: z.coerce.number().int().min(1),
    date: z.coerce.date(),
})

//

type MortalityCreateSchema = z.infer<typeof MortalityCreateSchema>

//

export { MortalityCreateSchema }