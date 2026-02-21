import { MortalitySchema, type MortalityCreateSchema } from "@/schemas/MortalitySchema";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { z } from "zod";

//

const isSameDay = (a: Date, b: Date) => (
    a.getDate() == b.getDate()
    && a.getMonth() == b.getMonth()
    && a.getFullYear() == b.getFullYear()
)

const isSameMonth = (a: Date, b: Date) => (
    a.getMonth() == b.getMonth()
    && a.getFullYear() == b.getFullYear()
)

const serialize = (data: any) => JSON.stringify(data)

const deserialize = (data: string) => {
    const parsed = JSON.parse(data) as { mortalities: MortalitySchema[] }
    const mortalities = z.array(MortalitySchema).parse(parsed.mortalities)
    return { mortalities }
}

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
        await new Promise(res => setTimeout(res, 250))
        const result = {
            ...data,
            id: Math.round(Math.random() * 1000000),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        
        const mortality = mortalities.value.find((m) => isSameDay(m.date, result.date))
        if (mortality) mortality.count += result.count
        else mortalities.value.push(result)
        
        return result
    }
    
    const update = async (data: MortalitySchema) => {
        const idx = mortalities.value.findIndex((m) => m.id == data.id)
        if (idx != -1) mortalities.value.splice(idx, 1, data)
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
        update,
    }

}, { persist: { serializer: { serialize, deserialize } } })