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
					<v-icon color="accent">mdi-cog-sync-outline</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>Feed Configuration</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', config)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">Singleton Device Config</small>
				</v-sheet>
			</v-sheet>
			<v-divider></v-divider>
			<v-sheet color="transparent" class="d-flex flex-column ga-2">
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-robot-industrial</v-icon>
						<small class="text-grey-darken-1">Servo 1</small>
					</div>
					<span class="text-body-2 font-weight-bold">{{ config.servo1Ms }} ms</span>
				</div>
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-robot-industrial</v-icon>
						<small class="text-grey-darken-1">Servo 2</small>
					</div>
					<span class="text-body-2 font-weight-bold">{{ config.servo2Ms }} ms</span>
				</div>
				<div class="d-flex justify-space-between align-center">
					<div class="d-flex align-center ga-2">
						<v-icon size="small" color="grey-darken-1">mdi-engine-outline</v-icon>
						<small class="text-grey-darken-1">Stepper</small>
					</div>
					<span class="text-body-2 font-weight-bold">{{ config.stepperMs }} ms</span>
				</div>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { FeedConfigSchema } from "@/schemas/FeedConfigSchema"

//

defineProps<{
	config: FeedConfigSchema
}>()

const emit = defineEmits<{
	edit: [config: FeedConfigSchema]
}>()

//
</script>
