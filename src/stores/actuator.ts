import z from "zod"
import { ref } from "vue"
import { defineStore } from "pinia"
import { ActuatorCreateSchema, ActuatorSchema, ActuatorUpdateSchema } from "@/schemas/ActuatorSchema"
import { api } from "@/plugins/api"

//

export const useActuatorStore = defineStore("actuator", () => {

    //

    const actuators = ref<ActuatorSchema[]>([])

    //

    const create = async (data: ActuatorCreateSchema) => {
        const url = `/api/config/actuator`
        const res = await api.post<ActuatorSchema>(url, data)
        const parsed = ActuatorSchema.parse(res.data)
        
        const index = actuators.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) actuators.value.splice(index, 1, parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<ActuatorSchema[]>(`/api/config/actuator`)
        const parsed = z.array(ActuatorSchema).parse(res.data)
        actuators.value = parsed
        return parsed
    }

    const update = async (data: ActuatorUpdateSchema & { id: number }) => {
        const res = await api.patch(`/api/config/actuator/${data.id}`, data)
        const parsed = ActuatorSchema.parse(res.data)

        const index = actuators.value.findIndex((r) => r.id == parsed.id)
        if (index != -1) actuators.value.splice(index, 1, parsed)
        return parsed
    }
    
    const destroy = async (id: number) => {
        await api.delete(`/api/config/actuator/${id}`)

        const index = actuators.value.findIndex((r) => r.id == id)
        if (index != -1) actuators.value.splice(index, 1)
    }
    
    //

    return {
        actuators,
        create,
        retrieve,
        update,
        destroy,
    }

})
