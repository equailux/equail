<template>
	<v-app class="bg-primary" :style="appStyle">
		<v-progress-linear
			v-if="!alive"
			absolute
			indeterminate
			style="z-index: 999;"
			:style="{ marginTop: `var(--safe-area-top)` }"
			height="5"
			location="top left"
			:color="!alive ? `orange` : busy ? `red` : ``"
		></v-progress-linear>
		<router-view #="{ Component, route }">
			<component :is="layouts[route.meta?.layout as string] || layouts.default">
				<component 
					:is="Component" 
				></component>
			</component>
		</router-view>
		<ToastQueue
			closable
			class="position-fixed top-0 right-0 mt-1 mr-1"
			v-model="messages"
			:style="{ marginTop: `var(--safe-area-top)` }"
		></ToastQueue>
	</v-app>
</template>

<script setup lang="ts">
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import ToastQueue from '@/components/ToastQueue.vue'
import { useTheme } from 'vuetify';
import { computed, onMounted, onUnmounted, ref, watch, type Component } from 'vue';
import { useToastStore } from './stores/toast';
import { storeToRefs } from 'pinia';
import { useNetworkStore } from './stores/network';
import DetectionLayout from './layouts/DetectionLayout.vue';
import { useServerStore } from './stores/server';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SafeArea, type SafeAreaInsets } from "capacitor-plugin-safe-area"
import AppConfigLayout from './layouts/AppConfigLayout.vue';

//

// --- Comp/Store
const theme = useTheme()
const toast = useToastStore()
const network = useNetworkStore()
const { messages } = storeToRefs(toast)
const { connected } = storeToRefs(network)

// --- Layouts
const layouts: Record<string, Component> = {
	"auth": AuthLayout,
	"app": AppLayout,
	"dashboard": DashboardLayout,
	"detection": DetectionLayout,
	"app/config": AppConfigLayout,
	"default": AppLayout,
}

// --- Server
const serverStore = useServerStore()
const { busy, alive } = storeToRefs(serverStore)

// --- Network
watch(alive, (nv) => toast.show(`Connect${nv ? `ed` : `ing`} to server.`, nv ? 'success' : 'warning'))
watch(connected, (nv) => toast.show(`Network ${nv ? 'C' : 'Disc'}onnected.`, nv ? 'success' : 'warning'))

// --- Top Status Bar Fallback
const native = Capacitor.isNativePlatform()
const safeArea = ref<SafeAreaInsets>()
const paddingT = computed(() => safeArea.value ? `${safeArea.value.insets.top}px` : "env(safe-area-inset-top)")
const paddingB = computed(() => safeArea.value ? `${safeArea.value.insets.bottom}px` : "env(safe-area-inset-bottom)")
const appStyle = computed(() => native ? { '--safe-area-top': paddingT.value, '--safe-area-bottom': paddingB.value } : {})

//

const onMountedCb = async () => {
	// --- Theme
	const savedTheme = localStorage.getItem("theme") ?? "light"
	theme.change(savedTheme)

	// --- Status Bar
	const native = Capacitor.isNativePlatform()
	if (native) StatusBar.setBackgroundColor({ color: "#00000000" })
	if (native) StatusBar.setOverlaysWebView({ overlay: true })
	if (native) StatusBar.setStyle({ style: savedTheme == "dark" ? Style.Dark : Style.Light })
	safeArea.value = await SafeArea.getSafeAreaInsets()

	// --- Network/Server
	await network.listen()
	await serverStore.connect(import.meta.env.VITE_API_URL)

}

onMounted(onMountedCb)
onUnmounted(network.unlisten)

//

</script>

<style>
.v-app-bar {
	padding-top: var(--safe-area-top) !important;
	height: calc(64px + var(--safe-area-top, 0px)) !important;
}
.v-bottom-navigation {
	padding-bottom: var(--safe-area-bottom) !important;
	height: calc(56px + var(--safe-area-bottom, 0px)) !important;
}
.v-main {
	--v-layout-top: calc(64px + var(--safe-area-top, 0px)) !important;
	--v-layout-bottom: calc(56px + var(--safe-area-bottom, 0px)) !important;
}
</style>	