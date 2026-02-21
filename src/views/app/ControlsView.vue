<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Manage you devices</small>
					<h3>Device Controls</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1 d-flex flex-column">
					<div class="d-flex align-center ga-3">
						<div 
							class="pa-4 rounded-lg d-flex align-center justify-center"
							style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
						>
							<v-icon color="accent">mdi-lightbulb-outline</v-icon>
						</div>
						<div class="w-100">
							<div class="d-flex align-center justify-space-between">
								<h5>Coop Light</h5>
								<div 
									class="text-caption text-accent px-3 rounded-pill"
									style="background-color: rgba(var(--v-theme-accent), 0.1)"
								>Off</div>
							</div>
							<small 
								class="text-grey-darken-1 text-caption"
								style="line-height: 0;"
							>LED lighting control</small>
						</div>
					</div>
					<v-btn
						text="Turn On"
						color="accent"
						class="mt-4"
						prepend-icon="mdi-power"
					></v-btn>
					<span class="mt-3 text-grey-darken-1 text-caption">Idle - Standby mode</span>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import MortalityCreateForm from "@/components/app/MortalityCreateForm.vue"
import type { MortalityCreateSchema } from "@/schemas/MortalitySchema"
import type { SubmissionContext } from "vee-validate"
import { ref } from "vue"

//

const isLightOn = ref(false)

//

const onSubmitMortalityCreateForm = async (
	values: MortalityCreateSchema,
	ctx: SubmissionContext<{ [K in keyof MortalityCreateSchema]?: unknown }>
) => {
	// --- Temporary while no API
	await new Promise(res => setTimeout(res, 1000)).then(() => ctx.resetForm())
}

//
</script>

<style scoped></style>
