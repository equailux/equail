<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-number-input
			inset
			label="Servo 1 Duration (ms)"
			placeholder="Duration in milliseconds"
			v-model="servo1Ms"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="servo1MsError"
		></v-number-input>
		<v-number-input
			inset
			label="Servo 2 Duration (ms)"
			placeholder="Duration in milliseconds"
			v-model="servo2Ms"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="servo2MsError"
		></v-number-input>
		<v-number-input
			inset
			label="Stepper Duration (ms)"
			placeholder="Duration in milliseconds"
			v-model="stepperMs"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="stepperMsError"
		></v-number-input>
		<v-number-input
			inset
			label="Threshold (%)"
			placeholder="Percentage (0-100)"
			v-model="threshold"
			:min="0"
			:max="100"
			:disabled="isSubmitting || disabled"
			:error-messages="thresholdError"
		></v-number-input>
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
import type { FeedConfigSchema, FeedConfigUpdateSchema } from "@/schemas/FeedConfigSchema"
import { FeedConfigUpdateSchema as FeedConfigUpdateFormSchema } from "@/schemas/FeedConfigSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	disabled?: boolean
	config: FeedConfigSchema
}>()

const emit = defineEmits<{
	submit: [
		values: FeedConfigUpdateSchema,
		ctx: SubmissionContext<{ [K in keyof FeedConfigUpdateSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(FeedConfigUpdateFormSchema),
	initialValues: {
		servo1Ms: props.config.servo1Ms,
		servo2Ms: props.config.servo2Ms,
		stepperMs: props.config.stepperMs,
		threshold: props.config.threshold,
	},
})

const { value: servo1Ms, errorMessage: servo1MsError } = useField<number>("servo1Ms")
const { value: servo2Ms, errorMessage: servo2MsError } = useField<number>("servo2Ms")
const { value: stepperMs, errorMessage: stepperMsError } = useField<number>("stepperMs")
const { value: threshold, errorMessage: thresholdError } = useField<number>("threshold")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
