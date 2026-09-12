<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-number-input
			inset
			label="Capture Interval (seconds)"
			placeholder="Interval in seconds"
			v-model="intervalSec"
			:min="5"
			:max="86400"
			:disabled="isSubmitting || disabled"
			:error-messages="intervalSecError"
			:hint="hint"
			persistent-hint
		></v-number-input>
		<v-switch
			inset
			hide-details
			color="accent"
			base-color="accent"
			label="Scheduled Capture"
			v-model="enabled"
			:disabled="isSubmitting || disabled"
		></v-switch>
		<v-btn
			type="submit"
			text="Update Configuration"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import type { CaptureConfigFormSchema, CaptureConfigSchema } from "@/schemas/CaptureConfigSchema"
import { CaptureConfigFormSchema as CaptureConfigUpdateFormSchema } from "@/schemas/CaptureConfigSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"
import { computed } from "vue"

//

const props = defineProps<{
	disabled?: boolean
	config: CaptureConfigSchema
}>()

const emit = defineEmits<{
	submit: [
		values: CaptureConfigFormSchema,
		ctx: SubmissionContext<{ [K in keyof CaptureConfigFormSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(CaptureConfigUpdateFormSchema),
	initialValues: {
		intervalSec: Math.round(props.config.intervalMs / 1000),
		enabled: props.config.enabled,
	},
})

const { value: intervalSec, errorMessage: intervalSecError } = useField<number>("intervalSec")
const { value: enabled } = useField<boolean>("enabled")

//

const hint = computed(() => {
	const seconds = Number(intervalSec.value)
	if (!Number.isFinite(seconds) || seconds <= 0) return "Between 5 seconds and 24 hours."
	return `Captures every ${(seconds / 60).toFixed(1)} minutes.`
})

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
