<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="pa-2 border rounded" style="aspect-ratio: 1">
					<ImageBoundingBoxRenderer
						v-if="capture"
						class="d-flex align-center justify-center"
						:src="`${apiStore.proxyUrl}/img/${capture.image}`"
						:detections="detectionsByCid"
					></ImageBoundingBoxRenderer>
					<div v-else class="w-100 h-100 d-flex align-center justify-center">
						<v-progress-circular
							indeterminate
							color="accent"
						></v-progress-circular>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import ImageBoundingBoxRenderer from '@/components/app/dashboard/detection/ImageBoundingBoxRenderer.vue';
import { useApiStore } from '@/stores/api';
import { useCaptureStore } from '@/stores/capture';
import { useDetectionStore } from '@/stores/detection';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

//

// --- Utilities
const routeComp = useRoute()
const apiStore = useApiStore()
const toastStore = useToastStore()

// --- Params
const captureId = Number(routeComp.params.cid)

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const capture = computed(() => captures.value.find((c) => c.id == captureId))
const captureBlob = ref<Blob>()

const fetchImageBlob = async () => {
	const url = `${apiStore.proxyUrl}/img/${capture.value?.image}`
	const headers = { "Authorization": `Bearer ${apiStore.token}` }
	const res = await fetch(url, { headers })
	if (!res.ok) return toastStore.error(`Failed to fetch image.`)
	captureBlob.value = await res.blob()
}

watch(capture, fetchImageBlob)

//

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => detections.value.filter((d) => d.captureId == captureId))


//

const onMountedCb = async () => {
	while (!apiStore.token) await new Promise(res => setTimeout(res, 50))
	await Promise.all([captureStore.retrieve(), detectionStore.retrieve()])
}

onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
