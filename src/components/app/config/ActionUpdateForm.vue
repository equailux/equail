<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-select
			label="Threshold"
			item-title="name"
			item-value="id"
			:items="thresholds"
			v-model="thresholdId"
			:disabled="isSubmitting || disabled"
			:error-messages="thresholdIdError"
		></v-select>
		<v-select
			label="Actuator"
			item-title="name"
			item-value="id"
			:items="actuators"
			v-model="actuatorId"
			:disabled="isSubmitting || disabled"
			:error-messages="actuatorIdError"
		></v-select>
		<v-number-input
			inset
			label="Input"
			placeholder="0"
			v-model="input"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="inputError"
		></v-number-input>
		<v-number-input
			inset
			label="Delay"
			placeholder="0"
			v-model="delay"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="delayError"
		></v-number-input>
		<v-number-input
			inset
			label="Duration"
			placeholder="0"
			v-model="duration"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="durationError"
		></v-number-input>
		<v-btn
			type="submit"
			text="Update Action"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import { ActionUpdateSchema as ActionUpdateFormSchema, type ActionSchema } from "@/schemas/ActionSchema"
import type { ActuatorSchema } from "@/schemas/ActuatorSchema"
import type { ThresholdSchema } from "@/schemas/ThresholdSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"
import z from "zod"

//

const ActionUpdatePageSchema = ActionUpdateFormSchema.extend({
	actuatorId: z.coerce.number().int(),
	thresholdId: z.coerce.number().int(),
})

type ActionUpdatePageSchema = z.infer<typeof ActionUpdatePageSchema>

const props = defineProps<{
	action: ActionSchema
	actuators: ActuatorSchema[]
	disabled?: boolean
	thresholds: ThresholdSchema[]
}>()

const emit = defineEmits<{
	submit: [
		values: ActionUpdatePageSchema,
		ctx: SubmissionContext<{ [K in keyof ActionUpdatePageSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(ActionUpdatePageSchema),
	initialValues: {
		actuatorId: props.action.actuatorId,
		delay: props.action.delay,
		duration: props.action.duration,
		input: props.action.input,
		thresholdId: props.action.thresholdId,
	},
})

const { value: thresholdId, errorMessage: thresholdIdError } = useField<number>("thresholdId")
const { value: actuatorId, errorMessage: actuatorIdError } = useField<number>("actuatorId")
const { value: input, errorMessage: inputError } = useField<number>("input")
const { value: delay, errorMessage: delayError } = useField<number>("delay")
const { value: duration, errorMessage: durationError } = useField<number>("duration")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
