<template>
	<v-container class="pa-0" fluid>
		<v-row no-gutters>
			<v-col>
				<v-card id="pdfContent" color="primary" elevation="0">
					<template #title>
						<span class="pb-0 text-subtitle-2">Monthly Egg Production</span>
					</template>
					<template #append>
						<v-btn
							v-if="!isPrinting"
							size="small"
							text="Print PDF"
							color="primary"
							@click="onClickPrintPDF"
						></v-btn>
					</template>
					<template #subtitle>
						<span class="pb-0 text-subtitle-2 font-weight-regular"> Total Eggs Production per month </span>
					</template>
					<template #text>
						<MonthlyEggProductionChart class="w-100" :eggs-per-month></MonthlyEggProductionChart>
					</template>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import MonthlyEggProductionChart from "@/components/app/analytics/MonthlyEggProductionChart.vue"
import { nextTick, reactive, ref } from "vue"

//

const eggsPerMonth = reactive<Record<string, number>>({
	January: 8,
	February: 13,
	March: 17,
	April: 20,
})

const isPrinting = ref(false)

//

const onClickPrintPDF = async () => {
	const printElement = document.getElementById("pdfContent")
	if (!printElement) return
	isPrinting.value = true

	// --- Dynamically import to avoid errors
	await nextTick()
	const { jsPDF } = await import("jspdf")
	const html2canvas = (await import("html2canvas")).default

	// --- Create A4 report
	const pdf = new jsPDF({
		orientation: "p",
		unit: "px",
		format: "a4",
		hotfixes: ["px_scaling"],
	})

	// --- 96px = 1inch
	const pdfWidth = pdf.internal.pageSize.getWidth()
	const pdfHeight = pdf.internal.pageSize.getHeight()

	// --- Create canvas of the element
	const canvas = await html2canvas(printElement, {
		width: printElement.scrollWidth,
		height: printElement.scrollHeight,
	})

	// --- Convert canvas to image in ratio
	const imgData = canvas.toDataURL("image/png")
	const imgWidth = pdfWidth
	const imgHeight = (canvas.height * imgWidth) / canvas.width

	// --- Record increments
	let heightLeft = imgHeight
	let heightUsed = 0

	// --- Slice the first part of the image
	pdf.addImage(imgData, "PNG", 0, heightUsed, imgWidth, imgHeight)
	heightLeft -= pdfHeight

	// --- Pull up the image
	while (heightLeft > 0) {
		heightUsed -= pdfHeight
		pdf.addPage()
		pdf.addImage(imgData, "PNG", 0, heightUsed, imgWidth, imgHeight)
		heightLeft -= pdfHeight
	}

	pdf.save(`monthly-eggs-chart.pdf`)
	isPrinting.value = false
}

//
</script>

<style scoped></style>
