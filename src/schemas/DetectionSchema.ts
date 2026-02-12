import { z } from "zod";

//

const DetectionSchema = z.object({
    box: z.object({
        x: z.coerce.number(),
        y: z.coerce.number(),
        w: z.coerce.number(),
        h: z.coerce.number(),
    }),
    class: z.string(),
    confidence: z.coerce.number()
})

//

type DetectionSchema = z.infer<typeof DetectionSchema>

//

export { DetectionSchema }
