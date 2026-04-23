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
					<v-icon color="accent">mdi-lightning-bolt-outline</v-icon>
				</v-sheet>
				<v-sheet color="transparent" class="flex-grow-1">
					<v-sheet
						color="transparent"
						class="d-flex align-center justify-space-between ga-2"
					>
						<h5>{{ thresholdName }}</h5>
						<v-sheet color="transparent" class="d-flex align-center ga-1">
							<v-btn
								size="small"
								icon="mdi-pencil-outline"
								class="bg-transparent"
								@click="emit('edit', action)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-delete-outline"
								class="bg-transparent"
								color="error"
								@click="emit('delete', action)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">
						Triggers actuator {{ actuatorName }} using input {{ action.input }}
					</small>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Delay</small>
					<span class="text-body-2">{{ action.delay }} second(s)</span>
				</v-sheet>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Duration</small>
					<span class="text-body-2">{{ action.duration }} second(s)</span>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-chip
					size="small"
					color="accent"
					variant="flat"
				>Input {{ action.input }}</v-chip>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Updated At</small>
					<span class="text-body-2">{{ dateCmp.format(new Date(action.updatedAt), "fullDateTime12") }}</span>
				</v-sheet>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { ActionSchema } from "@/schemas/ActionSchema"
import { useDate } from "vuetify"

//

defineProps<{
	action: ActionSchema
	actuatorName: string
	thresholdName: string
}>()

const emit = defineEmits<{
	edit: [action: ActionSchema]
	delete: [action: ActionSchema]
}>()

const dateCmp = useDate()

//
</script>
