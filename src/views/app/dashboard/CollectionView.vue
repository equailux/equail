<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="pb-4">
					<small class="text-accent">Encode egg collection</small>
					<h3>Egg Collection</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<v-sheet class="pa-4 rounded-lg bg-primary border">
					<div class="w-100 pb-4 ga-2 border-b d-flex align-end">
						<h1>{{ total }}</h1>
						<small class="text-grey mb-2">total eggs collected</small>
					</div>
					<div class="pt-4">
						<CollectionCreateForm
							@submit="onSubmitCollectionCreateForm"
							@error="toastStore.error"
						></CollectionCreateForm>
					</div>
				</v-sheet>
			</v-col>
		</v-row>
		<v-row dense justify="center">
			<v-col cols="12" sm="6">
				<div class="pt-4 pb-2">
					<h5 class="text-accent">RECENT COLLECTIONS</h5>
				</div>
				<v-list bg-color="secondary" density="compact">
					<v-list-item
						v-for="collection in sorted"
						:key="collection.id"
					>
						<div class="d-flex align-center ga-2 py-2 border-b">
							<v-avatar color="accent" size="44">
								<span class="text-primary font-weight-bold">{{ collection.count }}</span>
							</v-avatar>
							<div>
								<h5>{{ collection.count }} eggs</h5>
								<small class="text-grey">
									{{ format(collection.collectAt, "PP p") }}
								</small>
							</div>
						</div>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import CollectionCreateForm from "@/components/app/dashboard/CollectionCreateForm.vue"
import type { CollectionCreateSchema } from "@/schemas/CollectionSchema"
import { useCollectionStore } from "@/stores/collection"
import { useToastStore } from "@/stores/toast"
import { format } from "date-fns"
import { storeToRefs } from "pinia"
import { onMounted } from "vue"

//

// --- Utils
const toastStore = useToastStore()

//

// --- Collection
const collectionStore = useCollectionStore()
const { total, sorted } = storeToRefs(collectionStore)

const onSubmitCollectionCreateForm = async (values: CollectionCreateSchema) => {
	await collectionStore.create(values)
	toastStore.success("Egg collection recorded successfully.")
}

//

const onMountedCb = async () => {
	await collectionStore.retrieve()
}

onMounted(() => onMountedCb().catch(toastStore.error))

//
</script>

<style scoped></style>
