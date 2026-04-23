import z from "zod"

//

const ThresholdOp = ["All", "Any"] as const
type ThresholdOp = (typeof ThresholdOp)[number]

//

const ThresholdSchema = z.object({
	id: z.coerce.number().int(),
	name: z.string().min(1),
	icon: z.string().min(1),
	message: z.string().min(1),
	operator: z.enum(ThresholdOp),
	activated: z.boolean(),
	sensorId: z.coerce.number().int(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const ThresholdQuerySchema = ThresholdSchema.partial()

const ThresholdCreateSchema = ThresholdSchema.pick({
	name: true,
	icon: true,
	message: true,
	operator: true,
	activated: true,
	sensorId: true,
})

const ThresholdUpdateSchema = ThresholdSchema.pick({
	name: true,
	icon: true,
	message: true,
	operator: true,
	activated: true,
	sensorId: true,
}).partial()

//

type ThresholdSchema = z.infer<typeof ThresholdSchema>
type ThresholdQuerySchema = z.infer<typeof ThresholdQuerySchema>
type ThresholdCreateSchema = z.infer<typeof ThresholdCreateSchema>
type ThresholdUpdateSchema = z.infer<typeof ThresholdUpdateSchema>

//

export {
	ThresholdOp,
	ThresholdSchema,
	ThresholdQuerySchema,
	ThresholdCreateSchema,
	ThresholdUpdateSchema,
}
