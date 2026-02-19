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
						<h1>47</h1>
						<span class="text-grey-lighten-2 text-subtitle-2">today</span>
					</div>
					<span class="text-grey-lighten-1 text-caption">+12% from yesterday</span>
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
						<h1 class="text-accent">1.2</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
					<span class="text-grey-darken-1 text-caption">2 quails this week</span>
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
						<h1 class="text-accent">28.5</h1>
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
						<h1 class="text-accent">65</h1>
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
						<h1 class="text-accent">78</h1>
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
						<h1 class="text-accent">54</h1>
						<span class="text-grey-darken-2 text-subtitle-2">%</span>
					</div>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pt-4">
					<h5 class="text-accent">QUICK CONTROL</h5>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<div class="pa-4 border rounded-lg d-flex align-center justify-space-between elevation-1">
					<div class="d-flex ga-2">
						<div 
							class="d-flex align-center justify-center bg-accent rounded-lg"
							style="width: 36px; height: 36px;"
						>
							<v-icon size="small">mdi-lightbulb-outline</v-icon>
						</div>
						<div class="d-flex flex-column">
							<span class="text-subtitle-2">Coop Light</span>
							<small class="text-caption text-grey mt-n1">Currently on</small>
						</div>
					</div>
					<v-switch
						inset
						hide-details
						color="accent"
						base-color="accent"
					></v-switch>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import useWsEvent from "@/composables/use-ws-event"
import type { ReadingSchema } from "@/schemas/ReadingSchema"
import type { WsEventHandler } from "@/schemas/WsEventSchema"
import { useApiStore } from "@/stores/api"
import { onMounted, ref } from "vue"

//

// --- Stats
const eggsToday = ref(15)
const isLightOn = ref(false)
const mortalityRate = ref(10)

// --- Sensor Data
const api = useApiStore()
const wsEvent = useWsEvent()

const temperature = ref(25.9)
const humidity = ref(65)
const feedLevel = ref(70)
const waterLevel = ref(80)

const onWsEventReading: WsEventHandler<ReadingSchema> = data => {
	for (const { name, value } of data) {
		if (name.toLowerCase().startsWith("temperature")) temperature.value = value
		if (name.toLowerCase().startsWith("humidity")) humidity.value = value
		if (name.toLowerCase().startsWith("feed")) feedLevel.value = value
		if (name.toLowerCase().startsWith("water")) waterLevel.value = value
	}
}

//

const onMountedCb = async () => {
	await Promise
		.resolve()
		.then(() => wsEvent.connect(`${api.apiUrl}/ws/app`))
		.catch(console.error)
	wsEvent.listen("Reading", "Create", onWsEventReading)
}

onMounted(onMountedCb)

//
</script>

<style scoped></style>
