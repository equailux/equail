<template>
	<v-app class="bg-primary">
		<v-progress-linear
			v-if="!alive"
			absolute
			indeterminate
			style="z-index: 999;"
			height="5"
			location="top left"
			:color="!alive ? `orange` : busy ? `red` : ``"
		></v-progress-linear>
		<router-view #="{ Component, route }">
			<component :is="layouts[route.meta?.layout as string] || layouts.default">
				<component :is="Component" />
			</component>
		</router-view>
		<ToastQueue
			closable
			class="position-fixed top-0 right-0 mt-1 mr-1"
			v-model="messages"
		></ToastQueue>
	</v-app>
</template>

<script setup lang="ts">
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import ToastQueue from '@/components/ToastQueue.vue'
import { useTheme } from 'vuetify';
import { onMounted, onUnmounted, watch, type Component } from 'vue';
import { useToastStore } from './stores/toast';
import { storeToRefs } from 'pinia';
import { useNetworkStore } from './stores/network';
import DetectionLayout from './layouts/DetectionLayout.vue';
import { useServerStore } from './stores/server';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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
	"default": AppLayout,
}

// --- Server
const serverStore = useServerStore()
const { busy, alive } = storeToRefs(serverStore)

// --- Network
watch(alive, (nv) => toast.show(`Connect${nv ? `ed` : `ing`} to server.`, nv ? 'success' : 'warning'))
watch(connected, (nv) => toast.show(`Network ${nv ? 'C' : 'Disc'}onnected.`, nv ? 'success' : 'warning'))

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

	// --- Network/Server
	await network.listen()
	await serverStore.connect(import.meta.env.VITE_API_URL)

}

onMounted(onMountedCb)
onUnmounted(network.unlisten)

//

</script>	