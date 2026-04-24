import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { App, type BackButtonListener, type StateChangeListener } from "@capacitor/app"
import WelcomeView from "@/views/WelcomeView.vue"
import SignUpView from "@/views/auth/SignUpView.vue"
import SignInView from "@/views/auth/SignInView.vue"
import ForgotPasswordView from "@/views/auth/ForgotPasswordView.vue"
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue"
import DashboardView from "@/views/app/DashboardView.vue"
import ControlsView from "@/views/app/ControlsView.vue"
import SettingsView from "@/views/app/SettingsView.vue"
import AnalyticsView from "@/views/app/AnalyticsView.vue"
import DetectionView from "@/views/app/dashboard/DetectionView.vue"
import MortalityView from "@/views/app/dashboard/MortalityView.vue"
import DetectionPreviewView from "@/views/app/dashboard/detection/DetectionPreviewView.vue"
import { redirect404 } from "@/middlewares/404.middleware"
import ActuatorView from "@/views/app/config/ActuatorView.vue"
import SensorView from "@/views/app/config/SensorView.vue"
import ThresholdView from "@/views/app/config/ThresholdView.vue"
import ConditionView from "@/views/app/config/ConditionView.vue"
import ActionView from "@/views/app/config/ActionView.vue"
import { redirectAuth, refreshAuth, requireAuth } from "@/middlewares/auth.middleware"

//

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "welcome",
        meta: { layout: "auth" },
        component: WelcomeView,
    },
    {
        path: "/auth/sign-up",
        name: "Sign Up",
        meta: { layout: "auth" },
        component: SignUpView,
        beforeEnter: [refreshAuth, redirectAuth],
    },
    {
        path: "/auth/sign-in",
        name: "Sign In",
        meta: { layout: "auth" },
        component: SignInView,
        beforeEnter: [refreshAuth, redirectAuth],
    },
    {
        path: "/auth/forgot-password",
        name: "Forgot Password",
        meta: { layout: "auth" },
        component: ForgotPasswordView,
        beforeEnter: [refreshAuth, redirectAuth],
    },
    {
        path: "/auth/reset-password",
        name: "Reset Password",
        meta: { layout: "auth" },
        component: ResetPasswordView,
        beforeEnter: [refreshAuth, redirectAuth],
    },
    {
        path: "/app/dashboard",
        name: "Dashboard",
        meta: { layout: "app" },
        component: DashboardView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/dashboard/detection",
        name: "Detection",
        meta: { layout: "dashboard" },
        component: DetectionView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/dashboard/detection/:cid(\\d+)",
        name: "Detection Preview",
        meta: { layout: "detection" },
        component: DetectionPreviewView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/dashboard/mortality",
        name: "Mortality",
        meta: { layout: "dashboard" },
        component: MortalityView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/controls",
        name: "Controls",
        meta: { layout: "app" },
        component: ControlsView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/settings",
        name: "Settings",
        meta: { layout: "app" },
        component: SettingsView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/analytics",
        name: "Analytics",
        meta: { layout: "app" },
        component: AnalyticsView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/config/actuator",
        name: "Config Actuator",
        meta: { layout: "app/config" },
        component: ActuatorView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/config/sensor",
        name: "Config Sensor",
        meta: { layout: "app/config" },
        component: SensorView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/config/threshold",
        name: "Config Threshold",
        meta: { layout: "app/config" },
        component: ThresholdView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/config/condition",
        name: "Config Condition",
        meta: { layout: "app/config" },
        component: ConditionView,
        beforeEnter: [refreshAuth, requireAuth],
    },
    {
        path: "/app/config/action",
        name: "Config Action",
        meta: { layout: "app/config" },
        component: ActionView,
        beforeEnter: [refreshAuth, requireAuth],
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
