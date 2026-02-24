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
						:title="`${detectionsByCid.get(c.id)?.length} eggs detected`"
						:subtitle="dateComp.format(c.createdAt, `fullDateTime12h`)"
					></v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { CaptureSchema } from '@/schemas/CaptureSchema';
import { useCaptureStore } from '@/stores/capture';
import { useDetectionStore } from '@/stores/detection';
import { useToastStore } from '@/stores/toast';
import { groupByKey } from '@/utils/group';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useDate } from 'vuetify';

//

// --- Utilities
const dateComp = useDate()
const toastStore = useToastStore()

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

const onMountedCb = async () => {
	await captureStore.retrieve()
	await detectionStore.retrieve()
}

onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
