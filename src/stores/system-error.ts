import { api } from "@/plugins/api"
import { SystemErrorPageSchema, type SystemErrorQuerySchema } from "@/schemas/SystemErrorSchema"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

//

const PAGE_SIZE = 10

export const useSystemErrorStore = defineStore("system-error", () => {

	//

	const systemErrors = ref<SystemErrorPageSchema["rows"]>([])
	const total = ref(0)
	const page = ref(1)
	const sorted = computed(() => [...systemErrors.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
	const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

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

	const retrieve = async (query: SystemErrorQuerySchema, targetPage = 1) => {
		const parsed = await fetchPage(query, (targetPage - 1) * PAGE_SIZE)
		systemErrors.value = parsed.rows
		total.value = parsed.total
		page.value = targetPage
		return parsed.rows
	}

	//

	return {
		systemErrors,
		total,
		page,
		pageCount,
		sorted,
		retrieve,
	}
})
