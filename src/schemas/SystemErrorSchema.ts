import z from "zod"

//

const SystemErrorSchema = z.object({
	id: z.coerce.number().int(),
	title: z.string().min(1),
	description: z.string().default(""),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const SystemErrorQuerySchema = SystemErrorSchema
	.pick({ createdAt: true })
	.partial()
	.extend({
		date: z.coerce.date(),
	})

//

type SystemErrorSchema = z.infer<typeof SystemErrorSchema>
type SystemErrorQuerySchema = z.infer<typeof SystemErrorQuerySchema>

//

export {
	SystemErrorSchema,
	SystemErrorQuerySchema,
}
