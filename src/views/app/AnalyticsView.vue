<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Monthly Reports</small>
					<h3>Analytics</h3>
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
	</v-container>
</template>

<script setup lang="ts">
import ReadingBarChart from '@/components/app/analytics/ReadingBarChart.vue';
import ReadingLineChart from '@/components/app/analytics/ReadingLineChart.vue';
import { reactive } from 'vue';
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

//

</script>

<style scoped></style>
