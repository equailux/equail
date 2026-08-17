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

    // Ask per sensor reading, an unfiltered fetch spends its limit on the
    // water and noise rows and never reaches the recent months.
    const names = ["Temperature", "Humidity"]

    const retrieve = async () => {
        const requests = names.map((n) => api.get<ReadingSchema[]>(`/api/reading?name=${n}&limit=100000`))
        const res = await Promise.all(requests)
        const parsed = z.array(ReadingSchema).parse(res.flatMap((r) => r.data))
        parsed.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
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