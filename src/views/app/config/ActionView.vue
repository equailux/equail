<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4">
					<small class="text-accent">Manage your actions</small>
					<h3>Action Management</h3>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4 d-flex justify-end">
					<v-btn
						icon="mdi-plus"
						class="bg-transparent"
						:disabled="!networkStore.connected || !thresholds.length || !actuators.length"
						@click="onClickCreateAction"
					></v-btn>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row v-if="!actions.length" dense>
			<v-col cols="12">
				<v-sheet class="pa-6 text-center bg-primary rounded-lg">
					<h5>No actions yet</h5>
					<small class="text-grey-darken-1 text-caption">Create both a threshold and an actuator first, then connect them with an action.</small>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="action in actions"
				:key="action.id"
				cols="12"
				sm="6"
			>
				<ActionCard
					:action="action"
					:actuator-name="getActuatorName(action.actuatorId)"
					:threshold-name="getThresholdName(action.thresholdId)"
					@edit="onClickEditAction"
					@delete="onClickDeleteAction"
				></ActionCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showActionCreateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Create Action</h4>
				<ActionCreateForm
					:actuators="actuators"
					:thresholds="thresholds"
					:disabled="!networkStore.connected || !thresholds.length || !actuators.length"
					@submit="onSubmitActionCreateForm"
					@error="onFormError"
				></ActionCreateForm>
			</v-sheet>
		</v-dialog>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showActionUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Action</h4>
				<ActionUpdateForm
					v-if="selectedAction"
					:action="selectedAction"
					:actuators="actuators"
					:thresholds="thresholds"
					:disabled="!networkStore.connected || !thresholds.length || !actuators.length"
					@submit="onSubmitActionUpdateForm"
					@error="onFormError"
				></ActionUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import ActionCard from "@/components/app/config/ActionCard.vue"
import ActionCreateForm from "@/components/app/config/ActionCreateForm.vue"
import ActionUpdateForm from "@/components/app/config/ActionUpdateForm.vue"
import {
	ActionCreateSchema as ActionCreateFormSchema,
	ActionUpdateSchema as ActionUpdateFormSchema,
	type ActionSchema,
} from "@/schemas/ActionSchema"
import { useActionStore } from "@/stores/action"
import { useActuatorStore } from "@/stores/actuator"
import { useNetworkStore } from "@/stores/network"
import { useThresholdStore } from "@/stores/threshold"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { computed, onMounted, onUnmounted, ref } from "vue"
import z from "zod"

//

const ActionCreatePageSchema = ActionCreateFormSchema.extend({
	actuatorId: z.coerce.number().int(),
	thresholdId: z.coerce.number().int(),
})

const ActionUpdatePageSchema = ActionUpdateFormSchema.extend({
	actuatorId: z.coerce.number().int(),
	thresholdId: z.coerce.number().int(),
})

type ActionCreatePageSchema = z.infer<typeof ActionCreatePageSchema>
type ActionUpdatePageSchema = z.infer<typeof ActionUpdatePageSchema>

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Action
const actionStore = useActionStore()
const actuatorStore = useActuatorStore()
const thresholdStore = useThresholdStore()
const { actions } = storeToRefs(actionStore)
const { actuators } = storeToRefs(actuatorStore)
const { thresholds } = storeToRefs(thresholdStore)
const showActionCreateModal = ref(false)
const showActionUpdateModal = ref(false)
const selectedAction = ref<ActionSchema>()

const actuatorsById = computed(() => new Map(actuators.value.map(actuator => [actuator.id, actuator.name])))
const thresholdsById = computed(() => new Map(thresholds.value.map(threshold => [threshold.id, threshold.name])))

// --- Action Actions
const getActuatorName = (actuatorId: number) => actuatorsById.value.get(actuatorId) ?? `Actuator #${actuatorId}`
const getThresholdName = (thresholdId: number) => thresholdsById.value.get(thresholdId) ?? `Threshold #${thresholdId}`

const onClickCreateAction = () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!thresholds.value.length) return toastStore.error("Create a threshold first before adding an action.")
	if (!actuators.value.length) return toastStore.error("Create an actuator first before adding an action.")
	showActionCreateModal.value = true
}

const onClickEditAction = (action: ActionSchema) => {
	selectedAction.value = action
	showActionUpdateModal.value = true
}

const onClickDeleteAction = async (action: ActionSchema) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await actionStore
		.destroy(action.id)
		.then(() => toastStore.success(`Action for "${getThresholdName(action.thresholdId)}" deleted successfully.`))
		.catch(e => toastStore.error(e?.message || "Failed to delete action."))
}

// --- Action Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitActionCreateForm = async (
	values: ActionCreatePageSchema,
	ctx: SubmissionContext<{ [K in keyof ActionCreatePageSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	const parsedValues = ActionCreatePageSchema.parse(values)

	await actionStore
		.create(parsedValues)
		.then(res => toastStore.success(`Action for "${getThresholdName(res.thresholdId)}" created successfully.`))
		.then(() => showActionCreateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

const onSubmitActionUpdateForm = async (
	values: ActionUpdatePageSchema,
	ctx: SubmissionContext<{ [K in keyof ActionUpdatePageSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!selectedAction.value) return toastStore.error("No action selected.")
	const parsedValues = ActionUpdatePageSchema.parse(values)

	await actionStore
		.update({ id: selectedAction.value.id, ...parsedValues })
		.then(res => toastStore.success(`Action for "${getThresholdName(res.thresholdId)}" updated successfully.`))
		.then(() => showActionUpdateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([
		actionStore.retrieve(),
		actuatorStore.retrieve(),
		thresholdStore.retrieve(),
	])
}

const onUnmountedCb = () => {
	showActionCreateModal.value = false
	showActionUpdateModal.value = false
	selectedAction.value = undefined
}

onMounted(() => onMountedCb().catch(onFormError))
onUnmounted(onUnmountedCb)

//
</script>
