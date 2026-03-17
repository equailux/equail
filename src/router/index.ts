import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { App, type BackButtonListener, type StateChangeListener } from "@capacitor/app"
import WelcomeView from "@/views/WelcomeView.vue"
import SignInView from "@/views/auth/SignInView.vue"
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue"
import DashboardView from "@/views/app/DashboardView.vue"
import ControlsView from "@/views/app/ControlsView.vue"
import SettingsView from "@/views/app/SettingsView.vue"
import AnalyticsView from "@/views/app/AnalyticsView.vue"
import DetectionView from "@/views/app/dashboard/DetectionView.vue"
import MortalityView from "@/views/app/dashboard/MortalityView.vue"
import DetectionPreviewView from "@/views/app/dashboard/detection/DetectionPreviewView.vue"
import { redirect404 } from "@/middlewares/404.middleware"

//

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "welcome",
        meta: { layout: "auth" },
        component: WelcomeView,
    },
    {
        path: "/auth/sign-in",
        name: "Sign In",
        meta: { layout: "auth" },
        component: SignInView,
    },
    {
        path: "/auth/forgot-password",
        name: "Forgot Password",
        meta: { layout: "auth" },
        component: ForgotPasswordView,
    },
    {
        path: "/app/dashboard",
        name: "Dashboard",
        meta: { layout: "app" },
        component: DashboardView,
    },
    {
        path: "/app/dashboard/detection",
        name: "Detection",
        meta: { layout: "dashboard" },
        component: DetectionView,
    },
    {
        path: "/app/dashboard/detection/:cid(\\d+)",
        name: "Detection Preview",
        meta: { layout: "detection" },
        component: DetectionPreviewView,
    },
    {
        path: "/app/dashboard/mortality",
        name: "Mortality",
        meta: { layout: "dashboard" },
        component: MortalityView,
    },
    {
        path: "/app/controls",
        name: "Controls",
        meta: { layout: "app" },
        component: ControlsView,
    },
    {
        path: "/app/settings",
        name: "Settings",
        meta: { layout: "app" },
        component: SettingsView,
    },
    {
        path: "/app/analytics",
        name: "Analytics",
        meta: { layout: "app" },
        component: AnalyticsView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: "404",
        redirect: "/",
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// router.beforeEach(redirect404(router))

const onClickBackButton: BackButtonListener = async (event) => {
    if (event.canGoBack) router.back()
    else await App.exitApp()
}

App.addListener("backButton", onClickBackButton)

//

export default router
