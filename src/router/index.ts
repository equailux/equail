import { createRouter, createWebHistory } from "vue-router"
import WelcomeView from "@/views/WelcomeView.vue"
import SignUpView from "@/views/SignUpView.vue"

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
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

//

export default router
