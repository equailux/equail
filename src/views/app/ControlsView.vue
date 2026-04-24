<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Manage you devices</small>
					<h3>Device Controls</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1 d-flex flex-column">
					<div class="d-flex align-center ga-3">
						<div 
							class="pa-4 rounded-lg d-flex align-center justify-center"
							style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon color="accent">mdi-lightbulb-outline</v-icon>
						</div>
						<div class="w-100">
							<div class="d-flex align-center justify-space-between">
								<h5>Coop Light</h5>
								<v-chip
									:color="isLightOn ? `accent` : `secondary`"
								>{{ isLightOn ? `On` : `Off` }}</v-chip>
							</div>
							<small 
								class="text-grey-darken-1 text-caption"
								style="line-height: 0;"
							>LED lighting control</small>
						</div>
					</div>
					<v-btn
						class="mt-4"
						prepend-icon="mdi-power"
						:text="isLightOn ? `Turn Off` : `Turn On`"
						:color="isLightOn ? `accent` : `secondary`"
						:disabled="!networkStore.connected || !bulbActuator"
						@click="isLightOn = !isLightOn"
					></v-btn>
					<span class="mt-3 text-grey-darken-1 text-caption">Idle - Standby mode</span>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { ActuatorSchema } from "@/schemas/ActuatorSchema"
import { useActuatorStore } from "@/stores/actuator"
import { useNetworkStore } from "@/stores/network"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref, watch } from "vue"

//

// --- Utilities
const networkStore = useNetworkStore()

// --- States
const isLightOn = ref(false)
const actuatorStore = useActuatorStore()
const { actuators } = storeToRefs(actuatorStore)
const bulbActuator = computed<ActuatorSchema | undefined>(() =>
	actuators.value.find((actuator) => actuator.name.toLowerCase().includes("bulb"))
)

//

const onMountedCb = async () => {
	await actuatorStore.retrieve()
	isLightOn.value = !!bulbActuator.value?.input
}

//

watch(isLightOn, async (value, previousValue) => {
	if (!bulbActuator.value || value == previousValue) return
	if (!networkStore.connected) return

	await actuatorStore.update({
		id: bulbActuator.value.id,
		input: value ? 1 : 0,
	})
})

//

onMounted(() => onMountedCb())

</script>

<style scoped></style>
