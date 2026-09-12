<template>
	<v-sheet color="transparent">
		<v-row v-if="!thresholds.length" dense>
			<v-col cols="12">
				<v-sheet class="pa-6 text-center bg-primary rounded-lg">
					<h5>No thresholds yet</h5>
					<small class="text-grey-darken-1 text-caption">Create a threshold to start monitoring sensor readings.</small>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="threshold in thresholds"
				:key="threshold.id"
				cols="12"
				sm="6"
			>
				<ThresholdCard
					:threshold="threshold"
					:sensor-name="getSensorName(threshold.sensorId)"
					@edit="onClickEditThreshold"
					@delete="onClickDeleteThreshold"
				></ThresholdCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showThresholdCreateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Create Threshold</h4>
				<ThresholdCreateForm
					:sensors="sensors"
					:disabled="!networkStore.connected || !sensors.length"
					@submit="onSubmitThresholdCreateForm"
					@error="onFormError"
				></ThresholdCreateForm>
			</v-sheet>
		</v-dialog>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showThresholdUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Threshold</h4>
				<ThresholdUpdateForm
					v-if="selectedThreshold"
					:threshold="selectedThreshold"
					:sensors="sensors"
					:disabled="!networkStore.connected || !sensors.length"
					@submit="onSubmitThresholdUpdateForm"
					@error="onFormError"
				></ThresholdUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-sheet>
</template>

<script setup lang="ts">
import ThresholdCard from "@/components/app/config/ThresholdCard.vue"
import ThresholdCreateForm from "@/components/app/config/ThresholdCreateForm.vue"
import ThresholdUpdateForm from "@/components/app/config/ThresholdUpdateForm.vue"
import {
	ThresholdCreateSchema as ThresholdCreateFormSchema,
	ThresholdUpdateSchema as ThresholdUpdateFormSchema,
	type ThresholdCreateSchema,
	type ThresholdSchema,
	type ThresholdUpdateSchema,
} from "@/schemas/ThresholdSchema"
import { useNetworkStore } from "@/stores/network"
import { useSensorStore } from "@/stores/sensor"
import { useThresholdStore } from "@/stores/threshold"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { computed, onUnmounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Threshold
const thresholdStore = useThresholdStore()
const sensorStore = useSensorStore()
const { thresholds } = storeToRefs(thresholdStore)
const { sensors } = storeToRefs(sensorStore)
const showThresholdCreateModal = ref(false)
const showThresholdUpdateModal = ref(false)
const selectedThresholdId = ref<number>()

const sensorsById = computed(() => new Map(sensors.value.map(sensor => [sensor.id, sensor.name])))
const selectedThreshold = computed(() => thresholds.value.find(threshold => threshold.id == selectedThresholdId.value))

// --- Threshold Actions
const getSensorName = (sensorId: number) => sensorsById.value.get(sensorId) ?? `Sensor #${sensorId}`

const openCreate = () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!sensors.value.length) return toastStore.error("Create a sensor first before adding a threshold.")
	showThresholdCreateModal.value = true
}

const onClickEditThreshold = (threshold: ThresholdSchema) => {
	selectedThresholdId.value = threshold.id
	showThresholdUpdateModal.value = true
}

const onClickDeleteThreshold = async (threshold: ThresholdSchema) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await thresholdStore
		.destroy(threshold.id)
		.then(() => toastStore.success(`"${threshold.name}" deleted successfully.`))
		.catch(e => toastStore.error(e?.message || "Failed to delete threshold."))
}

// --- Threshold Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitThresholdCreateForm = async (
	values: ThresholdCreateSchema,
	ctx: SubmissionContext<{ [K in keyof ThresholdCreateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	const parsedValues = ThresholdCreateFormSchema.parse(values)

	await thresholdStore
		.create(parsedValues)
		.then(res => toastStore.success(`"${res.name}" created successfully.`))
		.then(() => showThresholdCreateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

const onSubmitThresholdUpdateForm = async (
	values: ThresholdUpdateSchema,
	ctx: SubmissionContext<{ [K in keyof ThresholdUpdateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!selectedThreshold.value) return toastStore.error("No threshold selected.")
	const parsedValues = ThresholdUpdateFormSchema.parse(values)

	await thresholdStore
		.update({ id: selectedThreshold.value.id, ...parsedValues })
		.then(res => toastStore.success(`"${res.name}" updated successfully.`))
		.then(() => showThresholdUpdateModal.value = false)
		.then(() => ctx.resetForm())
	.catch(onFormError)
}

//

const onUnmountedCb = () => {
	showThresholdCreateModal.value = false
	showThresholdUpdateModal.value = false
	selectedThresholdId.value = undefined
}

onUnmounted(onUnmountedCb)

defineExpose({ openCreate })

//
</script>
