<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12">
				<v-sheet
					color="transparent"
					class="pb-4 d-flex align-start justify-space-between ga-3"
				>
					<v-sheet color="transparent">
						<small class="text-accent">Manage feed automation timing</small>
						<h3>Feed Configuration</h3>
					</v-sheet>
					<v-btn
						color="accent"
						prepend-icon="mdi-play-circle-outline"
						:disabled="!networkStore.connected || testing"
						:loading="testing"
						@click="onClickTestFeed"
					>
						Test
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
				<FeedConfigCard
					:config="config"
					@edit="onClickEditConfig"
				></FeedConfigCard>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-75 w-md-50" v-model="showUpdateModal">
			<v-sheet class="pa-5 rounded bg-secondary">
				<h4 class="mb-5 text-center">Update Feed Config</h4>
				<FeedConfigUpdateForm
					v-if="config"
					:config="config"
					:disabled="!networkStore.connected"
					@submit="onSubmitUpdateForm"
					@error="onFormError"
				></FeedConfigUpdateForm>
			</v-sheet>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
import FeedConfigCard from "@/components/app/config/FeedConfigCard.vue"
import FeedConfigUpdateForm from "@/components/app/config/FeedConfigUpdateForm.vue"
import type { FeedConfigUpdateSchema } from "@/schemas/FeedConfigSchema"
import { useFeedConfigStore } from "@/stores/feed-config"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import { storeToRefs } from "pinia"
import type { SubmissionContext } from "vee-validate"
import { onMounted, ref } from "vue"

//

// --- Utilities
const toastStore = useToastStore()
const networkStore = useNetworkStore()

// --- Feed Config
const feedConfigStore = useFeedConfigStore()
const { config } = storeToRefs(feedConfigStore)
const showUpdateModal = ref(false)
const testing = ref(false)

// --- Actions
const onClickEditConfig = () => {
	showUpdateModal.value = true
}

const onClickTestFeed = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	testing.value = true
	await feedConfigStore
		.test()
		.then(() => toastStore.success(`Feed test started successfully.`))
		.catch(onFormError)
		.finally(() => testing.value = false)
}

// --- Forms
const onFormError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Request failed."
	toastStore.error(message)
}

const onSubmitUpdateForm = async (
	values: FeedConfigUpdateSchema,
	ctx: SubmissionContext<{ [K in keyof FeedConfigUpdateSchema]?: unknown }>
) => {
	if (!networkStore.connected) return toastStore.error("You are offline.")

	await feedConfigStore
		.update(values)
		.then(() => toastStore.success(`Configuration updated successfully.`))
		.then(() => showUpdateModal.value = false)
		.then(() => ctx.resetForm())
		.catch(onFormError)
}

//

const onMountedCb = async () => {
	if (!networkStore.connected) return toastStore.error("You are offline.")
	await feedConfigStore.retrieve()
}

onMounted(() => onMountedCb().catch(onFormError))

//

</script>
