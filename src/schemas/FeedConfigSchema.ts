import z from "zod";

//

const FeedConfigSchema = z.object({
	id: z.coerce.number().int(),
	servo1Ms: z.coerce.number().int().min(0),
	servo2Ms: z.coerce.number().int().min(0),
	stepperMs: z.coerce.number().int().min(0),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const FeedConfigQuerySchema = FeedConfigSchema.partial()
const FeedConfigCreateSchema = FeedConfigSchema.pick({ servo1Ms: true, servo2Ms: true, stepperMs: true })
const FeedConfigUpdateSchema = FeedConfigSchema.pick({ servo1Ms: true, servo2Ms: true, stepperMs: true }).partial()

//

type FeedConfigSchema = z.infer<typeof FeedConfigSchema>
type FeedConfigQuerySchema = z.infer<typeof FeedConfigQuerySchema>
type FeedConfigCreateSchema = z.infer<typeof FeedConfigCreateSchema>
type FeedConfigUpdateSchema = z.infer<typeof FeedConfigUpdateSchema>

//

export { FeedConfigSchema, FeedConfigQuerySchema, FeedConfigCreateSchema, FeedConfigUpdateSchema }
