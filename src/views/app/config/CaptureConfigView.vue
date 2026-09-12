<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12">
				<v-sheet
					color="transparent"
					class="pb-4 d-flex align-start justify-space-between ga-3"
				>
					<v-sheet color="transparent">
						<small class="text-accent">Manage camera capture timing</small>
						<h3>Camera Configuration</h3>
					</v-sheet>
					<v-btn
						color="accent"
						prepend-icon="mdi-camera-iris"
						:disabled="!networkStore.connected || capturing"
						:loading="capturing"
						@click="onClickCapture"
					>
						Capture
					</v-btn>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row v-if="!config" dense>
			<v-col cols="12">
				<v-sheet class="pa-6 text-center bg-primary rounded-lg">
					<v-progress-circular indeterminate color="accent"></v-progress-circular>
					<div class="mt-2 text-grey-darken-1 text-caption">Loading configuration...</div>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row v-else dense>
			<v-col cols="12" sm="6" md="4">
				<CaptureConfigCard
					:config="config"
					@edit="onClickEditConfig"
				></CaptureConfigCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Camera Config</h4>
				<CaptureConfigUpdateForm
					v-if="config"
					:config="config"
					:disabled="!networkStore.connected"
					@submit="onSubmitUpdateForm"
					@error="onFormError"
				></CaptureConfigUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import CaptureConfigCard from "@/components/app/config/CaptureConfigCard.vue"
import CaptureConfigUpdateForm from "@/components/app/config/CaptureConfigUpdateForm.vue"
import type { CaptureConfigFormSchema } from "@/schemas/CaptureConfigSchema"
import { useCaptureConfigStore } from "@/stores/capture-config"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { onMounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Capture Config
const captureConfigStore = useCaptureConfigStore()
const { config } = storeToRefs(captureConfigStore)
const showUpdateModal = ref(false)
const capturing = ref(false)

// --- Actions
const onClickEditConfig = () => {
	showUpdateModal.value = true
}

const onClickCapture = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	capturing.value = true
	await captureConfigStore
		.trigger()
		.then(() => toastStore.success(`Capture requested successfully.`))
		.catch(onFormError)
		.finally(() => capturing.value = false)
}

// --- Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitUpdateForm = async (
	values: CaptureConfigFormSchema,
	ctx: SubmissionContext<{ [K in keyof CaptureConfigFormSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	await captureConfigStore
		.update({ intervalMs: values.intervalSec * 1000, enabled: values.enabled })
		.then(() => toastStore.success(`Configuration updated successfully.`))
		.then(() => showUpdateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await captureConfigStore.retrieve()
}

onMounted(() => onMountedCb().catch(onFormError))

//

</script>
