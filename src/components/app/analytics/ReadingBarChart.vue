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
