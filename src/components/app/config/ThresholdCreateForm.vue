<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-text-field
			label="Threshold Name"
			placeholder="High Temperature"
			v-model="name"
			:disabled="isSubmitting || disabled"
			:error-messages="nameError"
		></v-text-field>
		<v-text-field
			label="Icon"
			placeholder="mdi-thermometer-alert"
			v-model="icon"
			:disabled="isSubmitting || disabled"
			:error-messages="iconError"
		></v-text-field>
		<v-textarea
			label="Message"
			placeholder="Water temperature is above the safe range."
			rows="3"
			auto-grow
			v-model="message"
			:disabled="isSubmitting || disabled"
			:error-messages="messageError"
		></v-textarea>
		<v-select
			label="Sensor"
			item-title="name"
			item-value="id"
			:items="sensors"
			v-model="sensorId"
			:disabled="isSubmitting || disabled"
			:error-messages="sensorIdError"
		></v-select>
		<v-select
			label="Operator"
			:items="thresholdOperators"
			v-model="operator"
			:disabled="isSubmitting || disabled"
			:error-messages="operatorError"
		></v-select>
		<v-switch
			inset
			color="accent"
			base-color="accent"
			label="Activated"
			v-model="activated"
			:disabled="isSubmitting || disabled"
			:error-messages="activatedError"
		></v-switch>
		<v-btn
			type="submit"
			text="Create Threshold"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import type { SensorSchema } from "@/schemas/SensorSchema"
import {
	ThresholdCreateSchema,
	ThresholdOp,
	type ThresholdCreateSchema as ThresholdCreateValues,
} from "@/schemas/ThresholdSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	disabled?: boolean
	sensors: SensorSchema[]
}>()

const emit = defineEmits<{
	submit: [
		values: ThresholdCreateValues,
		ctx: SubmissionContext<{ [K in keyof ThresholdCreateValues]?: unknown }>
	]
	error: [error: unknown]
}>()

const thresholdOperators = ThresholdOp

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(ThresholdCreateSchema),
	initialValues: {
		name: "",
		icon: "mdi-alert-outline",
		message: "",
		operator: "All",
		activated: true,
		sensorId: props.sensors[0]?.id,
	},
})

const { value: name, errorMessage: nameError } = useField<string>("name")
const { value: icon, errorMessage: iconError } = useField<string>("icon")
const { value: message, errorMessage: messageError } = useField<string>("message")
const { value: operator, errorMessage: operatorError } = useField<ThresholdCreateValues["operator"]>("operator")
const { value: activated, errorMessage: activatedError } = useField<boolean>("activated")
const { value: sensorId, errorMessage: sensorIdError } = useField<number>("sensorId")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
