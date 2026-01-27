import { createRouter, createWebHistory } from "vue-router"
import WelcomeView from "@/views/WelcomeView.vue"
import SignUpView from "@/views/SignUpView.vue"
import SignInView from "@/views/SignInView.vue"
import ForgotPasswordView from "@/views/ForgotPasswordView.vue"

//

const routes = [
    {
        path: "/",
        name: "welcome",
        component: WelcomeView,
    },
    {
        path: "/auth",
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
