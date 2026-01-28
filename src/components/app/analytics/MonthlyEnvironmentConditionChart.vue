<template>
    <div>
        <Bar :key :data :options />
    </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs"
import type { ChartData, ChartOptions } from "chart.js"
import { ref, watch } from "vue";

//

const props = defineProps<{ environmentConditionPerMonth: Record<string, number> }>()

const key = ref(0)
const data: ChartData<"bar"> = { labels: [], datasets: [] }

const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
}

//

watch(() => props.environmentConditionPerMonth, (epm) => {
    const labels = Object.keys(epm)
    const dataset = {
        data: Object.values(epm),
        backgroundColor: "#689F38",
        borderRadius: 6,
    }

    data.labels = labels
    data.datasets = [dataset]
    key.value++
}, { immediate: true, deep: true })

//

</script>

<style scoped>

</style>