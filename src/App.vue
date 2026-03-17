<template>
	<v-app class="bg-primary">
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

// --- Network
watch(connected, (nv) => toast.show(`Network ${nv ? 'C' : 'Disc'}onnected`, nv ? 'success' : 'warning'))

//

const onMountedCb = async () => {
	theme.change(localStorage.getItem("theme") ?? "light")
	await network.listen()
}

onMounted(onMountedCb)
onUnmounted(network.unlisten)

//

</script>	