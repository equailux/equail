<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<div class="pb-4">
					<small class="text-accent">Manage you sensors</small>
					<h3>Sensor Management</h3>
				</div>
			</v-col>
            <v-col cols="6">
				<div class="pb-4 d-flex justify-end">
					<v-btn 
						icon="mdi-plus"
						class="bg-transparent"
					></v-btn>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col 
				v-for="sensor in sensors"
				cols="12" 
				sm="6"
				:key="sensor.id"
			>
				<div class="pa-4 rounded-lg bg-primary border elevation-1 d-flex flex-column">
					<div class="d-flex align-center ga-3">
						<div 
							class="pa-4 rounded-lg d-flex align-center justify-center"
							style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon color="accent">mdi-sine-wave</v-icon>
						</div>
						<div class="w-100">
							<div class="d-flex align-center justify-space-between">
								<h5>{{ sensor?.name }}</h5>
								<v-btn
									size="small"
									icon="mdi-clipboard-outline"
									class="bg-transparent"
									@click="onClickCopy(sensor?.tag)"
								></v-btn>
							</div>
							<small 
								class="text-grey-darken-1 text-caption"
								style="line-height: 0;"
								v-text="sensor?.tag"
							></small>
						</div>
					</div>
					<span class="mt-3 text-grey-darken-1 text-caption">
						{{ dateCmp.format(new Date(sensor?.lastread), "fullDateTime12") }}
					</span>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { useNetworkStore } from "@/stores/network";
import { useSensorStore } from "@/stores/sensor";
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue"
import { useDate } from "vuetify";

//

// --- Utilities
const dateCmp = useDate()
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Sensor
const sensorStore = useSensorStore()
const { sensors } = storeToRefs(sensorStore)

const onClickCopy = async (text: string) => {
	await navigator.clipboard
		.writeText(text)
		.then(() => toastStore.info(`"${text}" tag copied to clipboard`))
		.catch(e => toastStore.error(e?.message || "Failed to copy to clipboard."))
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([sensorStore.retrieve()])
}

onMounted(onMountedCb)

//

</script>

<style scoped></style>
