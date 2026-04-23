import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { ThresholdCreateSchema, ThresholdSchema, ThresholdUpdateSchema } from "@/schemas/ThresholdSchema"
import { api } from "@/plugins/api"

//

export const useThresholdStore = defineStore("threshold", () => {

    //

    const thresholds = ref<ThresholdSchema[]>([])

    //

    const create = async (data: ThresholdCreateSchema) => {
        const url = `/api/config/threshold`
        const res = await api.post<ThresholdSchema>(url, data)
        const parsed = ThresholdSchema.parse(res.data)
        
        const index = thresholds.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) thresholds.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<ThresholdSchema[]>(`/api/config/threshold`)
        const parsed = z.array(ThresholdSchema).parse(res.data)
        thresholds.value = parsed
        return parsed
    }

    const update = async (data: ThresholdUpdateSchema & { id: number }) => {
        const res = await api.patch(`/api/config/threshold/${data.id}`, data)
        const parsed = ThresholdSchema.parse(res.data)

        const index = thresholds.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) thresholds.value.splice(index, 1, parsed)
        return parsed
    }
    
    const destroy = async (id: number) => {
        await api.delete(`/api/config/threshold/${id}`)

        const index = thresholds.value.findIndex((r) => r.id == id)
        if (index != -1) thresholds.value.splice(index, 1)
    }
    
    //

    return {
        thresholds,
        create,
        retrieve,
        update,
        destroy,
    }

})
