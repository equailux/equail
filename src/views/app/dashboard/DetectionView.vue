<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="pb-4">
					<small class="text-accent">Validate findings</small>
					<h3>Detections</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="w-100 pb-2 ga-2 border-b d-flex align-end">
					<h1>{{ eggCountTotal }}</h1>
					<small class="text-grey mb-2">total eggs</small>
				</div>
				<v-list bg-color="secondary" density="compact">
					<v-list-item
						v-for="c in captures"
						nav
						link
						append-icon="mdi-chevron-right"
						:to="`/app/dashboard/detection/${c.id}`"
						:subtitle="dateComp.format(c.createdAt, `fullDateTime12h`)"
					>
						<template #title>
							{{ `${detectionsByCid.get(c.id)?.length || 0} eggs detected` }}
						</template>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { CaptureSchema } from "@/schemas/CaptureSchema"
import { useCaptureStore } from "@/stores/capture"
import { useCollectionStore } from "@/stores/collection"
import { useDetectionStore } from "@/stores/detection"
import { useToastStore } from "@/stores/toast"
import { groupByKey } from "@/utils/group"
import { isSameDay } from "date-fns"
import { storeToRefs } from "pinia"
import { computed, onMounted } from "vue"
import { useDate } from "vuetify"

//

// --- Utilities
const dateComp = useDate()
const toastStore = useToastStore()

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const todayCaptures = computed(() => captures.value.filter(c => isSameDay(c.createdAt, new Date())))
const latestCapture = computed(() => getLatestCapture(todayCaptures.value))

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const eggDetections = computed(() => detections.value.filter(d => d.class.toLowerCase().includes("egg")))
const detectionsByCid = computed(() => groupByKey(eggDetections.value, d => d.captureId))

// --- Collection
const collectionStore = useCollectionStore()
const { today: collectionsToday } = storeToRefs(collectionStore)
const collectionsTodayTotal = computed(() => collectionsToday.value.reduce((p, c) => p + c.count, 0))

// --- Egg Summary
const latestCaptureEggCount = computed(() => {
	if (!latestCapture.value) return 0
	return detectionsByCid.value.get(latestCapture.value.id)?.length || 0
})
const eggCountTotal = computed(() => latestCaptureEggCount.value + collectionsTodayTotal.value)

const getLatestCapture = (data: CaptureSchema[]) => {
	return [...data].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
}

//

const onMountedCb = async () => {
	await Promise.all([captureStore.retrieve(), detectionStore.retrieve(), collectionStore.retrieve()])
}

onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>
