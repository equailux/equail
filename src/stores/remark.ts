import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { RemarkCreateSchema, RemarkSchema, RemarkUpdateSchema } from "@/schemas/RemarkSchema"
import { api } from "@/plugins/api"

//

export const useRemarkStore = defineStore("remark", () => {

    //

    const remarks = ref<RemarkSchema[]>([])

    //

    const create = async (cid: number, data: RemarkCreateSchema) => {
        const res = await api.post<RemarkSchema>(`/api/capture/${cid}/remark`, data)
        const parsed = RemarkSchema.parse(res.data)
        
        const index = remarks.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) remarks.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<RemarkSchema[]>(`/api/capture/remark`)
        const parsed = z.array(RemarkSchema).parse(res.data)
        remarks.value = parsed
        return parsed
    }

    const update = async (cid: number, data: RemarkUpdateSchema) => {
        const res = await api.patch(`/api/capture/${cid}/remark`, data)
        const parsed = RemarkSchema.parse(res.data)

        const index = remarks.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) remarks.value.splice(index, 1, parsed)
        return parsed
    }
    
    //

    return {
        remarks,
        create,
        retrieve,
        update,
    }

})
