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
						v-for="capture in captures"
						:title="capture.image"
					></v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { useCaptureStore } from '@/stores/capture';
import { useToastStore } from '@/stores/toast';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

//

// --- Utilities
const toastStr = useToastStore()

// --- Capture
const captureStr = useCaptureStore()
const { captures } = storeToRefs(captureStr)

//

const onMountedCb = async () => {
	await captureStr.retrieve()
}

onMounted(() => onMountedCb().catch(() => toastStr.error("Something went wrong.")))

//

</script>

<style scoped></style>
