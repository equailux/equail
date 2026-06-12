<template>
	<v-form @submit.prevent="onSubmit">
		<v-number-input
			inset
			label="Count"
			placeholder="No. of Eggs"
			v-model="count"
			:disabled="isSubmitting"
			:error-messages="countError"
		></v-number-input>
		<v-text-field
			type="datetime-local"
			label="Collected At"
			append-inner-icon="mdi-calendar-clock"
			v-model="collectAt"
			:disabled="isSubmitting"
			:error-messages="collectAtError"
		></v-text-field>
		<v-btn
			text="Add"
			type="submit"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import {
	CollectionCreateFormSchema,
	type CollectionCreateSchema,
} from "@/schemas/CollectionSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	onError?: (error: string) => unknown
	onSubmit?: (
		values: CollectionCreateSchema,
		ctx: SubmissionContext<{ [K in keyof CollectionCreateFormSchema]?: unknown }>
	) => unknown
}>()

const toDatetimeLocalValue = (date = new Date()) => {
	const offset = date.getTimezoneOffset() * 60000
	return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(CollectionCreateFormSchema),
	initialValues: { count: 1, collectAt: toDatetimeLocalValue() },
})

const { value: count, errorMessage: countError } = useField<number>("count")
const { value: collectAt, errorMessage: collectAtError } = useField<string>("collectAt")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	const data = { ...values, collectAt: new Date(values.collectAt) }

	await Promise.resolve()
		.then(() => props.onSubmit && props.onSubmit(data, ctx))
		.then(() => ctx.resetForm({ values: { count: 1, collectAt: toDatetimeLocalValue() } }))
		.catch(err => props.onError && props.onError(err instanceof Error ? err.message : "Something went wrong."))
})

//
</script>

<style scoped></style>
