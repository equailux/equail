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
			<v-divider></v-divider>
			<v-sheet color="transparent" class="d-flex align-center justify-space-between ga-3">
				<v-sheet color="transparent" class="d-flex flex-column">
					<small class="text-grey-darken-1 text-caption">Status</small>
					<v-chip
						size="small"
						variant="flat"
						:color="isActive ? 'accent' : 'grey'"
					>{{ isActive ? "Active" : "Inactive" }}</v-chip>
				</v-sheet>
				<v-switch
					inset
					hide-details
					color="accent"
					density="compact"
					class="flex-grow-0"
					:label="isActive ? 'Deactivate' : 'Activate'"
					:model-value="isActive"
					:loading="busy"
					:disabled="disabled || busy"
					@update:model-value="onUpdateActive"
				></v-switch>
			</v-sheet>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { ActuatorSchema } from "@/schemas/ActuatorSchema"
import { computed } from "vue"
import { useDate } from "vuetify"

//

const props = defineProps<{
	actuator: ActuatorSchema
	busy?: boolean
	disabled?: boolean
}>()

const emit = defineEmits<{
	copy: [actuator: ActuatorSchema]
	edit: [actuator: ActuatorSchema]
	delete: [actuator: ActuatorSchema]
	toggle: [actuator: ActuatorSchema, input: number]
}>()

const dateCmp = useDate()
const isActive = computed(() => props.actuator.input != 0)

//

const onUpdateActive = (value: boolean | null) => emit("toggle", props.actuator, value ? 1 : 0)

//
</script>
