import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import type { NavigationGuard } from "vue-router";

//

const refreshAuth: NavigationGuard = async (to, from) => {
    const authStore = useAuthStore()
    await authStore.whoami().catch(() => { })
}

const requireAuth: NavigationGuard = async (to, from) => {
    const toastStore = useToastStore()
    const authStore = useAuthStore()
    
    if (authStore.user !== undefined) return
    if (to.path == "/auth/sign-in") return
    
    toastStore.error("Session expired, kindly login again.")
    return "/auth/sign-in"
}

const redirectAuth: NavigationGuard = async (to, from) => {
    const authStore = useAuthStore()
    if (authStore.user === undefined) return
    
    const path = "/app/dashboard"
    if (to.path != path) return path
}

//

export { refreshAuth, requireAuth, redirectAuth }
