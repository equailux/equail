<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4">
					<small class="text-accent">Manage your automation</small>
					<h3>Automation</h3>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<v-sheet color="transparent" class="pb-4 d-flex justify-end">
					<v-btn
						icon="mdi-plus"
						class="bg-transparent"
						:disabled="!networkStore.connected || !canCreate"
						@click="onClickCreate"
					></v-btn>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-tabs
					grow
					color="accent"
					bg-color="primary"
					slider-color="accent"
					class="mb-4 rounded-lg elevation-1"
					v-model="tab"
				>
					<v-tab value="threshold">Threshold</v-tab>
					<v-tab value="condition">Condition</v-tab>
					<v-tab value="action">Action</v-tab>
				</v-tabs>
			</v-col>
		</v-row>
		<v-window class="bg-secondary" v-model="tab">
			<v-window-item value="threshold">
				<ThresholdSection ref="thresholdSection"></ThresholdSection>
			</v-window-item>
			<v-window-item value="condition">
				<ConditionSection ref="conditionSection"></ConditionSection>
			</v-window-item>
			<v-window-item value="action">
				<ActionSection ref="actionSection"></ActionSection>
			</v-window-item>
		</v-window>
	</v-container>
</template>

<script setup lang="ts">
import ActionSection from "@/components/app/config/ActionSection.vue"
import ConditionSection from "@/components/app/config/ConditionSection.vue"
import ThresholdSection from "@/components/app/config/ThresholdSection.vue"
import useWsEvent from "@/composables/use-ws-event"
import type { ActionSchema } from "@/schemas/ActionSchema"
import type { ActuatorSchema } from "@/schemas/ActuatorSchema"
import type { ConditionSchema } from "@/schemas/ConditionSchema"
import type { ThresholdSchema } from "@/schemas/ThresholdSchema"
import type { WsEventHandler } from "@/schemas/WsEventSchema"
import { useActionStore } from "@/stores/action"
import { useActuatorStore } from "@/stores/actuator"
import { useConditionStore } from "@/stores/condition"
import { useNetworkStore } from "@/stores/network"
import { useSensorStore } from "@/stores/sensor"
import { useThresholdStore } from "@/stores/threshold"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

//

const TABS = ["threshold", "condition", "action"] as const

type AutomationTab = (typeof TABS)[number]

const isTab = (value: unknown): value is AutomationTab => TABS.includes(value as AutomationTab)

// --- Utilities
const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Automation
const sensorStore = useSensorStore()
const actuatorStore = useActuatorStore()
const thresholdStore = useThresholdStore()
const conditionStore = useConditionStore()
const actionStore = useActionStore()
const { sensors } = storeToRefs(sensorStore)
const { actuators } = storeToRefs(actuatorStore)
const { thresholds } = storeToRefs(thresholdStore)
const { conditions } = storeToRefs(conditionStore)
const { actions } = storeToRefs(actionStore)
const wsEvent = useWsEvent()

// --- Tabs
const tab = ref<AutomationTab>(isTab(route.params.tab) ? route.params.tab : "threshold")
const thresholdSection = ref<InstanceType<typeof ThresholdSection>>()
const conditionSection = ref<InstanceType<typeof ConditionSection>>()
const actionSection = ref<InstanceType<typeof ActionSection>>()

const canCreate = computed(() => {
	if (tab.value == "condition") return !!thresholds.value.length
	if (tab.value == "action") return !!thresholds.value.length && !!actuators.value.length
	return !!sensors.value.length
})

// --- Automation Actions
const onClickCreate = () => {
	if (tab.value == "condition") return conditionSection.value?.openCreate()
	if (tab.value == "action") return actionSection.value?.openCreate()
	return thresholdSection.value?.openCreate()
}

watch(tab, value => router.replace(`/app/config/automation/${value}`))
watch(
	() => route.params.tab,
	value => { if (isTab(value)) tab.value = value }
)

//

const syncById = <T extends { id: number }>(items: T[], updated: T) => {
	const index = items.findIndex(item => item.id == updated.id)
	if (index == -1) return
	items.splice(index, 1, updated)
}

const onWsEventActuator: WsEventHandler<ActuatorSchema> = data => {
	for (const actuator of data) syncById(actuators.value, actuator)
}

const onWsEventThreshold: WsEventHandler<ThresholdSchema> = data => {
	for (const threshold of data) syncById(thresholds.value, threshold)
}

const onWsEventCondition: WsEventHandler<ConditionSchema> = data => {
	for (const condition of data) syncById(conditions.value, condition)
}

const onWsEventAction: WsEventHandler<ActionSchema> = data => {
	for (const action of data) syncById(actions.value, action)
}

const onError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onMountedWs = async () => {
	const url = new URL(import.meta.env.VITE_API_URL)
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
	url.pathname = "/ws/app"

	await Promise
		.resolve()
		.then(() => wsEvent.connect(url.toString()))
		.catch(() => toastStore.error("Failed to connect realtime."))
	wsEvent.listen("Actuator", "Update", onWsEventActuator)
	wsEvent.listen("Threshold", "Update", onWsEventThreshold)
	wsEvent.listen("Condition", "Update", onWsEventCondition)
	wsEvent.listen("Action", "Update", onWsEventAction)
}

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await Promise.all([
		onMountedWs(),
		sensorStore.retrieve(),
		actuatorStore.retrieve(),
		thresholdStore.retrieve(),
		conditionStore.retrieve(),
		actionStore.retrieve(),
	])
}

const onUnmountedCb = () => {
	wsEvent.disconnect()
}

onMounted(() => onMountedCb().catch(onError))
onUnmounted(onUnmountedCb)

//
</script>

<style scoped>
/* Match the sentence-case typography used across the app instead of the v-btn default. */
:deep(.v-tab) {
	text-transform: none;
	letter-spacing: normal;
}
</style>
