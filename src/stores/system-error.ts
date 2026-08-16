import { api } from "@/plugins/api"
import { SystemErrorPageSchema, type SystemErrorQuerySchema } from "@/schemas/SystemErrorSchema"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

//

const PAGE_SIZE = 30

export const useSystemErrorStore = defineStore("system-error", () => {

	//

	const systemErrors = ref<SystemErrorPageSchema["rows"]>([])
	const total = ref(0)
	const sorted = computed(() => [...systemErrors.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
	const hasMore = computed(() => systemErrors.value.length < total.value)

	//

	const toDayRange = (date: Date) => {
		const alpha = new Date(date)
		alpha.setHours(0, 0, 0, 0)
		const omega = new Date(date)
		omega.setHours(23, 59, 59, 999)
		return { alpha, omega }
	}

	const fetchPage = async (query: SystemErrorQuerySchema, offset: number) => {
		const { alpha, omega } = toDayRange(query.date)
		const res = await api.get("/api/system-error", {
			params: { alpha, omega, limit: PAGE_SIZE, offset },
		})
		return SystemErrorPageSchema.parse(res.data)
	}

	const retrieve = async (query: SystemErrorQuerySchema) => {
		const parsed = await fetchPage(query, 0)
		systemErrors.value = parsed.rows
		total.value = parsed.total
		return parsed.rows
	}

	const retrieveMore = async (query: SystemErrorQuerySchema) => {
		if (!hasMore.value) return systemErrors.value

		const parsed = await fetchPage(query, systemErrors.value.length)
		systemErrors.value.push(...parsed.rows)
		total.value = parsed.total
		return systemErrors.value
	}

	//

	return {
		systemErrors,
		total,
		sorted,
		hasMore,
		retrieve,
		retrieveMore,
	}
})
