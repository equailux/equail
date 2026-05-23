import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { FeedSchema } from "@/schemas/FeedSchema"
import { api } from "@/plugins/api"

//

export const useFeedStore = defineStore("feed", () => {

	//

	const feeds = ref<FeedSchema[]>([])
	const latest = ref<FeedSchema>()

	//

	const retrieve = async () => {
		const res = await api.get<FeedSchema[]>(`/api/feed`, { params: { limit: 1 } })
		const parsed = z.array(FeedSchema).parse(res.data)
		feeds.value = parsed
		if (parsed.length > 0) latest.value = parsed[0]
		return parsed
	}

	//

	return {
		latest,
		feeds,
		retrieve,
	}
})
