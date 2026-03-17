import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { DetectionSchema } from "@/schemas/DetectionSchema"
import { api } from "@/plugins/api"

//

export const useDetectionStore = defineStore("detection", () => {

    //

    const detections = ref<DetectionSchema[]>([])

    //

    const retrieve = async () => {
        const res = await api.get<DetectionSchema[]>(`/api/capture/detection`)
        const parsed = z.array(DetectionSchema).parse(res.data)
        detections.value = parsed
        return parsed
    }
    
    //

    return {
        detections,
        retrieve,
    }

})