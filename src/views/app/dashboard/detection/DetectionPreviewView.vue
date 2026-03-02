<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="w-100 pa-2 border rounded" style="aspect-ratio: 1">
					<ImageBoundingBoxRenderer
						v-if="capture"
						class="w-100 h-100 d-flex align-center justify-center"
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
			<v-col cols="12" sm="6">
				<div class="d-flex align-center">
					<span>Approval: &nbsp;</span>
					<v-chip
						:color="approved === undefined ? `yellow` : approved ? `accent` : `red`"
					>{{ approved === undefined ? "Pending" : approved ? "Correct" : "Incorrect" }}</v-chip>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
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
	comment.value = remarkByCid.value?.comment || ""
	approved.value = remarkByCid.value?.approved
	remarkLoading.value = false
}

onMounted(() => onMountedCb())//.catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
