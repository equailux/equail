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
					<v-icon color="accent">mdi-sine-wave</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>{{ sensor.name }}</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-clipboard-outline"
								class="bg-transparent"
								@click="emit('copy', sensor)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', sensor)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-delete-outline"
								class="bg-transparent"
								color="error"
								@click="emit('delete', sensor)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">{{ sensor.tag }}</small>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Interval</small>
					<span class="text-body-2">{{ sensor.interval }} second(s)</span>
				</v-sheet>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Last Read</small>
					<span class="text-body-2">{{ dateCmp.format(new Date(sensor.lastread), "fullDateTime12") }}</span>
				</v-sheet>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { SensorSchema } from "@/schemas/SensorSchema"
import { useDate } from "vuetify"

//

defineProps<{
	sensor: SensorSchema
}>()

const emit = defineEmits<{
	copy: [sensor: SensorSchema]
	edit: [sensor: SensorSchema]
	delete: [sensor: SensorSchema]
}>()

const dateCmp = useDate()

//
</script>
