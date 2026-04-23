import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { ConditionCreateSchema, ConditionSchema, ConditionUpdateSchema } from "@/schemas/ConditionSchema"
import { api } from "@/plugins/api"

//

export const useConditionStore = defineStore("condition", () => {

    //

    const conditions = ref<ConditionSchema[]>([])

    //

    const create = async (data: ConditionCreateSchema & { thresholdId: number }) => {
        const url = `/api/config/threshold/${data.thresholdId}/condition`
        const res = await api.post<ConditionSchema>(url, data)
        const parsed = ConditionSchema.parse(res.data)
        
        const index = conditions.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) conditions.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<ConditionSchema[]>(`/api/config/threshold/condition`)
        const parsed = z.array(ConditionSchema).parse(res.data)
        conditions.value = parsed
        return parsed
    }

    const update = async (data: ConditionUpdateSchema & { id: number }) => {
        const res = await api.patch(`/api/config/threshold/condition/${data.id}`, data)
        const parsed = ConditionSchema.parse(res.data)

        const index = conditions.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) conditions.value.splice(index, 1, parsed)
        return parsed
    }
    
    const destroy = async (id: number) => {
        await api.delete(`/api/config/threshold/condition/${id}`)

        const index = conditions.value.findIndex((r) => r.id == id)
        if (index != -1) conditions.value.splice(index, 1)
    }
    
    //

    return {
        conditions,
        create,
        retrieve,
        update,
        destroy,
    }

})
