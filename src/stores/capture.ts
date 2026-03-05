import z from "zod"
import useSerializer from "@/composables/use-serializer"
import { ref } from "vue"
import { defineStore } from "pinia"
import { useApiStore } from "./api"
import { CaptureSchema } from "@/schemas/CaptureSchema"

//

const Schema = z.object({ captures: z.array(CaptureSchema) })
const { serialize, deserialize } = useSerializer(Schema)

//

export const useCaptureStore = defineStore("capture", () => {

    //

    const captures = ref<CaptureSchema[]>([])

    //

    const retrieve = async () => {
        const { token, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/capture`, { headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = z.array(CaptureSchema).parse(json)
        captures.value = parsed
        return parsed
    }
    
    const destroy = async (data: CaptureSchema) => {
        const { token, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/capture/${data.id}`, { method: "DELETE", headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const index = captures.value.findIndex((c) => c.id == data.id)
        if (index != -1) captures.value.splice(index, 1)
        return data
    }
    
    //

    return {
        captures,
        retrieve,
        destroy,
    }

}, { persist: { serialize, deserialize } })