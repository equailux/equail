import { api } from "@/plugins/api"
import {
	DetectionCreateSchema,
	DetectionSchema,
	DetectionUpdateSchema,
	type DetectionCreateSchema as DetectionCreate,
	type DetectionSchema as Detection,
	type DetectionUpdateSchema as DetectionUpdate,
} from "@/schemas/DetectionSchema"
import { defineStore } from "pinia"
import { ref } from "vue"
import z from "zod"

//

export const useDetectionStore = defineStore("detection", () => {

	//

	const detections = ref<Detection[]>([])

	//

	type DetectionApiResponse = Omit<Detection, "box"> & { box: Detection["box"] | string }

	const parseDetection = (data: DetectionApiResponse) => {
		const prep = {
			...data,
			box: typeof data.box == "string" ? JSON.parse(data.box) : data.box,
		}

		return DetectionSchema.parse(prep)
	}

	const toApiPayload = <T extends DetectionCreate | DetectionUpdate>(data: T) => ({
		...data,
		...("box" in data && data.box ? { box: JSON.stringify(data.box) } : {}),
	})

	const create = async (data: DetectionCreate) => {
		const parsedData = DetectionCreateSchema.parse(data)
		const res = await api.post<DetectionApiResponse>(`/api/capture/${parsedData.captureId}/detection`, toApiPayload(parsedData))
		const parsed = parseDetection(res.data)

		const index = detections.value.findIndex(d => d.id == parsed.id)
		if (index != -1) detections.value.splice(index, 1, parsed)
		else detections.value.push(parsed)
		return parsed
	}

	const retrieve = async () => {
		const res = await api.get<DetectionApiResponse[]>(`/api/capture/detection?limit=100000`)
		const parsed = z.array(DetectionSchema).parse(res.data.map(parseDetection))
		detections.value = parsed
		return parsed
	}

	const update = async (data: DetectionUpdate & { id: number }) => {
		const { id, ...values } = data
		const parsedData = DetectionUpdateSchema.parse(values)
		const res = await api.patch<DetectionApiResponse>(`/api/capture/detection/${id}`, toApiPayload(parsedData))
		const parsed = parseDetection(res.data)

		const index = detections.value.findIndex(d => d.id == parsed.id)
		if (index != -1) detections.value.splice(index, 1, parsed)
		return parsed
	}

	const destroy = async (id: number) => {
		await api.delete(`/api/capture/detection/${id}`)

		const index = detections.value.findIndex(d => d.id == id)
		if (index != -1) detections.value.splice(index, 1)
	}

	//

	return {
		detections,
		create,
		retrieve,
		update,
		destroy,
	}

})
