import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { SensorCreateSchema, SensorSchema, SensorUpdateSchema } from "@/schemas/SensorSchema"
import { api } from "@/plugins/api"

//

export const useSensorStore = defineStore("sensor", () => {

    //

    const sensors = ref<SensorSchema[]>([])

    //

    const create = async (data: SensorCreateSchema) => {
        const url = `/api/config/sensor`
        const res = await api.post<SensorSchema>(url, data)
        const parsed = SensorSchema.parse(res.data)
        
        const index = sensors.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) sensors.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<SensorSchema[]>(`/api/config/sensor`)
        const parsed = z.array(SensorSchema).parse(res.data)
        sensors.value = parsed
        return parsed
    }

    const update = async (data: SensorUpdateSchema & { id: number }) => {
        const res = await api.patch(`/api/config/sensor/${data.id}`, data)
        const parsed = SensorSchema.parse(res.data)

        const index = sensors.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) sensors.value.splice(index, 1, parsed)
        return parsed
    }
    
    const destroy = async (id: number) => {
        await api.delete(`/api/config/sensor/${id}`)

        const index = sensors.value.findIndex((r) => r.id == id)
        if (index != -1) sensors.value.splice(index, 1)
    }
    
    //

    return {
        sensors,
        create,
        retrieve,
        update,
        destroy,
    }

})
