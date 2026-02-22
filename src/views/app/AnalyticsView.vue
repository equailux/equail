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
						:readings
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
import { Capacitor } from '@capacitor/core';
import { nextTick, reactive, ref } from 'vue';
import { useTheme } from 'vuetify';

//

// --- Comp
const theme = useTheme()

// --- Data
const readings = reactive<Record<string, number>>({
	January: 8,
	February: 13,
	March: 17,
	April: 20,
})

// --- Platform
const isNative = Capacitor.isNativePlatform()

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

</script>

<style scoped></style>
