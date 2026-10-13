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

	const receive = (data: unknown[]) => {
		for (const item of data) {
			const result = FeedSchema.safeParse(item)
			if (!result.success) continue
			const feed = result.data
			const current = latest.value
			if (!current || feed.createdAt > current.createdAt ||
				(feed.createdAt.getTime() === current.createdAt.getTime() && feed.id >= current.id)) {
				latest.value = feed
			}
		}
	}

	const retrieve = async () => {
		const res = await api.get<FeedSchema[]>(`/api/feed`, { params: { limit: 1 } })
		const parsed = z.array(FeedSchema).parse(res.data)
		feeds.value = parsed
		receive(parsed)
		return parsed
	}

	//

	return {
		latest,
		feeds,
		retrieve,
		receive,
	}
})
