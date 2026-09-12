import z from "zod";

//

const CaptureConfigSchema = z.object({
	id: z.coerce.number().int(),
	intervalMs: z.coerce.number().int().min(5000).max(86400000),
	enabled: z.coerce.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

const CaptureConfigQuerySchema = CaptureConfigSchema.partial()
const CaptureConfigCreateSchema = CaptureConfigSchema.pick({ intervalMs: true, enabled: true })
const CaptureConfigUpdateSchema = CaptureConfigSchema.pick({ intervalMs: true, enabled: true }).partial()

// --- The form works in seconds, the api stores milliseconds.
const CaptureConfigFormSchema = z.object({
	intervalSec: z.coerce.number().int().min(5).max(86400),
	enabled: z.boolean(),
})

//

type CaptureConfigSchema = z.infer<typeof CaptureConfigSchema>
type CaptureConfigQuerySchema = z.infer<typeof CaptureConfigQuerySchema>
type CaptureConfigCreateSchema = z.infer<typeof CaptureConfigCreateSchema>
type CaptureConfigUpdateSchema = z.infer<typeof CaptureConfigUpdateSchema>
type CaptureConfigFormSchema = z.infer<typeof CaptureConfigFormSchema>

//

export {
	CaptureConfigSchema,
	CaptureConfigQuerySchema,
	CaptureConfigCreateSchema,
	CaptureConfigUpdateSchema,
	CaptureConfigFormSchema,
}
