import z from "zod"
import useSerializer from "@/composables/use-serializer"
import { ref } from "vue"
import { defineStore } from "pinia"
import { useApiStore } from "./api"
import { DetectionSchema } from "@/schemas/DetectionSchema"

//

const Schema = z.object({ detections: z.array(DetectionSchema) })
const { serialize, deserialize } = useSerializer(Schema)

//

export const useDetectionStore = defineStore("detection", () => {

    //

    const detections = ref<DetectionSchema[]>([])

    //

    const retrieve = async () => {
        const { token, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${token}` }

        const res = await fetch(`${proxyUrl}/api/detection`, { method: "POST", headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = z.array(DetectionSchema).parse(json)
        detections.value = parsed
        return parsed
    }
    
    //

    return {
        detections,
        retrieve,
    }

}, { persist: { serialize, deserialize } })