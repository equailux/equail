import z from "zod"
import useSerializer from "@/composables/use-serializer"
import { ref } from "vue"
import { defineStore } from "pinia"
import { useApiStore } from "./api"
import { RemarkCreateSchema, RemarkSchema, RemarkUpdateSchema } from "@/schemas/RemarkSchema"

//

const Schema = z.object({ remarks: z.array(RemarkSchema) })
const { serialize, deserialize } = useSerializer(Schema)

//

export const useRemarkStore = defineStore("remark", () => {

    //

    const remarks = ref<RemarkSchema[]>([])

    //

    const create = async (cid: number, data: RemarkCreateSchema) => {
        const { token, proxyUrl } = useApiStore()
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/capture/${cid}/remark`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = RemarkSchema.parse(json)
        
        const index = remarks.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) remarks.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const { token, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/capture/remark`, { headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = z.array(RemarkSchema).parse(json)
        remarks.value = parsed
        return parsed
    }

    const update = async (cid: number, data: RemarkUpdateSchema) => {
        const { token, proxyUrl } = useApiStore()
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/capture/${cid}/remark`, { method: "PATCH", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())

        const json = await res.json()
        const parsed = RemarkSchema.parse(json)

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

}, { persist: { serialize, deserialize } })