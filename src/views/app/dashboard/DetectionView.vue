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
						v-for="c in capturesSortedByRemarks"
						nav
						link
						append-icon="mdi-chevron-right"
						:to="`/app/dashboard/detection/${c.id}`"
						:subtitle="dateComp.format(c.createdAt, `fullDateTime12h`)"
					>
						<template #title>
							<span v-if="remarksByCid.get(c.id)?.[0]?.approved === undefined" class="text-yellow">
								{{ `${detectionsByCid.get(c.id)?.length || 0} eggs detected` }}
							</span>
							<span v-if="remarksByCid.get(c.id)?.[0]?.approved === true" class="text-accent">
								{{ `${detectionsByCid.get(c.id)?.length || 0} eggs detected` }}
							</span>
							<span v-if="remarksByCid.get(c.id)?.[0]?.approved === false" class="text-red">
								{{ `${detectionsByCid.get(c.id)?.length || 0} eggs detected` }}
							</span>
						</template>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { CaptureSchema } from '@/schemas/CaptureSchema';
import { useCaptureStore } from '@/stores/capture';
import { useDetectionStore } from '@/stores/detection';
import { useRemarkStore } from '@/stores/remark';
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
const capturesSortedByRemarks = computed(() => sortCaptureByRemarks())

const sortCaptureByRemarks = () => {
	const sortable = [...captures.value]
	const rmap = remarksByCid.value

	const sort = (a: CaptureSchema, b: CaptureSchema) => {
		const bval = Number(rmap.has(b.id) ? (rmap.get(b.id)![0]?.approved ? 1 : 0) : 0)
		const aval = Number(rmap.has(a.id) ? (rmap.get(a.id)![0]?.approved ? 1 : 0) : 0)
		return bval - aval
	}

	return sortable.sort(sort)
}

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => groupByKey(detections.value, (d) => d.captureId))

// --- Remarks
const remarkStore = useRemarkStore()
const { remarks } = storeToRefs(remarkStore)
const remarksByCid = computed(() => groupByKey(remarks.value, (r) => r.captureId))

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
	await Promise.all([captureStore.retrieve(), detectionStore.retrieve(), remarkStore.retrieve()])
}

onMounted(() => onMountedCb().catch(() => toastStore.error("Something went wrong.")))

//

</script>

<style scoped></style>
