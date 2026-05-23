import { ref } from "vue"
import { defineStore } from "pinia"
import { FeedConfigSchema, FeedConfigUpdateSchema } from "@/schemas/FeedConfigSchema"
import { api } from "@/plugins/api"

//

export const useFeedConfigStore = defineStore("feed-config", () => {

	//

	const config = ref<FeedConfigSchema | null>(null)

	//

	const retrieve = async () => {
		const res = await api.get<FeedConfigSchema>(`/api/feed/config`)
		const parsed = FeedConfigSchema.parse(res.data)
		config.value = parsed
		return parsed
	}

	const update = async (data: FeedConfigUpdateSchema) => {
		const res = await api.patch<FeedConfigSchema>(`/api/feed/config`, data)
		const parsed = FeedConfigSchema.parse(res.data)
		config.value = parsed
		return parsed
	}

	//

	return {
		config,
		retrieve,
		update,
	}
})
