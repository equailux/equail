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
					<v-icon color="accent">mdi-camera-outline</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<h5>Manual Capture</h5>
					<small class="text-grey-darken-1 text-caption">
						Asks every camera host to capture now
					</small>
				</v-sheet>
			</v-sheet>
			<v-divider></v-divider>
			<v-sheet color="transparent" class="d-flex flex-column ga-2">
				<small class="text-grey-darken-1 text-caption">
					The capture runs on the camera host, then uploads with its detections. It may
					take a few seconds before it shows up under detections.
				</small>
				<v-btn
					block
					color="accent"
					variant="tonal"
					prepend-icon="mdi-camera-iris"
					:disabled="disabled || capturing"
					:loading="capturing"
					@click="emit('capture')"
				>
					Capture Now
				</v-btn>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
//

withDefaults(
	defineProps<{
		disabled?: boolean
		capturing?: boolean
	}>(),
	{ disabled: false, capturing: false }
)

const emit = defineEmits<{
	capture: []
}>()

//
</script>
