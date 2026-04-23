<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-text-field
			label="Sensor Name"
			placeholder="Temperature Sensor"
			v-model="name"
			:disabled="isSubmitting || disabled"
			:error-messages="nameError"
		></v-text-field>
		<v-text-field
			label="Tag"
			placeholder="sensor.temperature"
			v-model="tag"
			:disabled="isSubmitting || disabled"
			:error-messages="tagError"
		></v-text-field>
		<v-number-input
			inset
			label="Interval"
			placeholder="Polling interval in seconds"
			v-model="interval"
			:min="1"
			:disabled="isSubmitting || disabled"
			:error-messages="intervalError"
		></v-number-input>
		<v-btn
			type="submit"
			text="Update Sensor"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import type { SensorSchema, SensorUpdateSchema } from "@/schemas/SensorSchema"
import { SensorUpdateSchema as SensorUpdateFormSchema } from "@/schemas/SensorSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	disabled?: boolean
	sensor: SensorSchema
}>()

const emit = defineEmits<{
	submit: [
		values: SensorUpdateSchema,
		ctx: SubmissionContext<{ [K in keyof SensorUpdateSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(SensorUpdateFormSchema),
	initialValues: {
		name: props.sensor.name,
		tag: props.sensor.tag,
		interval: props.sensor.interval,
		lastread: props.sensor.lastread,
	},
})

const { value: name, errorMessage: nameError } = useField<string>("name")
const { value: tag, errorMessage: tagError } = useField<string>("tag")
const { value: interval, errorMessage: intervalError } = useField<number>("interval")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
