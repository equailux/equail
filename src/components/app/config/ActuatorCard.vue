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
					<v-icon color="accent">mdi-toggle-switch-outline</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>{{ actuator.name }}</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-clipboard-outline"
								class="bg-transparent"
								@click="emit('copy', actuator)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', actuator)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-delete-outline"
								class="bg-transparent"
								color="error"
								@click="emit('delete', actuator)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">{{ actuator.tag }}</small>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Input</small>
					<span class="text-body-2">{{ actuator.input }}</span>
				</v-sheet>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Updated At</small>
					<span class="text-body-2">{{ dateCmp.format(new Date(actuator.updatedAt), "fullDateTime12") }}</span>
				</v-sheet>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { ActuatorSchema } from "@/schemas/ActuatorSchema"
import { useDate } from "vuetify"

//

defineProps<{
	actuator: ActuatorSchema
}>()

const emit = defineEmits<{
	copy: [actuator: ActuatorSchema]
	edit: [actuator: ActuatorSchema]
	delete: [actuator: ActuatorSchema]
}>()

const dateCmp = useDate()

//
</script>
