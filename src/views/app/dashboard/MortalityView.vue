<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Encode quail death</small>
					<h3>Quail Mortality</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="w-100 pb-2 ga-2 border-b d-flex align-end">
					<h1>{{ total }}</h1>
					<small class="text-grey mb-2">total deaths</small>
				</div>
				<v-infinite-scroll @load="getMortalities">
					<template 
						v-for="mortality in sorted" 
						:key="(mortality as any)?.id"
					>
						<div class="d-flex align-center ga-2 py-2 border-b">
							<v-chip 
								color="red"
								class="pa-0 rounded-circle d-flex align-center justify-center"
								style="min-width: 46px; min-height: 46px"
							>{{ mortality.count }}</v-chip>
							<div>
								<h5>{{ mortality.count }} deaths</h5>
								<small class="text-grey">
									{{ dateCmp.format(mortality.date, "fullDate") }}
								</small>
							</div>
							<v-spacer></v-spacer>
							<v-btn
								size="x-small"
								icon="mdi-minus"
								class="bg-transparent"
								:disabled="mortality.count <= 0"
								@click="onDecrementMortality(mortality)"
							></v-btn>
							<v-btn
								size="x-small"
								icon="mdi-plus"
								class="bg-transparent"
								@click="onIncrementMortality(mortality)"
							></v-btn>
						</div>
					</template>
				</v-infinite-scroll>
			</v-col>
		</v-row>
		<v-dialog class="w-100 w-sm-50 w-md-33" v-model="showMortalityCreateModal">
			<div class="pa-5 rounded bg-secondary">
				<h4 class="w-100 mb-5 text-center">Record Quail Mortality</h4>
				<MortalityCreateForm
					@submit="onSubmitMortalityCreateForm"
				></MortalityCreateForm>
			</div>
		</v-dialog>
		<v-fab
			icon="mdi-plus"
			color="accent"
			class="position-fixed bottom-0 right-0 mb-5 mr-5"
			location="right bottom"
			transition="fade"
			@click="showMortalityCreateModal = !showMortalityCreateModal"
		></v-fab>
	</v-container>
</template>

<script setup lang="ts">
import MortalityCreateForm from '@/components/app/dashboard/MortalityCreateForm.vue';
import type { MortalityCreateSchema, MortalitySchema } from '@/schemas/MortalitySchema';
import { useMortalityStore } from '@/stores/mortality';
import type { SubmissionContext } from 'vee-validate';
import { useDate } from 'vuetify';
import { ref } from 'vue';
import type { InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';
import { storeToRefs } from 'pinia';

//

// --- Mortality
const dateCmp = useDate()
const mortalityStore = useMortalityStore()
const { total, sorted } = storeToRefs(mortalityStore)

const getMortalities = async ({ done }: { done: (v: InfiniteScrollStatus) => void }) => {
	await new Promise(res => setTimeout(res, 250))
	done("empty")
}

// --- Mortality Form
const showMortalityCreateModal = ref(false)

const onSubmitMortalityCreateForm = async (
	values: MortalityCreateSchema,
	ctx: SubmissionContext<{ [K in keyof MortalityCreateSchema]?: unknown }>
) => {
	mortalityStore.create(values)
	showMortalityCreateModal.value = false
	ctx.resetForm({ values: { count: 1, date: new Date() } })
}

// --- Mortality Update
const onIncrementMortality = async (data: MortalitySchema) => {
	data.count++
	await mortalityStore.update(data)
}

const onDecrementMortality = async (data: MortalitySchema) => {
	data.count--
	await mortalityStore.update(data)
}

//

</script>

<style scoped></style>
