import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import WelcomeView from "@/views/WelcomeView.vue"
import SignUpView from "@/views/auth/SignUpView.vue"
import SignInView from "@/views/auth/SignInView.vue"
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue"

//

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "welcome",
        meta: { layout: "auth" },
        component: WelcomeView,
    },
    {
        path: "/auth",
        meta: { layout: "auth" },
        children: [
            {
                path: "sign-up",
                name: "Sign Up",
                component: SignUpView,
            },
            {
                path: "sign-in",
                name: "Sign In",
                component: SignInView,
            },
            {
                path: "forgot-password",
                name: "Forgot Password",
                component: ForgotPasswordView,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

//

export default router
