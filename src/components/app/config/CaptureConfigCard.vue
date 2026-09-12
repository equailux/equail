<template>
	<v-card class="h-100 bg-primary" rounded="lg" elevation="1">
		<v-card-text class="d-flex flex-column ga-3">
			<v-sheet
				color="transparent"
				class="d-flex align-start ga-3"
			>
				<v-sheet
					class="pa-4 rounded-lg d-flex align-center justify-center"
					color="accent-lighten-5"
				>
					<v-icon color="accent">mdi-camera-timer</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>Camera Configuration</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', config)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">Singleton Capture Config</small>
				</v-sheet>
			</v-sheet>
			<v-divider></v-divider>
			<v-sheet color="transparent" class="d-flex flex-column ga-2">
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-timer-outline</v-icon>
						<small class="text-grey-darken-1">Interval</small>
					</div>
					<span class="text-body-2 font-weight-bold">{{ interval }}</span>
				</div>
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-clock-outline</v-icon>
						<small class="text-grey-darken-1">Raw</small>
					</div>
					<span class="text-body-2 font-weight-bold">{{ config.intervalMs }} ms</span>
				</div>
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-repeat</v-icon>
						<small class="text-grey-darken-1">Scheduled</small>
					</div>
					<v-chip
						size="small"
						variant="tonal"
						:color="config.enabled ? 'accent' : 'orange'"
					>
						{{ config.enabled ? "Enabled" : "Disabled" }}
					</v-chip>
				</div>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { CaptureConfigSchema } from "@/schemas/CaptureConfigSchema"
import { computed } from "vue"

//

const props = defineProps<{
	config: CaptureConfigSchema
}>()

const emit = defineEmits<{
	edit: [config: CaptureConfigSchema]
}>()

//

const interval = computed(() => {
	const seconds = Math.round(props.config.intervalMs / 1000)
	if (seconds < 60) return `${seconds} sec`

	const minutes = Math.floor(seconds / 60)
	const rest = seconds % 60
	if (minutes < 60) return rest ? `${minutes} min ${rest} sec` : `${minutes} min`

	const hours = Math.floor(minutes / 60)
	const mrest = minutes % 60
	return mrest ? `${hours} hr ${mrest} min` : `${hours} hr`
})

//
</script>
