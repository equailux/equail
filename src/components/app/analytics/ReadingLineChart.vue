<template>
	<div>
		<Line :key :data :options />
	</div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs"
import type { ChartData, ChartOptions } from "chart.js"
import { ref, watch } from "vue"

//

const props = defineProps<{ readings: Record<string, number> }>()

const key = ref(0)
const data: ChartData<"line"> = { labels: [], datasets: [] }

function createGradient() {
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")!
	const gradient = ctx.createLinearGradient(0, 0, 0, 300)
	gradient.addColorStop(0, "rgba(180, 100, 50, 0.25)")
	gradient.addColorStop(1, "rgba(255, 245, 235, 0.0)")
	return gradient
}

const options: ChartOptions<"line"> = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		tooltip: { enabled: false },
	},
	scales: {
		x: {
			grid: { display: false },
			border: { display: false },
			ticks: {
				color: "#aaa",
				font: { size: 12 },
			},
		},
		y: {
			grid: {
				color: "rgba(0,0,0,0.08)",
				lineWidth: 1,
				//@ts-ignore
				borderDash: [4, 4],
			},
			border: { display: false, dash: [4, 4] },
			ticks: {
				color: "#aaa",
				font: { size: 12 },
				maxTicksLimit: 5,
			},
		},
	},
	elements: {
		point: { radius: 0, hoverRadius: 0 },
		line: {
			tension: 0.4,
			borderWidth: 2,
		},
	},
}

//

watch(
	() => props.readings,
	epm => {
		const labels = Object.keys(epm)
		const dataset = {
			data: Object.values(epm),
			borderColor: "#679e36",
			backgroundColor: createGradient(),
			fill: true,
			borderWidth: 2,
		}

		data.labels = labels
		data.datasets = [dataset]
		key.value++
	},
	{ immediate: true, deep: true }
)

//
</script>

<style scoped></style>