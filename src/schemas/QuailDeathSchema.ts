import z from "zod";

//

const QuailDeathCreateSchema = z.object({
    count: z.coerce.number().int().min(1),
    date: z.coerce.date(),
})

//

type QuailDeathCreateSchema = z.infer<typeof QuailDeathCreateSchema>

//

export { QuailDeathCreateSchema }