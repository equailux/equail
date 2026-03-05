<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="w-100 pa-2 border rounded" style="aspect-ratio: 1">
					<ImageBoundingBoxRenderer
						v-if="captureBlob && isCaptureValid && !isCaptureValidating"
						class="w-100 h-100 d-flex align-center justify-center"
						:src="captureBlob"
						:detections="detectionsByCid"
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
			</v-col>
			<v-col cols="12" sm="6">
				<div class="d-flex align-center">
					<span>Approval: &nbsp;</span>
					<v-chip
						:text="approved === undefined ? `Pending` : approved ? `Correct` : `Incorrect`"
						:color="approved === undefined ? `yellow` : approved ? `accent` : `red`"
					></v-chip>
					<v-spacer></v-spacer>
					<v-btn
						size="small"
						icon="mdi-delete-outline"
						class="bg-transparent text-red"
						v-tooltip="`Delete missing or invalid image.`"
						:loading="isCaptureDeleting"
						:disabled="isCaptureDeleting"
						@click="onClickDeleteImage"
					></v-btn>
				</div>
				<v-textarea
					hide-details
					class="w-100 mt-2"
					placeholder="Describe your findings here."
					v-model="comment"
					:loading="remarkLoading"
					:disabled="remarkLoading"
					@blur="onChangeRemark(comment, approved)"
				></v-textarea>
				<div class="d-flex align-center ga-2 mt-2">
					<v-btn
						text="Incorrect"
						class="bg-secondary border flex-grow-1"
						prepend-icon="mdi-close"
						:loading="remarkLoading"
						:disabled="remarkLoading"
						@click="onChangeRemark(comment, false)"
					></v-btn>
					<v-btn
						text="Correct"
						class="bg-accent flex-grow-1"
						prepend-icon="mdi-check-all"
						:loading="remarkLoading"
						:disabled="remarkLoading"
						@click="onChangeRemark(comment, true)"
					></v-btn>
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
import { useRemarkStore } from '@/stores/remark';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

//

// --- Utilities
const apiStore = useApiStore()
const routeComp = useRoute()
const toastStore = useToastStore()
const routerComp = useRouter()

// --- Params
const captureId = Number(routeComp.params.cid)

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const capture = computed(() => captures.value.find((c) => c.id == captureId))

const captureBlob = ref<Blob>()
const isCaptureValid = ref(true)
const isCaptureDeleting = ref(false)
const isCaptureValidating = ref(true)

const fetchCaptureImage = async () => {
	if (!capture.value) return
	isCaptureValidating.value = true

	const url = `${apiStore.proxyUrl}/api/capture/image/${capture.value.image}`
	const headers = { "Authorization": `Bearer ${apiStore.token}` }
	const res = await fetch(url, { headers })

	if (!res.ok) isCaptureValid.value = false
	if (!res.ok) return isCaptureValidating.value = false
	
	captureBlob.value = await res.blob()
	isCaptureValid.value = true
	isCaptureValidating.value = false
}

const onClickDeleteImage = async () => {
	if (!capture.value) return
	isCaptureDeleting.value = true
	await captureStore.destroy(capture.value)
	await routerComp.push("/app/dashboard/detection")
	toastStore.info("Invalid image deleted successfully.")
	isCaptureDeleting.value = false
}

//

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => detections.value.filter((d) => d.captureId == captureId))

//

// --- Remarks
const remarkStore = useRemarkStore()
const { remarks } = storeToRefs(remarkStore)
const remarkByCid = computed(() => remarks.value.find((r) => r.captureId == captureId))

const comment = ref("")
const approved = ref<boolean>()
const remarkLoading = ref(false)

const onChangeRemark = async (comment: string, correct?: boolean) => {
	remarkLoading.value = true
	await remarkStore.create(captureId, { comment, approved: correct })
	approved.value = correct
	remarkLoading.value = false
}

//

const onMountedCb = async () => {
	remarkLoading.value = true

	while (!apiStore.token) await new Promise(res => setTimeout(res, 50))
	await Promise.all([captureStore.retrieve(), detectionStore.retrieve(), remarkStore.retrieve()])
	await nextTick()
	await fetchCaptureImage()

	comment.value = remarkByCid.value?.comment || ""
	approved.value = remarkByCid.value?.approved
	remarkLoading.value = false
}

onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
