<template>
	<div>
		<Bar :key :data :options />
	</div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs"
import type { ChartData, ChartOptions } from "chart.js"
import { ref, watch } from "vue"

//

const props = defineProps<{ color?: string, readings: Record<string, number> }>()

const key = ref(0)
const data: ChartData<"bar"> = { labels: [], datasets: [] }

const options: ChartOptions<"bar"> = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: { legend: { display: false } },
	scales: {
		y: {
			beginAtZero: true,
			ticks: {
				color: "#aaa",
				font: { size: 12 },
				precision: 0,
			},
			afterBuildTicks: (scale) => {
				const step = 5
				const defaultPeak = 15
				const values = scale.chart.data.datasets.flatMap((d) => (d.data as number[]) ?? [])
				const peak = values.length ? Math.max(0, ...values) : defaultPeak

				const ticks: { value: number }[] = []
				for (let v = 0; v <= peak; v += step) ticks.push({ value: v })
				if (ticks[ticks.length - 1]?.value !== peak) ticks.push({ value: peak })

				scale.ticks = ticks
			},
		},
	},
}

//

const onChangeReadings = (readings: Record<string, number>) => {
	const labels = Object.keys(readings)
	const dataset = {
		data: Object.values(readings),
		backgroundColor: props.color,
		borderRadius: 6,
	}

	data.labels = labels
	data.datasets = [dataset]
	key.value++
}

watch(() => props.readings, onChangeReadings, { immediate: true, deep: true })

//
</script>

<style scoped></style>
