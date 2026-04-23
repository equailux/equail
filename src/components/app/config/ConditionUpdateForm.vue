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
			text="Update Condition"
			color="accent"
			class="w-100"
			:loading="isSubmitting"
			:disabled="disabled"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import type { ConditionSchema } from "@/schemas/ConditionSchema"
import { ConditionOp, ConditionUpdateSchema as ConditionUpdateFormSchema } from "@/schemas/ConditionSchema"
import type { ThresholdSchema } from "@/schemas/ThresholdSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"
import z from "zod"

//

const ConditionUpdatePageSchema = ConditionUpdateFormSchema.extend({
	thresholdId: z.coerce.number().int(),
})

type ConditionUpdatePageSchema = z.infer<typeof ConditionUpdatePageSchema>

const props = defineProps<{
	condition: ConditionSchema
	disabled?: boolean
	thresholds: ThresholdSchema[]
}>()

const emit = defineEmits<{
	submit: [
		values: ConditionUpdatePageSchema,
		ctx: SubmissionContext<{ [K in keyof ConditionUpdatePageSchema]?: unknown }>
	]
	error: [error: unknown]
}>()

const conditionOperators = ConditionOp

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(ConditionUpdatePageSchema),
	initialValues: {
		operator: props.condition.operator,
		output: props.condition.output,
		satisfied: props.condition.satisfied,
		thresholdId: props.condition.thresholdId,
	},
})

const { value: operator, errorMessage: operatorError } = useField<ConditionSchema["operator"]>("operator")
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
