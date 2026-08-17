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
					<v-icon color="accent">mdi-gesture-tap-button</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<h5>Manual Control</h5>
					<small class="text-grey-darken-1 text-caption">Nudges the motor by {{ durationMs }} ms</small>
				</v-sheet>
			</v-sheet>
			<v-divider></v-divider>
			<v-sheet color="transparent" class="d-flex ga-2">
				<v-btn
					class="flex-grow-1"
					color="accent"
					variant="tonal"
					prepend-icon="mdi-arrow-left-bold-outline"
					:disabled="disabled || !!moving"
					:loading="moving == 'Backward'"
					@click="emit('move', { direction: 'Backward', durationMs })"
				>
					Backward
				</v-btn>
				<v-btn
					class="flex-grow-1"
					color="accent"
					variant="tonal"
					append-icon="mdi-arrow-right-bold-outline"
					:disabled="disabled || !!moving"
					:loading="moving == 'Forward'"
					@click="emit('move', { direction: 'Forward', durationMs })"
				>
					Forward
				</v-btn>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { FeedManualSchema } from "@/schemas/FeedSchema"

//

withDefaults(
	defineProps<{
		disabled?: boolean
		durationMs?: number
		moving?: FeedManualSchema["direction"] | null
	}>(),
	{ disabled: false, durationMs: 300, moving: null }
)

const emit = defineEmits<{
	move: [command: FeedManualSchema]
}>()

//
</script>
