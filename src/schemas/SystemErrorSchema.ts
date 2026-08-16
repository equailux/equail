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

const SystemErrorPageSchema = z.object({
	rows: z.array(SystemErrorSchema),
	total: z.coerce.number().int(),
})

//

type SystemErrorSchema = z.infer<typeof SystemErrorSchema>
type SystemErrorQuerySchema = z.infer<typeof SystemErrorQuerySchema>
type SystemErrorPageSchema = z.infer<typeof SystemErrorPageSchema>

//

export {
	SystemErrorSchema,
	SystemErrorQuerySchema,
	SystemErrorPageSchema,
}
