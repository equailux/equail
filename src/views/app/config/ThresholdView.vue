<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4">
					<small class="text-accent">Manage your thresholds</small>
					<h3>Threshold Management</h3>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4 d-flex justify-end">
					<v-btn
						icon="mdi-plus"
						class="bg-transparent"
						:disabled="!networkStore.connected || !sensors.length"
						@click="onClickCreateThreshold"
					></v-btn>
				</v-sheet>
			</v-col>
		</v-row>
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
	</v-container>
</template>

<script setup lang="ts">
import ThresholdCard from "@/components/app/config/ThresholdCard.vue"
import ThresholdCreateForm from "@/components/app/config/ThresholdCreateForm.vue"
import ThresholdUpdateForm from "@/components/app/config/ThresholdUpdateForm.vue"
import useWsEvent from "@/composables/use-ws-event"
import {
	ThresholdCreateSchema as ThresholdCreateFormSchema,
	ThresholdUpdateSchema as ThresholdUpdateFormSchema,
	type ThresholdCreateSchema,
	type ThresholdSchema,
	type ThresholdUpdateSchema,
} from "@/schemas/ThresholdSchema"
import type { WsEventHandler } from "@/schemas/WsEventSchema"
import { useNetworkStore } from "@/stores/network"
import { useSensorStore } from "@/stores/sensor"
import { useThresholdStore } from "@/stores/threshold"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { computed, onMounted, onUnmounted, ref } from "vue"

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
const selectedThreshold = ref<ThresholdSchema>()
const wsEvent = useWsEvent()

const sensorsById = computed(() => new Map(sensors.value.map(sensor => [sensor.id, sensor.name])))

// --- Threshold Actions
const getSensorName = (sensorId: number) => sensorsById.value.get(sensorId) ?? `Sensor #${sensorId}`

const onClickCreateThreshold = () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	if (!sensors.value.length) return toastStore.error("Create a sensor first before adding a threshold.")
	showThresholdCreateModal.value = true
}

const onClickEditThreshold = (threshold: ThresholdSchema) => {
	selectedThreshold.value = threshold
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

const onWsEventThreshold: WsEventHandler<ThresholdSchema> = data => {
	for (const threshold of data) {
		const index = thresholds.value.findIndex(item => item.id == threshold.id)
		if (index == -1) continue

		thresholds.value.splice(index, 1, threshold)
		if (selectedThreshold.value?.id == threshold.id) selectedThreshold.value = threshold
	}
}

const onMountedWs = async () => {
	const url = new URL(import.meta.env.VITE_API_URL)
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
    url.pathname = "/ws/app"

	await Promise
		.resolve()
		.then(() => wsEvent.connect(url.toString()))
		.catch(() => toastStore.error("Failed to connect realtime."))
	wsEvent.listen("Threshold", "Update", onWsEventThreshold)
}

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([
		onMountedWs(),
		thresholdStore.retrieve(),
		sensorStore.retrieve(),
	])
}

const onUnmountedCb = () => {
	showThresholdCreateModal.value = false
	showThresholdUpdateModal.value = false
	selectedThreshold.value = undefined
	wsEvent.disconnect()
}

onMounted(() => onMountedCb().catch(onFormError))
onUnmounted(onUnmountedCb)

//
</script>
