<template>
	<v-sheet color="transparent">
		<v-row v-if="!conditions.length" dense>
			<v-col cols="12">
				<v-sheet class="pa-6 text-center bg-primary rounded-lg">
					<h5>No conditions yet</h5>
					<small class="text-grey-darken-1 text-caption">Create a threshold first, then attach a condition to it.</small>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="condition in conditions"
				:key="condition.id"
				cols="12"
				sm="6"
			>
				<ConditionCard
					:condition="condition"
					:threshold-name="getThresholdName(condition.thresholdId)"
					@edit="onClickEditCondition"
					@delete="onClickDeleteCondition"
				></ConditionCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showConditionCreateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Create Condition</h4>
				<ConditionCreateForm
					:thresholds="thresholds"
					:disabled="!networkStore.connected || !thresholds.length"
					@submit="onSubmitConditionCreateForm"
					@error="onFormError"
				></ConditionCreateForm>
			</v-sheet>
		</v-dialog>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showConditionUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Condition</h4>
				<ConditionUpdateForm
					v-if="selectedCondition"
					:condition="selectedCondition"
					:thresholds="thresholds"
					:disabled="!networkStore.connected || !thresholds.length"
					@submit="onSubmitConditionUpdateForm"
					@error="onFormError"
				></ConditionUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-sheet>
</template>

<script setup lang="ts">
import ConditionCard from "@/components/app/config/ConditionCard.vue"
import ConditionCreateForm from "@/components/app/config/ConditionCreateForm.vue"
import ConditionUpdateForm from "@/components/app/config/ConditionUpdateForm.vue"
import {
	ConditionCreateSchema as ConditionCreateFormSchema,
	ConditionUpdateSchema as ConditionUpdateFormSchema,
	type ConditionSchema,
} from "@/schemas/ConditionSchema"
import { useConditionStore } from "@/stores/condition"
import { useNetworkStore } from "@/stores/network"
import { useThresholdStore } from "@/stores/threshold"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { computed, onUnmounted, ref } from "vue"
import z from "zod"

//

const ConditionCreatePageSchema = ConditionCreateFormSchema.extend({
	thresholdId: z.coerce.number().int(),
})

const ConditionUpdatePageSchema = ConditionUpdateFormSchema.extend({
	thresholdId: z.coerce.number().int(),
})

type ConditionCreatePageSchema = z.infer<typeof ConditionCreatePageSchema>
type ConditionUpdatePageSchema = z.infer<typeof ConditionUpdatePageSchema>

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Condition
const conditionStore = useConditionStore()
const thresholdStore = useThresholdStore()
const { conditions } = storeToRefs(conditionStore)
const { thresholds } = storeToRefs(thresholdStore)
const showConditionCreateModal = ref(false)
const showConditionUpdateModal = ref(false)
const selectedConditionId = ref<number>()

const thresholdsById = computed(() => new Map(thresholds.value.map(threshold => [threshold.id, threshold.name])))
const selectedCondition = computed(() => conditions.value.find(condition => condition.id == selectedConditionId.value))

// --- Condition Actions
const getThresholdName = (thresholdId: number) => thresholdsById.value.get(thresholdId) ?? `Threshold #${thresholdId}`

const openCreate = () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!thresholds.value.length) return toastStore.error("Create a threshold first before adding a condition.")
	showConditionCreateModal.value = true
}

const onClickEditCondition = (condition: ConditionSchema) => {
	selectedConditionId.value = condition.id
	showConditionUpdateModal.value = true
}

const onClickDeleteCondition = async (condition: ConditionSchema) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await conditionStore
		.destroy(condition.id)
		.then(() => toastStore.success(`Condition for "${getThresholdName(condition.thresholdId)}" deleted successfully.`))
		.catch(e => toastStore.error(e?.message || "Failed to delete condition."))
}

// --- Condition Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitConditionCreateForm = async (
	values: ConditionCreatePageSchema,
	ctx: SubmissionContext<{ [K in keyof ConditionCreatePageSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	const parsedValues = ConditionCreatePageSchema.parse(values)

	await conditionStore
		.create(parsedValues)
		.then(res => toastStore.success(`Condition for "${getThresholdName(res.thresholdId)}" created successfully.`))
		.then(() => showConditionCreateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

const onSubmitConditionUpdateForm = async (
	values: ConditionUpdatePageSchema,
	ctx: SubmissionContext<{ [K in keyof ConditionUpdatePageSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!selectedCondition.value) return toastStore.error("No condition selected.")
	const parsedValues = ConditionUpdatePageSchema.parse(values)

	await conditionStore
		.update({ id: selectedCondition.value.id, ...parsedValues })
		.then(res => toastStore.success(`Condition for "${getThresholdName(res.thresholdId)}" updated successfully.`))
		.then(() => showConditionUpdateModal.value = false)
		.then(() => ctx.resetForm())
	.catch(onFormError)
}

//

const onUnmountedCb = () => {
	showConditionCreateModal.value = false
	showConditionUpdateModal.value = false
	selectedConditionId.value = undefined
}

onUnmounted(onUnmountedCb)

defineExpose({ openCreate })

//
</script>
