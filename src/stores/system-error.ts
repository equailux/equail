import { api } from "@/plugins/api"
import { SystemErrorSchema, type SystemErrorQuerySchema } from "@/schemas/SystemErrorSchema"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import z from "zod"

//

export const useSystemErrorStore = defineStore("system-error", () => {

	//

	const systemErrors = ref<SystemErrorSchema[]>([])
	const sorted = computed(() => [...systemErrors.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))

	//

	const toApiDate = (date: Date) => {
		const year = date.getFullYear()
		const month = `${date.getMonth() + 1}`.padStart(2, "0")
		const day = `${date.getDate()}`.padStart(2, "0")
		return `${year}-${month}-${day}`
	}

	const retrieve = async (query: SystemErrorQuerySchema) => {
		const date = toApiDate(query.date)
		const res = await api.get<SystemErrorSchema[]>("/api/system-error", {
			params: {
				date,
				from: date,
				to: date,
			},
		})
		const parsed = z.array(SystemErrorSchema).parse(res.data)
		systemErrors.value = parsed
		return parsed
	}

	//

	return {
		systemErrors,
		sorted,
		retrieve,
	}
})
