import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import WelcomeView from "@/views/WelcomeView.vue"
import SignUpView from "@/views/auth/SignUpView.vue"
import SignInView from "@/views/auth/SignInView.vue"
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue"
import DashboardView from "@/views/app/DashboardView.vue"
import ControlsView from "@/views/app/ControlsView.vue"
import SettingsView from "@/views/app/SettingsView.vue"
import MonthlyEggsView from "@/views/app/analytics/MonthlyEggsView.vue"
import EnvironmentView from "@/views/app/analytics/EnvironmentView.vue"
import FeedUsageView from "@/views/app/analytics/FeedUsageView.vue"
import MortalityView from "@/views/app/analytics/MortalityView.vue"
import EggDetectionView from "@/views/app/EggDetectionView.vue"

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
    {
        path: "/app",
        meta: { layout: "app" },
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: DashboardView,
            },
            {
                path: "controls",
                name: "Controls",
                component: ControlsView,
            },
            {
                path: "settings",
                children: [
                    {
                        path: "",
                        name: "Settings",
                        meta: { layout: "app" },
                        component: SettingsView,
                    },
                    {
                        path: "egg-detection",
                        name: "Egg Detection",
                        meta: { layout: "settings" },
                        component: EggDetectionView,
                    },
                ],
            },
            {
                path: "analytics",
                meta: { layout: "analytics" },
                children: [
                    {
                        path: "monthly-eggs",
                        name: "Monthly Eggs",
                        component: MonthlyEggsView,
                    },
                    {
                        path: "environment",
                        name: "Environment",
                        component: EnvironmentView,
                    },
                    {
                        path: "feed-usage",
                        name: "Feed Usage",
                        component: FeedUsageView,
                    },
                    {
                        path: "mortality",
                        name: "Mortality",
                        component: MortalityView,
                    },
                ],
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
