<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4">
					<small class="text-accent">Manage you sensors</small>
					<h3>Sensor Management</h3>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4 d-flex justify-end">
					<v-btn
						icon="mdi-plus"
						class="bg-transparent"
						:disabled="!networkStore.connected"
						@click="showSensorCreateModal = true"
					></v-btn>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="sensor in sensors"
				cols="12"
				sm="6"
				:key="sensor.id"
			>
				<SensorCard
					:sensor="sensor"
					@copy="onClickCopy"
					@edit="onClickEditSensor"
					@delete="onClickDeleteSensor"
				></SensorCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showSensorCreateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Create Sensor</h4>
				<SensorCreateForm
					:disabled="!networkStore.connected"
					@submit="onSubmitSensorCreateForm"
					@error="onFormError"
				></SensorCreateForm>
			</v-sheet>
		</v-dialog>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showSensorUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Sensor</h4>
				<SensorUpdateForm
					v-if="selectedSensor"
					:sensor="selectedSensor"
					:disabled="!networkStore.connected"
					@submit="onSubmitSensorUpdateForm"
					@error="onFormError"
				></SensorUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import SensorCard from "@/components/app/config/SensorCard.vue"
import SensorCreateForm from "@/components/app/config/SensorCreateForm.vue"
import SensorUpdateForm from "@/components/app/config/SensorUpdateForm.vue"
import type { SensorCreateSchema, SensorSchema, SensorUpdateSchema } from "@/schemas/SensorSchema"
import { useNetworkStore } from "@/stores/network"
import { useSensorStore } from "@/stores/sensor"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { onMounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Sensor
const sensorStore = useSensorStore()
const { sensors } = storeToRefs(sensorStore)
const showSensorCreateModal = ref(false)
const showSensorUpdateModal = ref(false)
const selectedSensor = ref<SensorSchema>()

// --- Sensor Actions
const onClickCopy = async (sensor: SensorSchema) => {
	await navigator.clipboard
		.writeText(sensor.tag)
		.then(() => toastStore.info(`"${sensor.tag}" tag copied to clipboard`))
		.catch(e => toastStore.error(e?.message || "Failed to copy to clipboard."))
}

const onClickEditSensor = (sensor: SensorSchema) => {
	selectedSensor.value = sensor
	showSensorUpdateModal.value = true
}

const onClickDeleteSensor = async (sensor: SensorSchema) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await sensorStore
		.destroy(sensor.id)
		.then(() => toastStore.success(`"${sensor.name}" deleted successfully.`))
		.catch(e => toastStore.error(e?.message || "Failed to delete sensor."))
}

// --- Sensor Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitSensorCreateForm = async (
	values: SensorCreateSchema,
	ctx: SubmissionContext<{ [K in keyof SensorCreateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	await sensorStore
		.create(values)
		.then(res => toastStore.success(`"${res.name}" created successfully.`))
		.then(() => showSensorCreateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

const onSubmitSensorUpdateForm = async (
	values: SensorUpdateSchema,
	ctx: SubmissionContext<{ [K in keyof SensorUpdateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!selectedSensor.value) return toastStore.error("No sensor selected.")

	await sensorStore
		.update({ id: selectedSensor.value.id, ...values })
		.then(res => toastStore.success(`"${res.name}" updated successfully.`))
		.then(() => showSensorUpdateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([sensorStore.retrieve()])
}

onMounted(() => onMountedCb().catch(onFormError))

//

</script>
