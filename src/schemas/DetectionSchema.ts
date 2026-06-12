import { z } from "zod"

//

const DetectionSchema = z.object({
	id: z.coerce.number().int(),
	box: z.object({
		x: z.coerce.number(),
		y: z.coerce.number(),
		w: z.coerce.number(),
		h: z.coerce.number(),
	}),
	class: z.string().min(1),
	confidence: z.coerce.number(),
	captureId: z.coerce.number().int(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const DetectionRawSchema = DetectionSchema.omit({ createdAt: true, updatedAt: true })
const DetectionCreateSchema = DetectionSchema.omit({ id: true, createdAt: true, updatedAt: true })
const DetectionUpdateSchema = DetectionSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()

//

type DetectionSchema = z.infer<typeof DetectionSchema>
type DetectionRawSchema = z.infer<typeof DetectionRawSchema>
type DetectionCreateSchema = z.infer<typeof DetectionCreateSchema>
type DetectionUpdateSchema = z.infer<typeof DetectionUpdateSchema>

//

export { DetectionSchema, DetectionRawSchema, DetectionCreateSchema, DetectionUpdateSchema }
