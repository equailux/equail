import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { ActionCreateSchema, ActionSchema, ActionUpdateSchema } from "@/schemas/ActionSchema"
import { api } from "@/plugins/api"

//

export const useActionStore = defineStore("action", () => {

    //

    const actions = ref<ActionSchema[]>([])

    //

    const create = async (data: ActionCreateSchema & { actuatorId: number, thresholdId: number }) => {
        const url = `/api/config/threshold/${data.thresholdId}/action/actuator/${data.actuatorId}`
        const res = await api.post<ActionSchema>(url, data)
        const parsed = ActionSchema.parse(res.data)
        
        const index = actions.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) actions.value.splice(index, 1, parsed)
        else actions.value.unshift(parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<ActionSchema[]>(`/api/config/threshold/action`)
        const parsed = z.array(ActionSchema).parse(res.data)
        actions.value = parsed
        return parsed
    }

    const update = async (data: ActionUpdateSchema & { id: number }) => {
        const res = await api.patch(`/api/config/threshold/action/${data.id}`, data)
        const parsed = ActionSchema.parse(res.data)

        const index = actions.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) actions.value.splice(index, 1, parsed)
        return parsed
    }
    
    const destroy = async (id: number) => {
        await api.delete(`/api/config/threshold/action/${id}`)

        const index = actions.value.findIndex((r) => r.id == id)
        if (index != -1) actions.value.splice(index, 1)
    }
    
    //

    return {
        actions,
        create,
        retrieve,
        update,
        destroy,
    }

})
