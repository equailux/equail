import z from "zod"

//

const CollectionSchema = z.object({
	id: z.coerce.number().int(),
	count: z.coerce.number().int(),
	collectAt: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const CollectionQuerySchema = CollectionSchema.partial()
const CollectionCreateSchema = CollectionSchema
	.pick({ count: true, collectAt: true })
	.extend({ count: z.coerce.number().int().min(1) })

const CollectionCreateFormSchema = CollectionCreateSchema.extend({
	collectAt: z.string()
		.min(1, "Collected date and time is required.")
		.refine(value => !Number.isNaN(new Date(value).getTime()), "Collected date and time is invalid."),
})

const CollectionUpdateSchema = CollectionCreateSchema.partial()

//

type CollectionSchema = z.infer<typeof CollectionSchema>
type CollectionQuerySchema = z.infer<typeof CollectionQuerySchema>
type CollectionCreateSchema = z.infer<typeof CollectionCreateSchema>
type CollectionCreateFormSchema = z.infer<typeof CollectionCreateFormSchema>
type CollectionUpdateSchema = z.infer<typeof CollectionUpdateSchema>

//

export {
	CollectionSchema,
	CollectionQuerySchema,
	CollectionCreateSchema,
	CollectionCreateFormSchema,
	CollectionUpdateSchema,
}
