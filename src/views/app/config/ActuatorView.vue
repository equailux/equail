<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4">
					<small class="text-accent">Manage your actuators</small>
					<h3>Actuator Management</h3>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4 d-flex justify-end">
					<v-btn
						icon="mdi-plus"
						class="bg-transparent"
						:disabled="!networkStore.connected"
						@click="showActuatorCreateModal = true"
					></v-btn>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="actuator in actuators"
				:key="actuator.id"
				cols="12"
				sm="6"
			>
				<ActuatorCard
					:actuator="actuator"
					@copy="onClickCopy"
					@edit="onClickEditActuator"
					@delete="onClickDeleteActuator"
				></ActuatorCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showActuatorCreateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Create Actuator</h4>
				<ActuatorCreateForm
					:disabled="!networkStore.connected"
					@submit="onSubmitActuatorCreateForm"
					@error="onFormError"
				></ActuatorCreateForm>
			</v-sheet>
		</v-dialog>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showActuatorUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Actuator</h4>
				<ActuatorUpdateForm
					v-if="selectedActuator"
					:actuator="selectedActuator"
					:disabled="!networkStore.connected"
					@submit="onSubmitActuatorUpdateForm"
					@error="onFormError"
				></ActuatorUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import ActuatorCard from "@/components/app/config/ActuatorCard.vue"
import ActuatorCreateForm from "@/components/app/config/ActuatorCreateForm.vue"
import ActuatorUpdateForm from "@/components/app/config/ActuatorUpdateForm.vue"
import type { ActuatorCreateSchema, ActuatorSchema, ActuatorUpdateSchema } from "@/schemas/ActuatorSchema"
import { useActuatorStore } from "@/stores/actuator"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { onMounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Actuator
const actuatorStore = useActuatorStore()
const { actuators } = storeToRefs(actuatorStore)
const showActuatorCreateModal = ref(false)
const showActuatorUpdateModal = ref(false)
const selectedActuator = ref<ActuatorSchema>()

// --- Actuator Actions
const onClickCopy = async (actuator: ActuatorSchema) => {
	await navigator.clipboard
		.writeText(actuator.tag)
		.then(() => toastStore.info(`"${actuator.tag}" tag copied to clipboard`))
		.catch(e => toastStore.error(e?.message || "Failed to copy to clipboard."))
}

const onClickEditActuator = (actuator: ActuatorSchema) => {
	selectedActuator.value = actuator
	showActuatorUpdateModal.value = true
}

const onClickDeleteActuator = async (actuator: ActuatorSchema) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await actuatorStore
		.destroy(actuator.id)
		.then(() => toastStore.success(`"${actuator.name}" deleted successfully.`))
		.catch(e => toastStore.error(e?.message || "Failed to delete actuator."))
}

// --- Actuator Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitActuatorCreateForm = async (
	values: ActuatorCreateSchema,
	ctx: SubmissionContext<{ [K in keyof ActuatorCreateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	await actuatorStore
		.create(values)
		.then(res => toastStore.success(`"${res.name}" created successfully.`))
		.then(() => showActuatorCreateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

const onSubmitActuatorUpdateForm = async (
	values: ActuatorUpdateSchema,
	ctx: SubmissionContext<{ [K in keyof ActuatorUpdateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!selectedActuator.value) return toastStore.error("No actuator selected.")

	await actuatorStore
		.update({ id: selectedActuator.value.id, ...values })
		.then(res => toastStore.success(`"${res.name}" updated successfully.`))
		.then(() => showActuatorUpdateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([actuatorStore.retrieve()])
}

onMounted(() => onMountedCb().catch(onFormError))

//
</script>
