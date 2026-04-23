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
			label="Operator"
			:items="conditionOperators"
			v-model="operator"
			:disabled="isSubmitting || disabled"
			:error-messages="operatorError"
		></v-select>
		<v-number-input
			inset
			label="Output"
			placeholder="0"
			v-model="output"
			:disabled="isSubmitting || disabled"
			:error-messages="outputError"
		></v-number-input>
		<v-switch
			inset
			color="accent"
			base-color="accent"
			label="Satisfied"
			v-model="satisfied"
			:disabled="isSubmitting || disabled"
			:error-messages="satisfiedError"
		></v-switch>
		<v-btn
			type="submit"
			:text="submitText"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import {
	ConditionCreateSchema,
	ConditionOp,
	type ConditionCreateSchema as ConditionCreateValues,
	type ConditionSchema,
	ConditionUpdateSchema as ConditionUpdateFormSchema,
} from "@/schemas/ConditionSchema"
import type { ThresholdSchema } from "@/schemas/ThresholdSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"
import { computed } from "vue"
import z from "zod"

//

const ConditionCreatePageSchema = ConditionCreateSchema.extend({
	thresholdId: z.coerce.number().int(),
})

const ConditionUpdatePageSchema = ConditionUpdateFormSchema.extend({
	thresholdId: z.coerce.number().int(),
})

type ConditionCreatePageSchema = z.infer<typeof ConditionCreatePageSchema>
type ConditionUpdatePageSchema = z.infer<typeof ConditionUpdatePageSchema>

const props = defineProps<{
	condition?: ConditionSchema
	disabled?: boolean
	submitText?: string
	thresholds: ThresholdSchema[]
}>()

const emit = defineEmits<{
	submit: [
		values: ConditionCreatePageSchema | ConditionUpdatePageSchema,
		ctx: SubmissionContext<{ [K in keyof ConditionCreatePageSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const isUpdate = computed(() => !!props.condition)
const conditionOperators = ConditionOp

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(isUpdate.value ? ConditionUpdatePageSchema : ConditionCreatePageSchema),
	initialValues: {
		operator: props.condition?.operator ?? "<",
		output: props.condition?.output ?? 0,
		satisfied: props.condition?.satisfied ?? false,
		thresholdId: props.condition?.thresholdId ?? props.thresholds[0]?.id,
	},
})

const { value: operator, errorMessage: operatorError } = useField<ConditionCreateValues["operator"]>("operator")
const { value: output, errorMessage: outputError } = useField<number>("output")
const { value: satisfied, errorMessage: satisfiedError } = useField<boolean>("satisfied")
const { value: thresholdId, errorMessage: thresholdIdError } = useField<number>("thresholdId")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => emit("submit", values, ctx))
		.catch(err => emit("error", err))
})

//
</script>
