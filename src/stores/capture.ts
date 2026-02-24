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
        const { apiKey, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${apiKey}` }

        const res = await fetch(`${proxyUrl}/api/capture`, { method: "POST", headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = z.array(CaptureSchema).parse(json)
        captures.value = parsed
        return parsed
    }
    
    //

    return {
        captures,
        retrieve,
    }

}, { persist: { serialize, deserialize } })