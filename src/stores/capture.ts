import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { CaptureSchema } from "@/schemas/CaptureSchema"
import { api } from "@/plugins/api"

//

export const useCaptureStore = defineStore("capture", () => {

    //

    const captures = ref<CaptureSchema[]>([])

    //

    const retrieve = async () => {
        const res = await api.get<CaptureSchema[]>("/api/capture")
        const parsed = z.array(CaptureSchema).parse(res.data)
        captures.value = parsed
        return parsed
    }
    
    const destroy = async (data: CaptureSchema) => {
        await api.delete(`/api/capture/${data.id}`)
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

})