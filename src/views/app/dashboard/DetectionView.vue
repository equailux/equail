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
					<h1>{{ 0 }}</h1>
					<small class="text-grey mb-2">total eggs</small>
				</div>
				<v-list bg-color="secondary" density="compact">
					<v-list-item
						v-for="c in captures"
						:title="c.image"
						:subtitle="`${captureDetectionsMap.get(c.id)?.length} eggs detected`"
					></v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { CaptureSchema } from '@/schemas/CaptureSchema';
import type { DetectionSchema } from '@/schemas/DetectionSchema';
import { useCaptureStore } from '@/stores/capture';
import { useDetectionStore } from '@/stores/detection';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

//

// --- Utilities
const toastStr = useToastStore()

// --- Capture
const captureStr = useCaptureStore()
const { captures } = storeToRefs(captureStr)

// --- Detections
const detectionStr = useDetectionStore()
const { detections } = storeToRefs(detectionStr)

// --- Capture Detection Mapping
const captureDetectionsMap = computed(() => mapCaptures(captures.value, detections.value))

const mapCaptures = (captures: CaptureSchema[], detections: DetectionSchema[]) => {
	const captureMap = new Map<number, DetectionSchema[]>()

	for (const d of detections) {
		if (!captureMap.has(d.captureId)) captureMap.set(d.captureId, [])
		captureMap.get(d.captureId)!.push(d)
	}

	return captureMap
}

//

const onMountedCb = async () => {
	await captureStr.retrieve()
	await detectionStr.retrieve()
}

onMounted(() => onMountedCb().catch(() => toastStr.error("Something went wrong.")))

//

</script>

<style scoped></style>
