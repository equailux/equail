<template>
	<v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
		<v-text-field
			label="Actuator Name"
			placeholder="Aeration Relay"
			v-model="name"
			:disabled="isSubmitting || disabled"
			:error-messages="nameError"
		></v-text-field>
		<v-text-field
			label="Tag"
			placeholder="actuator.aerator"
			v-model="tag"
			:disabled="isSubmitting || disabled"
			:error-messages="tagError"
		></v-text-field>
		<v-number-input
			inset
			label="Input"
			placeholder="GPIO input number"
			v-model="input"
			:min="0"
			:disabled="isSubmitting || disabled"
			:error-messages="inputError"
		></v-number-input>
		<v-btn
			type="submit"
			text="Update Actuator"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import type { ActuatorSchema, ActuatorUpdateSchema } from "@/schemas/ActuatorSchema"
import { ActuatorUpdateSchema as ActuatorUpdateFormSchema } from "@/schemas/ActuatorSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	disabled?: boolean
	actuator: ActuatorSchema
}>()

const emit = defineEmits<{
	submit: [
		values: ActuatorUpdateSchema,
		ctx: SubmissionContext<{ [K in keyof ActuatorUpdateSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(ActuatorUpdateFormSchema),
	initialValues: {
		name: props.actuator.name,
		tag: props.actuator.tag,
		input: props.actuator.input,
	},
})

const { value: name, errorMessage: nameError } = useField<string>("name")
const { value: tag, errorMessage: tagError } = useField<string>("tag")
const { value: input, errorMessage: inputError } = useField<number>("input")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
