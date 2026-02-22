import useSerializer from "@/composables/use-serializer";
import { MortalitySchema, type MortalityCreateSchema } from "@/schemas/MortalitySchema";
import { isSameDay, isSameMonth } from "date-fns";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { z } from "zod";
import { useApiStore } from "./api";

//

const Schema = z.object({ mortalities: z.array(MortalitySchema) })
const { serialize, deserialize } = useSerializer(Schema)

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
        const { apiKey, proxyUrl } = useApiStore()
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }
        
        const res = await fetch(`${proxyUrl}/api/mortality`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = MortalitySchema.parse(json)
        mortalities.value.push(parsed)
        return parsed
    }

    const retrieve = async () => {
        const { apiKey, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${apiKey}` }

        const res = await fetch(`${proxyUrl}/api/mortality`, { method: "POST", headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())
        
        const json = await res.json()
        const parsed = z.array(MortalitySchema).parse(json)
        mortalities.value = parsed
        return parsed
    }
    
    const update = async (data: MortalitySchema) => {
        const { apiKey, proxyUrl } = useApiStore()
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }

        const res = await fetch(`${proxyUrl}/api/mortality/${data.id}`, { method: "PATCH", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())

        const json = await res.json()
        const parsed = MortalitySchema.parse(json)
        
        const idx = mortalities.value.findIndex((m) => m.id == data.id)
        if (idx != -1) mortalities.value.splice(idx, 1, parsed)
        return parsed
    }

    const destroy = async (data: MortalitySchema) => {
        const { apiKey, proxyUrl } = useApiStore()
        const headers = { "Authorization": `Bearer ${apiKey}` }

        const res = await fetch(`${proxyUrl}/api/mortality/${data.id}`, { method: "DELETE", headers })
            .catch(() => { throw new Error("Something went wrong.") })
        if (!res.ok) throw new Error(await res.text())

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

}, { persist: { serialize, deserialize } })