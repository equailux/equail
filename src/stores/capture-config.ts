import { ref } from "vue"
import { defineStore } from "pinia"
import { CaptureConfigSchema, type CaptureConfigUpdateSchema } from "@/schemas/CaptureConfigSchema"
import { api } from "@/plugins/api"

//

export const useCaptureConfigStore = defineStore("capture-config", () => {

	//

	const config = ref<CaptureConfigSchema | null>(null)

	//

	const retrieve = async () => {
		const res = await api.get<CaptureConfigSchema>(`/api/capture/config`)
		const parsed = CaptureConfigSchema.parse(res.data)
		config.value = parsed
		return parsed
	}

	const update = async (data: CaptureConfigUpdateSchema) => {
		const res = await api.patch<CaptureConfigSchema>(`/api/capture/config`, data)
		const parsed = CaptureConfigSchema.parse(res.data)
		config.value = parsed
		return parsed
	}

	const trigger = async () => {
		await api.post(`/api/capture/trigger`)
	}

	//

	return {
		config,
		retrieve,
		update,
		trigger,
	}
})
