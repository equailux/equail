import { api } from "@/plugins/api"
import { SettingsSchema, SettingsUpdateSchema } from "@/schemas/SettingsSchema"
import { defineStore } from "pinia"
import { ref } from "vue"

//

export const useSettingsStore = defineStore("settings", () => {

	//

	const settings = ref<SettingsSchema | null>(null)

	//

	const retrieve = async () => {
		const res = await api.get<SettingsSchema>("/api/settings")
		const parsed = SettingsSchema.parse(res.data)
		settings.value = parsed
		return parsed
	}

	const update = async (data: SettingsUpdateSchema) => {
		const res = await api.patch<SettingsSchema>("/api/settings", data)
		const parsed = SettingsSchema.parse(res.data)
		settings.value = parsed
		return parsed
	}

	//

	return {
		settings,
		retrieve,
		update,
	}
})
