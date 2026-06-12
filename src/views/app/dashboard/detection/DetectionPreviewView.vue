<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12">
				<div class="w-100 pa-2 border rounded" style="aspect-ratio: 1">
					<ImageBoundingBoxRenderer
						v-if="captureBlob && isCaptureValid && !isCaptureValidating"
						class="w-100 h-100 d-flex align-center justify-center"
						:src="captureBlob"
						:detections="detectionsByCid"
						:mode="mode"
						v-model:selected-ids="selectedDetectionIds"
						@detection-moved="onDetectionMoved"
						@detection-drawn="onDetectionDrawn"
						@detection-resized="onDetectionResized"
					></ImageBoundingBoxRenderer>
					<div
						v-if="isCaptureValidating || !isCaptureValid"
						class="w-100 h-100 d-flex align-center justify-center"
					>
						<v-empty-state
							v-if="!isCaptureValid"
							icon="mdi-image-off"
							text="Missing or corrupted image."
						></v-empty-state>
						<v-progress-circular
							v-if="isCaptureValidating"
							indeterminate
							color="accent"
						></v-progress-circular>
					</div>
				</div>
				<div class="d-flex align-center ga-2 mt-2">
					<v-btn-toggle
						v-model="mode"
						mandatory
						divided
						color="accent"
						class="border"
					>
						<v-btn
							value="view"
							icon="mdi-eye"
							aria-label="View"
							v-tooltip="`View`"
						></v-btn>
						<v-btn
							value="select"
							icon="mdi-cursor-default"
							aria-label="Select"
							v-tooltip="`Select`"
						></v-btn>
						<v-btn
							value="drag"
							icon="mdi-gesture-tap-hold"
							aria-label="Drag"
							v-tooltip="`Drag`"
						></v-btn>
						<v-btn
							value="resize"
							icon="mdi-resize"
							aria-label="Resize"
							v-tooltip="`Resize`"
						></v-btn>
						<v-btn
							value="draw"
							icon="mdi-brush"
							aria-label="Draw"
							v-tooltip="`Draw`"
						></v-btn>
					</v-btn-toggle>
					<v-spacer></v-spacer>
					<v-btn
						size="small"
						icon="mdi-delete-outline"
						class="bg-transparent text-red"
						v-tooltip="`Delete selected boxes.`"
						:loading="isDetectionDeleting"
						:disabled="isDetectionDeleting || mode != `select` || selectedDetectionIds.length <= 0"
						@click="onClickDeleteSelectedDetections"
					></v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import ImageBoundingBoxRenderer from "@/components/app/dashboard/detection/ImageBoundingBoxRenderer.vue"
import { api } from "@/plugins/api"
import type { DetectionRawSchema } from "@/schemas/DetectionSchema"
import { useCaptureStore } from "@/stores/capture"
import { useDetectionStore } from "@/stores/detection"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

//

type BoundingBoxMode = "view" | "select" | "drag" | "resize" | "draw"
type DetectionId = DetectionRawSchema["id"]
type DetectionBox = DetectionRawSchema["box"]
type DetectionMovedPayload = { id: DetectionId, box: DetectionBox }
type DetectionResizedPayload = { id: DetectionId, box: DetectionBox }
type DetectionDrawnPayload = { box: DetectionBox }

//

// --- Utilities
const routeComp = useRoute()
const toastStore = useToastStore()

// --- Params
const captureId = Number(routeComp.params.cid)

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const capture = computed(() => captures.value.find((c) => c.id == captureId))

const captureBlob = ref<Blob>()
const isCaptureValid = ref(true)
const isCaptureValidating = ref(true)

const fetchCaptureImage = async () => {
	if (!capture.value) return
	isCaptureValidating.value = true

	const { res, err } = await api
		.get(`/api/capture/image/${capture.value.image}`, { responseType: "blob" })
		.then((res) => ({ res, err: undefined }))
		.catch((err) => ({ res: undefined, err }))

	if (err) isCaptureValid.value = false
	if (err) return isCaptureValidating.value = false

	captureBlob.value = res!.data as Blob
	isCaptureValid.value = true
	isCaptureValidating.value = false
}

//

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => detections.value.filter((d) => d.captureId == captureId))

const mode = ref<BoundingBoxMode>("view")
const selectedDetectionIds = ref<DetectionId[]>([])
const isDetectionDeleting = ref(false)

const onDetectionMoved = async ({ id, box }: DetectionMovedPayload) => {
	await detectionStore
		.update({ id, box })
		.catch(() => toastStore.error("Unable to move detection."))
	await detectionStore.retrieve()
}

const onDetectionResized = async ({ id, box }: DetectionResizedPayload) => {
	await detectionStore
		.update({ id, box })
		.catch(() => toastStore.error("Unable to resize detection."))
	await detectionStore.retrieve()
}

const onDetectionDrawn = async ({ box }: DetectionDrawnPayload) => {
	await detectionStore
		.create({ box, class: "egg", confidence: 1, captureId })
		.catch(() => toastStore.error("Unable to create detection."))
}

const onClickDeleteSelectedDetections = async () => {
	if (mode.value != "select" || selectedDetectionIds.value.length <= 0) return
	isDetectionDeleting.value = true

	const promises = selectedDetectionIds.value.map(id => detectionStore.destroy(id))
	await Promise
		.all(promises)
		.then(() => toastStore.info("Selected detections deleted successfully."))
		.catch(() => toastStore.error("Unable to delete selected detections."))

	selectedDetectionIds.value = []
	isDetectionDeleting.value = false
}

//

const onMountedCb = async () => {
	await Promise.all([captureStore.retrieve(), detectionStore.retrieve()])
	await nextTick()
	await fetchCaptureImage()
}

watch(mode, () => selectedDetectionIds.value = [])
onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
