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
					<v-icon color="accent">mdi-tune-variant</v-icon>
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
								@click="emit('edit', condition)"
							></v-btn>
							<v-btn
								size="small"
								icon="mdi-delete-outline"
								class="bg-transparent"
								color="error"
								@click="emit('delete', condition)"
							></v-btn>
						</v-sheet>
					</v-sheet>
					<small class="text-grey-darken-1 text-caption">
						Condition is satisfied when output {{ condition.operator }} {{ condition.output }}
					</small>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Operator</small>
					<span class="text-body-2">{{ condition.operator }}</span>
				</v-sheet>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Output</small>
					<span class="text-body-2">{{ condition.output }}</span>
				</v-sheet>
			</v-sheet>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-chip
					size="small"
					:color="condition.satisfied ? 'accent' : 'grey'"
					variant="flat"
				>{{ condition.satisfied ? "Satisfied" : "Not Satisfied" }}</v-chip>
				<v-sheet color="transparent" class="d-flex flex-column text-end">
					<small class="text-grey-darken-1 text-caption">Updated At</small>
					<span class="text-body-2">{{ dateCmp.format(new Date(condition.updatedAt), "fullDateTime12") }}</span>
				</v-sheet>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { ConditionSchema } from "@/schemas/ConditionSchema"
import { useDate } from "vuetify"

//

defineProps<{
	condition: ConditionSchema
	thresholdName: string
}>()

const emit = defineEmits<{
	edit: [condition: ConditionSchema]
	delete: [condition: ConditionSchema]
}>()

const dateCmp = useDate()

//
</script>
