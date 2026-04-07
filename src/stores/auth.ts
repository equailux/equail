import { defineStore } from "pinia"
import { ref } from "vue"
import { auth } from "@/plugins/auth"
import { UserSafeSchema } from "@/schemas/UserSchema"

//

export const useAuthStore = defineStore("auth", () => {

    //

    const user = ref<UserSafeSchema>()

    //

    const signUp = async (name: string, email: string, password: string) => {
        const ares = await auth.signUp.email({ name, email, password })
        if (ares.error) throw new Error(ares.error.message)
        user.value = ares.data.user
        return ares.data.user
    }

    const signIn = async (email: string, password: string) => {
        const ares = await auth.signIn.email({ email, password })
        if (ares.error) throw new Error(ares.error.message)
        return ares.data.user
    }

    const signInSSO = async () => {
        const ares = await auth.signIn.social({
            provider: "microsoft",
            callbackURL: window.location.href,
            fetchOptions: { credentials: "include" },
        })

        if (ares.error) throw new Error(ares.error.message)
        const sres = await auth.getSession()
        if (sres.error) throw new Error(sres.error.message)
        return sres.data!.user
    }

    const signOut = async () => {
        await auth.signOut()
        user.value = undefined
    }

    //

    return {
        user,
        signUp,
        signIn,
        signInSSO,
        signOut,
    }
}, { persist: true })
