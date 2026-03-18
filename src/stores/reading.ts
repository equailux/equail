import z from "zod"
import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { ReadingSchema } from "@/schemas/ReadingSchema"
import { api } from "@/plugins/api"

//

export const useReadingStore = defineStore("reading", () => {

    //

    const readings = ref<ReadingSchema[]>([])
    const temperatures = computed(() => readings.value.filter((r) => r.name.startsWith("Temp")))
    const humidities = computed(() => readings.value.filter((r) => r.name.startsWith("Humid")))

    //

    const retrieve = async () => {
        const res = await api.get<ReadingSchema[]>("/api/reading?limit=10000")
        const parsed = z.array(ReadingSchema).parse(res.data)
        readings.value = parsed
        return parsed
    }

    //

    return {
        readings,
        temperatures,
        humidities,
        retrieve,
    }

})