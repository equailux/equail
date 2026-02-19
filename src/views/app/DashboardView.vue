<template>
	<v-container class="pa-0" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<v-card color="primary" elevation="0">
					<v-card-title class="pb-0 text-subtitle-1">Today's Summary</v-card-title>
					<v-card-subtitle class="text-subtitle-2">Real-time overview of quail farm</v-card-subtitle>
					<v-card-text>
						<div class="d-flex align-center justify-space-between">
							<div class="w-50 d-flex align-center ga-2">
								<div class="h-100">
									<v-img eager width="40px" src="/icon/boiled-egg.png"></v-img>
								</div>
								<div class="h-100 w-66">
									<span>Eggs Today</span>
									<br />
									<span class="text-h5">{{ eggsToday }}</span>
								</div>
							</div>
							<div class="w-50 d-flex align-center ga-2">
								<div class="h-100">
									<v-img eager width="40px" src="/icon/light-bulb.png"></v-img>
								</div>
								<div class="h-100 w-66">
									<span>Lighting</span>
									<br />
									<v-switch
										inset
										hide-details
										color="primary"
										density="compact"
										v-model="isLightOn"
									></v-switch>
								</div>
							</div>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="6" sm="4">
				<v-card color="primary" elevation="0">
					<template #prepend>
						<v-avatar size="small" color="primary">
							<v-img eager src="/icon/thermometer.png"></v-img>
						</v-avatar>
					</template>
					<template #title>
						<span class="pb-0 text-subtitle-2">Temperature</span>
						<br />
						<span class="text-h5">{{ temperature }}°C</span>
					</template>
					<template #text>
						<div class="text-end">
							<span class="pa-1 bg-accent text-white rounded">Optimal</span>
						</div>
					</template>
				</v-card>
			</v-col>
			<v-col cols="6" sm="4">
				<v-card color="primary" elevation="0">
					<template #prepend>
						<v-avatar size="small" color="primary">
							<v-img eager src="/icon/humidity.png"></v-img>
						</v-avatar>
					</template>
					<template #title>
						<span class="pb-0 text-subtitle-2">Humidity</span>
						<br />
						<span class="text-h5">{{ humidity }}%</span>
					</template>
					<template #text>
						<div class="text-end">
							<span class="pa-1 bg-accent text-white rounded">Optimal</span>
						</div>
					</template>
				</v-card>
			</v-col>
			<v-col cols="6" sm="4">
				<v-card color="primary" elevation="0">
					<template #prepend>
						<v-avatar size="small" color="primary" class="overflow-visible">
							<v-img eager src="/icon/death.png"></v-img>
						</v-avatar>
					</template>
					<template #title>
						<span class="pb-0 text-subtitle-2">Mortality Rate</span>
						<br />
						<span class="text-h5">{{ mortalityRate }}</span>
					</template>
					<template #text>
						<div class="text-end">
							<span class="pa-1 text-white rounded"></span>
						</div>
					</template>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card color="primary" elevation="0">
					<template #prepend>
						<v-avatar size="small" color="primary" class="overflow-visible">
							<v-img eager src="/icon/feed.png"></v-img>
						</v-avatar>
					</template>
					<template #title>
						<span class="pb-0 text-subtitle-2">Feed Level</span>
					</template>
					<template #text>
						<v-slider readonly hide-details color="primary" v-model="feedLevel"></v-slider>
						<div class="px-2 d-flex align-center justify-space-between">
							<span>{{ feedLevel }}%</span>
							<div class="text-end">
								<span class="pa-1 bg-accent text-white rounded">Good</span>
							</div>
						</div>
					</template>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card color="primary" elevation="0">
					<template #prepend>
						<v-avatar size="small" color="primary" class="overflow-visible">
							<v-img eager src="/icon/sea-level.png"></v-img>
						</v-avatar>
					</template>
					<template #title>
						<span class="pb-0 text-subtitle-2">Water Level</span>
					</template>
					<template #text>
						<v-slider readonly hide-details color="primary" v-model="waterLevel"></v-slider>
						<div class="px-2 d-flex align-center justify-space-between">
							<span>{{ waterLevel }}%</span>
							<div class="text-end">
								<span class="pa-1 bg-accent text-white rounded">Good</span>
							</div>
						</div>
					</template>
				</v-card>
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
	wsEvent.connect(`${api.apiUrl}/ws/app`)
	wsEvent.listen("Reading", "Create", onWsEventReading)
}

onMounted(onMountedCb)

//
</script>

<style scoped></style>
