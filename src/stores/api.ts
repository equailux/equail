import { UserSafeSchema, type UserSignInSchema, type UserSignUpSchema } from "@/schemas/UserSchema";
import { defineStore } from "pinia";
import { ref } from "vue";

//

export const useApiStore = defineStore("api", () => {
    
    //
    
    const apiUrl = ref("")
    const apiKey = ref("")
    const proxyUrl = ref(import.meta.env.VITE_PROXY_URL)

    //
    
    const signIn = async (user: UserSignInSchema) => {
        const body = JSON.stringify(user)
        const headers = { "Content-Type": "application/json" }
        const res = await fetch(`${proxyUrl.value}/auth/sign-in`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json() as { user: UserSafeSchema, url: string, token: string }
        [apiUrl.value, apiKey.value] = [data.url, data.token]
        return UserSafeSchema.parse(data.user)
    }
    
    const signUp = async (user: UserSignUpSchema) => {
        const body = JSON.stringify(user)
        const headers = { "Content-Type": "application/json" }
        const res = await fetch(`${proxyUrl.value}/auth/sign-up`, { method: "POST", body, headers })
            .catch(() => { throw new Error("Something went wrong.") })
        
        if (!res.ok) throw new Error(await res.text())
        return UserSafeSchema.parse(await res.json())
    }

    const signOut = async () => {
        apiUrl.value = ""
        apiKey.value = ""
    }

    //

    return {
        apiUrl,
        apiKey,
        proxyUrl,
        signIn,
        signUp,
        signOut,
    }
}, { persist: true })