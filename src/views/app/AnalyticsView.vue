<template>
	<v-container id="printable" class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="6">
				<div class="pb-4">
					<small class="text-accent">Monthly Reports</small>
					<h3>Analytics</h3>
				</div>
			</v-col>
			<v-col cols="6">
				<div class="pb-4 d-flex justify-end">
					<v-btn 
						v-if="!isNative && !exportPDFLoading"
						icon="mdi-file-pdf-box"
						class="bg-transparent"
						:loading="exportPDFLoading"
						@click="onClickExportPDF"
					></v-btn>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Temperature</h5>
					<small class="text-grey text-caption">Average monthly temperature in celcius</small>
					<ReadingLineChart
						:color="theme.current.value.colors.accent"
						:readings
					></ReadingLineChart>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Humidity</h5>
					<small class="text-grey text-caption">Average monthly humidity percentage</small>
					<ReadingLineChart
						:color="theme.current.value.colors.accent"
						:readings
					></ReadingLineChart>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Eggs Detected</h5>
					<small class="text-grey text-caption">Total eggs collected per month</small>
					<ReadingBarChart
						:color="theme.current.value.colors.accent"
						:readings
					></ReadingBarChart>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Mortality Rate</h5>
					<small class="text-grey text-caption">Monthly mortality percentage</small>
					<ReadingLineChart
						:color="theme.current.value.colors.accent"
						:readings="mortalitiesByMonth"
					></ReadingLineChart>
				</div>
			</v-col>
		</v-row>
		<v-fab
			v-if="isNative"
			v-show="!exportPDFLoading"
			icon
			style="z-index: 9999"
			color="accent"
			class="position-fixed bottom-0 right-0 mb-16 mr-5"
			location="right bottom"
			transition="fade"
			:loading="exportPDFLoading"
			:disabled="exportPDFLoading"
		>
			<v-icon>mdi-file-export</v-icon>
			<v-speed-dial activator="parent">
				<v-btn 
					key="1"
					color="accent" 
					icon="mdi-file-pdf-box"
					@click="onClickExportPDF"
				></v-btn>
			</v-speed-dial>
		</v-fab>
	</v-container>
</template>

<script setup lang="ts">
import ReadingBarChart from '@/components/app/analytics/ReadingBarChart.vue';
import ReadingLineChart from '@/components/app/analytics/ReadingLineChart.vue';
import useReportExport from '@/composables/use-report-export';
import type { MortalitySchema } from '@/schemas/MortalitySchema';
import { useMortalityStore } from '@/stores/mortality';
import { useToastStore } from '@/stores/toast';
import { Capacitor } from '@capacitor/core';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useDate, useTheme } from 'vuetify';

//

// --- Utils
const theme = useTheme()
const dateCmp = useDate()
const toastStore = useToastStore()

// --- Data
const readings = reactive<Record<string, number>>({
	January: 8,
	February: 13,
	March: 17,
	April: 20,
})

// --- Platform
const isNative = Capacitor.isNativePlatform()

//

// --- Mortalities
const mortalityStore = useMortalityStore()
const { mortalities } = storeToRefs(mortalityStore)
const mortalitiesByMonth = computed(() => groupByMonth(mortalities.value))

const groupByMonth = (mortalities: MortalitySchema[]) => {
	const group: Record<string, number> = {}
	const data = [...mortalities].sort((a, b) => a.date.getTime() - b.date.getTime())

	for (const m of data) {
		const month = dateCmp.format(m.date, "month")
		if (!(month in group)) group[month] = 0
		group[month] = group[month]! + m.count
	}

	return group
}

//

// --- PDF Exporting
const reportExportCmp = useReportExport()
const exportPDFLoading = ref(false)

const onClickExportPDF = async () => {
	const el = document.getElementById("printable")
	if (!el) return

	exportPDFLoading.value = true
	await nextTick()

	await reportExportCmp.exportPDF(el, `report-${Date.now()}.pdf`)
	exportPDFLoading.value = false
}

//

const onMountedCb = async () => {
	await Promise.all([mortalityStore.retrieve()])
}

onMounted(async () => await onMountedCb().catch(toastStore.error))

//

</script>

<style scoped></style>
