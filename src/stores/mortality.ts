import { api } from "@/plugins/api";
import { MortalitySchema, type MortalityCreateSchema } from "@/schemas/MortalitySchema";
import { isSameDay, isSameMonth } from "date-fns";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { z } from "zod";

//

export const useMortalityStore = defineStore("mortality", () => {

    //

    const mortalities = ref<MortalitySchema[]>([])

    //

    const total = computed(() => mortalities.value.reduce((p, c) => p + c.count, 0))
    const today = computed(() => mortalities.value.filter((m) => isSameDay(m.date, new Date())))
    const sorted = computed(() => [...mortalities.value].sort((a, b) => b.date.getTime() - a.date.getTime()))
    const monthly = computed(() => mortalities.value.filter((m) => isSameMonth(m.date, new Date())))
    
    //

    const create = async (data: MortalityCreateSchema) => {
        const res = await api.post<MortalitySchema[]>(`/api/mortality`, data)
        const parsed = MortalitySchema.parse(res.data)
        mortalities.value.push(parsed)
        return parsed
    }

    const retrieve = async () => {
        const res = await api.get<MortalitySchema[]>(`/api/mortality`)
        const parsed = z.array(MortalitySchema).parse(res.data)
        mortalities.value = parsed
        return parsed
    }
    
    const update = async (data: MortalitySchema) => {
        const res = await api.patch(`/api/mortality/${data.id}`, data)
        const parsed = MortalitySchema.parse(res.data)

        const idx = mortalities.value.findIndex((m) => m.id == data.id)
        if (idx != -1) mortalities.value.splice(idx, 1, parsed)
        return parsed
    }

    const destroy = async (data: MortalitySchema) => {
        const res = await api.delete(`/api/mortality/${data.id}`)
        const idx = mortalities.value.findIndex((m) => m.id == data.id)
        if (idx != -1) mortalities.value.splice(idx, 1)
        return data
    }

    //

    return {
        total,
        today,
        sorted,
        monthly,
        mortalities,
        create,
        retrieve,
        update,
        destroy,
    }

})