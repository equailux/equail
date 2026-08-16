<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="7" sm="8">
				<div class="pb-4">
					<small class="text-accent">System diagnostics</small>
					<h3>System Errors</h3>
				</div>
			</v-col>
			<v-col cols="5" sm="4">
				<v-sheet color="transparent" class="pb-4">
					<v-date-input
						label="Date"
						prepend-icon=""
						append-inner-icon="mdi-calendar"
						:model-value="date"
						:disabled="loading || !network.connected"
						:error-messages="errors.date"
						@update:model-value="onUpdateDate"
					></v-date-input>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-sheet class="pa-4 rounded-lg bg-primary border elevation-1 d-flex align-center ga-3">
					<v-icon color="accent">mdi-alert-circle-outline</v-icon>
					<div>
						<h4>{{ systemErrorStore.total }}</h4>
						<small class="text-grey-darken-1 text-caption">{{ activeDateText }}</small>
					</div>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row v-if="!loading && !systemErrorStore.sorted.length" dense>
			<v-col cols="12">
				<v-sheet class="pa-6 text-center bg-primary rounded-lg border elevation-1">
					<h5>No system errors found</h5>
					<small class="text-grey-darken-1 text-caption">No errors were recorded for the selected day.</small>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="systemError in systemErrorStore.sorted"
				:key="systemError.id"
				cols="12"
				sm="6"
				lg="4"
			>
				<v-card
					border
					class="bg-primary"
					rounded="lg"
					elevation="1"
				>
					<template #prepend>
						<v-avatar color="error" variant="tonal">
							<v-icon>mdi-alert-outline</v-icon>
						</v-avatar>
					</template>
					<template #title>
						<h5>{{ systemError.title }}</h5>
					</template>
					<template #subtitle>
						<small class="text-grey-darken-1 text-caption">
							{{ dateCmp.format(systemError.createdAt, "fullDateTime12h") }}
						</small>
					</template>
					<template #text>
						<p class="mb-0 text-grey-darken-1 text-caption">{{ systemError.description }}</p>
					</template>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="systemErrorStore.pageCount > 1" dense>
			<v-col cols="12" class="text-center">
				<v-pagination
					:model-value="systemErrorStore.page"
					:length="systemErrorStore.pageCount"
					:disabled="loading || loadingPage || !network.connected"
					:total-visible="5"
					density="comfortable"
					color="accent"
					@update:model-value="onChangePage"
				></v-pagination>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { SystemErrorQuerySchema } from "@/schemas/SystemErrorSchema"
import { useNetworkStore } from "@/stores/network"
import { useSystemErrorStore } from "@/stores/system-error"
import { useToastStore } from "@/stores/toast"
import { computed, onMounted, reactive, ref } from "vue"
import { useDate } from "vuetify"

//

// --- Utils
const dateCmp = useDate()
const network = useNetworkStore()
const toastStore = useToastStore()

// --- Filter
const date = ref<Date | null>(new Date())
const activeQuery = ref<SystemErrorQuerySchema>()
const errors = reactive({ date: "" })

const validateQuery = () => {
	errors.date = ""

	const parsed = SystemErrorQuerySchema.safeParse({
		date: date.value ?? undefined,
	})

	if (parsed.success) return parsed.data

	const fields = parsed.error.flatten().fieldErrors
	errors.date = fields.date?.[0] ?? ""
	return undefined
}

const activeDateText = computed(() => {
	if (!activeQuery.value) return "No date selected."

	return dateCmp.format(activeQuery.value.date, "fullDate")
})

// --- System Errors
const loading = ref(false)
const loadingPage = ref(false)
const systemErrorStore = useSystemErrorStore()

const onError = (error: unknown) => {
	const message = error instanceof Error ? error.message : "Failed to load system errors."
	toastStore.error(message)
}

const retrieve = async (query: SystemErrorQuerySchema, targetPage = 1) => {
	if (!network.connected) return toastStore.error("You are offline.")

	loading.value = true
	await systemErrorStore
		.retrieve(query, targetPage)
		.then(() => activeQuery.value = query)
		.catch(onError)
		.finally(() => loading.value = false)
}

const retrieveSelectedDate = async () => {
	const query = validateQuery()
	if (!query) return

	await retrieve(query)
}

const onUpdateDate = async (value: Date | string | null) => {
	date.value = value ? new Date(value) : null
	await retrieveSelectedDate()
}

const onChangePage = async (targetPage: number) => {
	if (!network.connected) return toastStore.error("You are offline.")
	if (!activeQuery.value) return

	loadingPage.value = true
	await systemErrorStore
		.retrieve(activeQuery.value, targetPage)
		.catch(onError)
		.finally(() => loadingPage.value = false)
}

//

const onMountedCb = async () => {
	await retrieveSelectedDate()
}

onMounted(() => onMountedCb())

//
</script>
