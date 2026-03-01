import useSerializer from "@/composables/use-serializer";
import { UserSafeSchema, type UserSignInSchema, type UserSignUpSchema } from "@/schemas/UserSchema";
import { defineStore } from "pinia";
import { ref } from "vue";
import { z } from "zod";

//

const Schema = z.object({
    user: UserSafeSchema.optional(),
    token: z.string(),
    proxyUrl: z.string(),
})

const { serialize, deserialize } = useSerializer(Schema)

//

export const useApiStore = defineStore("api", () => {
    
    //
    
    const user = ref<UserSafeSchema>()
    const token = ref("")
    const proxyUrl = ref(import.meta.env.VITE_PROXY_URL)

    //
    
    const signIn = async (data: UserSignInSchema) => {
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json" }
        const res = await fetch(`${proxyUrl.value}/auth/sign-in`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json() as { user: UserSafeSchema, token: string }
        
        token.value = json.token
        user.value = UserSafeSchema.parse(json.user)
        return user.value
    }
    
    const signUp = async (data: UserSignUpSchema) => {
        const body = JSON.stringify(data)
        const headers = { "Content-Type": "application/json" }
        const res = await fetch(`${proxyUrl.value}/auth/sign-up`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        
        if (!res.ok) throw new Error(await res.text())
        return UserSafeSchema.parse(await res.json())
    }

    const signOut = async () => {
        user.value = undefined
    }

    //

    return {
        user,
        token,
        proxyUrl,
        signIn,
        signUp,
        signOut,
    }
    
}, { persist: { serialize, deserialize } })