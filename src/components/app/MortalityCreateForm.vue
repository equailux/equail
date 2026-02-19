<template>
	<v-form @submit.prevent="onSubmit">
		<v-number-input
			inset
			label="Count"
			placeholder="No. of Quails"
			v-model="count"
			:disabled="isSubmitting"
			:error-messages="countError"
		></v-number-input>
		<v-date-input
			label="Date"
			prepend-icon=""
			append-inner-icon="mdi-calendar"
			v-model="date"
			:disabled="isSubmitting"
			:error-messages="dateError"
		></v-date-input>
		<v-btn text="Add" type="Submit" color="primary" class="w-100" :loading="isSubmitting"></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import { MortalityCreateSchema } from "@/schemas/MortalitySchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	onError?: (error: any) => any
	onSubmit?: (
		values: MortalityCreateSchema,
		ctx: SubmissionContext<{ [K in keyof MortalityCreateSchema]?: unknown }>
	) => any
}>()

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(MortalityCreateSchema) })

const { value: count, errorMessage: countError } = useField<number>("count")
const { value: date, errorMessage: dateError } = useField<number>("date")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => props.onSubmit && props.onSubmit(values, ctx))
		.catch(err => props.onError && props.onError(err))
})

//
</script>

<style scoped></style>
