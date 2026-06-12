import { api } from "@/plugins/api"
import { CollectionSchema, type CollectionCreateSchema } from "@/schemas/CollectionSchema"
import { isSameDay, isSameMonth } from "date-fns"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import z from "zod"

//

export const useCollectionStore = defineStore("collection", () => {

	//

	const collections = ref<CollectionSchema[]>([])

	//

	const total = computed(() => collections.value.reduce((p, c) => p + c.count, 0))
	const today = computed(() => collections.value.filter(c => isSameDay(c.collectAt, new Date())))
	const sorted = computed(() => [...collections.value].sort((a, b) => b.collectAt.getTime() - a.collectAt.getTime()))
	const monthly = computed(() => collections.value.filter(c => isSameMonth(c.collectAt, new Date())))

	//

	const create = async (data: CollectionCreateSchema) => {
		const res = await api.post<CollectionSchema>("/api/collection", data)
		const parsed = CollectionSchema.parse(res.data)
		collections.value.push(parsed)
		return parsed
	}

	const retrieve = async () => {
		const res = await api.get<CollectionSchema[]>("/api/collection")
		const parsed = z.array(CollectionSchema).parse(res.data)
		collections.value = parsed
		return parsed
	}

	const update = async (data: CollectionSchema) => {
		const res = await api.patch<CollectionSchema>(`/api/collection/${data.id}`, data)
		const parsed = CollectionSchema.parse(res.data)

		const idx = collections.value.findIndex(c => c.id == data.id)
		if (idx != -1) collections.value.splice(idx, 1, parsed)
		return parsed
	}

	const destroy = async (data: CollectionSchema) => {
		await api.delete(`/api/collection/${data.id}`)
		const idx = collections.value.findIndex(c => c.id == data.id)
		if (idx != -1) collections.value.splice(idx, 1)
		return data
	}

	//

	return {
		total,
		today,
		sorted,
		monthly,
		collections,
		create,
		retrieve,
		update,
		destroy,
	}
})
