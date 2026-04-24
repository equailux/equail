<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Welcome back</small>
					<h3>Today's Overview</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-accent border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h5 class="text-grey-lighten-1">EGGS DETECTED</h5>
						<div 
							class="pa-2 rounded-lg d-flex align-center justify-center"
							style="width: 32px; height: 32px; background-color: rgba(var(--v-theme-primary), 0.1)"
						>
							<v-icon size="x-small" color="primary">mdi-egg-outline</v-icon>
						</div>
					</div>
					<div class="mt-2 d-flex align-center ga-2">
						<h1>{{ eggCountTotal }}</h1>
						<span class="text-grey-lighten-2 text-subtitle-2">total</span>
					</div>
					<div class="d-flex align-center justify-space-between">
						<span class="text-grey-lighten-1 text-caption">+12% from yesterday</span>	
						<v-btn
							to="/app/dashboard/detection"
							size="x-small"
							icon="mdi-arrow-right"
							color="transparent"
							:disabled="!networkStore.connected"
						></v-btn>
					</div>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg border elevation-1" style="background-color: #f9ebeb;">
					<div class="d-flex align-center justify-space-between">
						<h5 class="text-grey-darken-1">MORTALITY RATE</h5>
						<div 
							class="pa-2 rounded-lg d-flex align-center justify-center"
							style="width: 32px; height: 32px; background-color: #f5d4d7"
						>
							<v-icon size="x-small" color="#d40924">mdi-skull-outline</v-icon>
						</div>
					</div>
					<div class="mt-2 d-flex align-center ga-2">
						<h1 class="text-accent">{{ mortalitiesTodayTotal }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">deaths today</span>
					</div>
					<div class="d-flex align-center justify-space-between">
						<span class="text-grey-darken-1 text-caption">
							{{ mortalitiesThisMonthTotal }} mortalities this month
						</span>
						<v-btn
							to="/app/dashboard/mortality"
							size="x-small"
							icon="mdi-arrow-right"
							class="text-black bg-transparent"
							:disabled="!networkStore.connected"
						></v-btn>
					</div>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pt-4">
					<h5 class="text-accent">SENSOR READINGS</h5>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="6" md="4">
				<div class="px-3 pt-3 rounded-lg bg-primary border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h6 class="text-accent">TEMPERATURE</h6>
						<div 
							class="pa-1 rounded-lg d-flex align-center justify-center"
							style="width: 24px; height: 24px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon size="x-small" color="accent">mdi-thermometer</v-icon>
						</div>
					</div>
					<div class="mt-1 d-flex align-center ga-2">
						<h1 class="text-accent">{{ temperature }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">C</span>
					</div>
				</div>
			</v-col>
			<v-col cols="6" md="4">
				<div class="px-3 pt-3 rounded-lg bg-primary border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h6 class="text-accent">HUMIDITY</h6>
						<div 
							class="pa-1 rounded-lg d-flex align-center justify-center"
							style="width: 24px; height: 24px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon size="x-small" color="accent">mdi-water-percent</v-icon>
						</div>
					</div>
					<div class="mt-1 d-flex align-center ga-2">
						<h1 class="text-accent">{{ humidity }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
				</div>
			</v-col>
			<v-col cols="6" md="4">
				<div class="px-3 pt-3 rounded-lg bg-primary border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h6 class="text-accent">WATER LEVEL</h6>
						<div 
							class="pa-1 rounded-lg d-flex align-center justify-center"
							style="width: 24px; height: 24px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon size="x-small" color="accent">mdi-water-outline</v-icon>
						</div>
					</div>
					<div class="mt-1 d-flex align-center ga-2">
						<h1 class="text-accent">{{ waterLevel }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
				</div>
			</v-col>
			<v-col cols="6" md="4">
				<div class="px-3 pt-3 rounded-lg bg-primary border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h6 class="text-accent">NOISE</h6>
						<div 
							class="pa-1 rounded-lg d-flex align-center justify-center"
							style="width: 24px; height: 24px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon size="x-small" color="accent">mdi-volume-high</v-icon>
						</div>
					</div>
					<div class="mt-1 d-flex align-center ga-2">
						<h1 class="text-accent">{{ noiseLevel }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
				</div>
			</v-col>
			<v-col cols="6" md="4">
				<div class="px-3 pt-3 rounded-lg bg-primary border elevation-1">
					<div class="d-flex align-center justify-space-between">
						<h6 class="text-accent">FEED LEVEL</h6>
						<div 
							class="pa-1 rounded-lg d-flex align-center justify-center"
							style="width: 24px; height: 24px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon size="x-small" color="accent">mdi-barley</v-icon>
						</div>
					</div>
					<div class="mt-1 d-flex align-center ga-2">
						<h1 class="text-accent">{{ feedLevel }}</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import useWsEvent from "@/composables/use-ws-event"
import type { CaptureSchema } from "@/schemas/CaptureSchema"
import type { ReadingSchema } from "@/schemas/ReadingSchema"
import type { WsEventHandler } from "@/schemas/WsEventSchema"
import { useCaptureStore } from "@/stores/capture"
import { useDetectionStore } from "@/stores/detection"
import { useMortalityStore } from "@/stores/mortality"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import { groupByKey } from "@/utils/group"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Sensor Data
const wsEvent = useWsEvent()

const temperature = ref(25.9)
const humidity = ref(65)
const feedLevel = ref(70)
const waterLevel = ref(80)
const noiseLevel = ref(80)

const onWsEventReading: WsEventHandler<ReadingSchema> = data => {
	for (const { name, value } of data) {
		if (name.toLowerCase().startsWith("temperature")) temperature.value = value
		if (name.toLowerCase().startsWith("humidity")) humidity.value = value
		if (name.toLowerCase().startsWith("feed")) feedLevel.value = value
		if (name.toLowerCase().startsWith("water")) waterLevel.value = value
		if (name.toLowerCase().startsWith("noise")) noiseLevel.value = value
	}
}

const onMountedWs = async () => {
	const url = new URL(import.meta.env.VITE_API_URL)
	await Promise
		.resolve()
		.then(() => wsEvent.connect(`${url.host}/ws/app`))
		.catch(() => toastStore.error("Failed to connect realtime."))
	wsEvent.listen("Reading", "Create", onWsEventReading)
}

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const capturesByCam = computed(() => groupByKey(captures.value, (c) => c.camera))

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => groupByKey(detections.value, (d) => d.captureId))

// --- Egg Summary
const eggCountTotal = computed(() =>
	[...capturesByCam.value.values()]
		.reduce((p, c) => p + countNewDetections(c), 0)
)

const countNewDetections = (captures: CaptureSchema[]) => {
	let prev = 0, total = 0

	for (const c of captures) {
		const count = detectionsByCid.value.get(c.id)?.length || 0
		total += count - prev
		prev = count
	}

	return total
}

//

// --- Mortality
const mortalityStore = useMortalityStore()
const { today: mortalitiesToday, monthly: mortalitiesThisMonth } = storeToRefs(mortalityStore)
const mortalitiesTodayTotal = computed(() => mortalitiesToday.value.reduce((p, c) => p + c.count, 0))
const mortalitiesThisMonthTotal = computed(() => mortalitiesThisMonth.value.reduce((p, c) => p + c.count, 0))

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([
		onMountedWs(),
		captureStore.retrieve(),
		detectionStore.retrieve(),
		mortalityStore.retrieve(),
	])
}

onMounted(onMountedCb)

//
</script>

<style scoped></style>
