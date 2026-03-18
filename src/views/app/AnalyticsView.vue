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
						:readings="temperatureTVPair"
					></ReadingLineChart>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Humidity</h5>
					<small class="text-grey text-caption">Average monthly humidity percentage</small>
					<ReadingLineChart
						:color="theme.current.value.colors.accent"
						:readings="humidityTVPair"
					></ReadingLineChart>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="pa-4 rounded-lg bg-primary border elevation-1">
					<h5>Eggs Detected</h5>
					<small class="text-grey text-caption">Total eggs collected per month</small>
					<ReadingBarChart
						:color="theme.current.value.colors.accent"
						:readings="captureDetectionsPerMonth"
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
import type { CaptureSchema } from '@/schemas/CaptureSchema';
import type { MortalitySchema } from '@/schemas/MortalitySchema';
import type { ReadingSchema } from '@/schemas/ReadingSchema';
import { useCaptureStore } from '@/stores/capture';
import { useDetectionStore } from '@/stores/detection';
import { useMortalityStore } from '@/stores/mortality';
import { useReadingStore } from '@/stores/reading';
import { useToastStore } from '@/stores/toast';
import { groupByKey } from '@/utils/group';
import { Capacitor } from '@capacitor/core';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { useDate, useTheme } from 'vuetify';

//

// --- Utils
const theme = useTheme()
const dateCmp = useDate()
const isNative = Capacitor.isNativePlatform()
const toastStore = useToastStore()

// --- Readings
const readingStore = useReadingStore()
const { temperatures, humidities } = storeToRefs(readingStore)
const humidityTVPair = computed(() => getAverageReadingsPerMonth(humidities.value))
const temperatureTVPair = computed(() => getAverageReadingsPerMonth(temperatures.value))

const groupReadingsByMonth = (readings: ReadingSchema[]) => {
	const group: Record<string, ReadingSchema[]> = {}
	for (const r of readings) {
		const key = dateCmp.format(r.createdAt, "month")
		if (!(key in group)) group[key] = []
		group[key]!.push(r)
	}
	return group
}

const averageGroupReadingsByMonth = (readings: Record<string, ReadingSchema[]>) => {
	const avg = (readings: ReadingSchema[]) => readings.reduce((p, c) => p + c.value, 0) / readings.length
	const group: Record<string, number> = {}
	for (const month in readings) group[month] = avg(readings[month]!)
	return group
}

const getAverageReadingsPerMonth = (readings: ReadingSchema[]) => {
	const readingsByMonth = groupReadingsByMonth(readings)
	return averageGroupReadingsByMonth(readingsByMonth)
}

// --- Capture
const captureStore = useCaptureStore()
const { captures } = storeToRefs(captureStore)
const capturesByCam = computed(() => groupByKey(captures.value, (c) => c.camera))
const captureDetectionsPerMonth = computed(() => countCaptureDetectionsPerMonth(capturesByCam.value))

// --- Detections
const detectionStore = useDetectionStore()
const { detections } = storeToRefs(detectionStore)
const detectionsByCid = computed(() => groupByKey(detections.value, (d) => d.captureId))

// --- Egg Summary
const countCaptureDetectionsPerMonth = (cameraCapturesMap: Map<string, CaptureSchema[]>) => {
	const group: Record<string, number> = {}

	for (const [camera, captures] of cameraCapturesMap.entries()) {
		const capturesWithCount = captures.map((c) => ({ ...c, count: countCaptureDetections(c, captures) }))
		const totalCapturesWithCountByMonth = sumCapturesWithCountByMonth(capturesWithCount)

		for (const month in totalCapturesWithCountByMonth) {
			if (!(month in group)) group[month] = 0
			group[month] = group[month]! + totalCapturesWithCountByMonth[month]!
		}
	}

	return group
}

const countCaptureDetections = (capture: CaptureSchema, captures: CaptureSchema[]) => {
	const index = captures.findIndex(c => c.id == capture.id)
	if (index == -1 || index - 1 < 0) return detectionsByCid.value.get(capture.id)?.length || 0

	const captureDetections = detectionsByCid.value.get(capture.id)?.length || 0
	const prevCapture = captures[index - 1]!
	const prevCaptureDetections = detectionsByCid.value.get(prevCapture.id)?.length || 0
	return captureDetections - prevCaptureDetections
}

const sumCapturesWithCountByMonth = (captures: (CaptureSchema & { count: number })[]) => {
	const group: Record<string, number> = {}
	for (const capture of captures) {
		const month = dateCmp.format(capture.createdAt, "month")
		if (!(month in group)) group[month] = 0
		group[month] = group[month]! + capture.count
	}
	return group
}

// --- Mortalities
const mortalityStore = useMortalityStore()
const { mortalities } = storeToRefs(mortalityStore)
const mortalitiesByMonth = computed(() => groupMortalityByMonth(mortalities.value))

const groupMortalityByMonth = (mortalities: MortalitySchema[]) => {
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
	await Promise.all([
		captureStore.retrieve(),
		detectionStore.retrieve(),
		readingStore.retrieve(),
		mortalityStore.retrieve(),
	])
}

onMounted(async () => await onMountedCb().catch(toastStore.error))

//

</script>

<style scoped></style>
