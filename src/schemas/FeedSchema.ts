import z from "zod";

//

const FeedSchema = z.object({
	id: z.coerce.number().int(),
	level: z.coerce.number(),
	detectionId: z.coerce.number().int().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const FeedManualSchema = z.object({
	direction: z.enum(["Forward", "Backward"]),
	durationMs: z.coerce.number().int().min(50).max(3000),
})

const FeedQuerySchema = FeedSchema.partial()
const FeedCreateSchema = FeedSchema.pick({ level: true, detectionId: true })
const FeedUpdateSchema = FeedSchema.pick({ level: true, detectionId: true }).partial()

//

type FeedSchema = z.infer<typeof FeedSchema>
type FeedManualSchema = z.infer<typeof FeedManualSchema>
type FeedQuerySchema = z.infer<typeof FeedQuerySchema>
type FeedCreateSchema = z.infer<typeof FeedCreateSchema>
type FeedUpdateSchema = z.infer<typeof FeedUpdateSchema>

//

export { FeedSchema, FeedManualSchema, FeedQuerySchema, FeedCreateSchema, FeedUpdateSchema }
