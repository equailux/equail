<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<v-row dense align="center">
					<v-col cols="6">
						<div class="pb-4">
							<small class="text-accent">Validate findings</small>
							<h3>Detections</h3>
						</div>
					</v-col>
					<v-col cols="6">
						<v-sheet color="transparent" class="pb-4 ga-1 d-flex align-center justify-end">
							<v-date-input
								hide-details
								label="Date"
								prepend-icon=""
								append-inner-icon="mdi-calendar"
								:model-value="date"
								@update:model-value="onUpdateDate"
							></v-date-input>
							<v-btn
								icon
								class="bg-transparent"
								:color="hideEmpty ? `accent` : undefined"
								@click="onClickToggleHideEmpty"
							>
								<v-icon>{{ hideEmpty ? "mdi-filter-check" : "mdi-filter-outline" }}</v-icon>
								<v-tooltip activator="parent" location="bottom">
									{{ hideEmpty ? "Showing detections only" : "Show detections only" }}
								</v-tooltip>
							</v-btn>
						</v-sheet>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="w-100 pb-2 ga-2 border-b d-flex align-end">
					<h1>{{ eggCountTotal }}</h1>
					<small class="text-grey mb-2">total eggs</small>
				</div>
				<v-list v-if="!visibleCaptures.length" bg-color="secondary" density="compact">
					<v-list-item>
						<template #title>
							<small class="text-grey">{{ emptyText }}</small>
						</template>
					</v-list-item>
				</v-list>
				<v-list bg-color="secondary" density="compact">
					<v-list-item
						v-for="c in visibleCaptures"
						nav
						link
						append-icon="mdi-chevron-right"
						:to="`/app/dashboard/detection/${c.id}`"
						:subtitle="dateComp.format(c.createdAt, `fullDateTime12h`)"
					>
						<template #title>
							{{ `${countDetections(c)} eggs detected` }}
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
import { computed, onMounted, ref } from "vue"
import { useDate } from "vuetify"

//

// --- Utilities
const dateComp = useDate()
const toastStore = useToastStore()

// --- Filter
const date = ref<Date>(new Date())
const hideEmpty = ref(false)

const onUpdateDate = (value: Date | string | null) => {
	if (!value) return
	date.value = new Date(value)
}

const onClickToggleHideEmpty = () => hideEmpty.value = !hideEmpty.value

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const filteredCaptures = computed(() => captures.value.filter(c => isSameDay(c.createdAt, date.value)))
const latestCapture = computed(() => getLatestCapture(filteredCaptures.value))

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const eggDetections = computed(() => detections.value.filter(d => d.class.toLowerCase().includes("egg")))
const detectionsByCid = computed(() => groupByKey(eggDetections.value, d => d.captureId))
const countDetections = (capture: CaptureSchema) => detectionsByCid.value.get(capture.id)?.length || 0

// --- Visible Captures
const visibleCaptures = computed(() => {
	if (!hideEmpty.value) return filteredCaptures.value
	return filteredCaptures.value.filter(c => countDetections(c) > 0)
})

const emptyText = computed(() => {
	if (hideEmpty.value && filteredCaptures.value.length) return "No captures with detected eggs for the selected date."
	return "No detections for the selected date."
})

// --- Collection
const collectionStore = useCollectionStore()
const { collections } = storeToRefs(collectionStore)
const filteredCollections = computed(() => collections.value.filter(c => isSameDay(c.collectAt, date.value)))
const collectionsTotal = computed(() => filteredCollections.value.reduce((p, c) => p + c.count, 0))

// --- Egg Summary
const latestCaptureEggCount = computed(() => {
	if (!latestCapture.value) return 0
	return countDetections(latestCapture.value)
})
const eggCountTotal = computed(() => latestCaptureEggCount.value + collectionsTotal.value)

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
