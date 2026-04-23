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
					<v-icon color="accent">{{ threshold.icon }}</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>{{ threshold.name }}</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', threshold)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-delete-outline"
								class="bg-transparent"
								color="error"
								@click="emit('delete', threshold)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">{{ threshold.message }}</small>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Sensor</small>
					<span class="text-body-2">{{ sensorName }}</span>
				</v-sheet>
				<v-chip
					size="small"
					:color="threshold.activated ? 'accent' : 'grey'"
					variant="flat"
				>{{ threshold.activated ? "Active" : "Inactive" }}</v-chip>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Operator</small>
					<span class="text-body-2">{{ threshold.operator }}</span>
				</v-sheet>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Updated At</small>
					<span class="text-body-2">{{ dateCmp.format(new Date(threshold.updatedAt), "fullDateTime12") }}</span>
				</v-sheet>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { ThresholdSchema } from "@/schemas/ThresholdSchema"
import { useDate } from "vuetify"

//

defineProps<{
	threshold: ThresholdSchema
	sensorName: string
}>()

const emit = defineEmits<{
	edit: [threshold: ThresholdSchema]
	delete: [threshold: ThresholdSchema]
}>()

const dateCmp = useDate()

//
</script>
