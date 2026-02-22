<template>
	<v-app class="bg-primary">
		<router-view #="{ Component, route }">
			<AuthLayout v-if="route.meta?.layout === `auth`">
				<component :is="Component"></component>
			</AuthLayout>
			<AppLayout v-else-if="route.meta?.layout === `app`">
				<component :is="Component"></component>
			</AppLayout>
			<DashboardLayout v-else-if="route.meta?.layout === `dashboard`">
				<component :is="Component"></component>
			</DashboardLayout>
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
import { onMounted, onUnmounted, watch } from 'vue';
import { useApiStore } from './stores/api';
import { useToastStore } from './stores/toast';
import { storeToRefs } from 'pinia';
import { useNetworkStore } from './stores/network';

//

// --- Comp/Store
const api = useApiStore()
const theme = useTheme()
const toast = useToastStore()
const network = useNetworkStore()
const { messages } = storeToRefs(toast)
const { connected } = storeToRefs(network)

//

watch(connected, (nv) => toast.show(`Network ${nv ? 'C' : 'Disc'}onnected`, nv ? 'success' : 'warning'))

//

const onMountedCb = async () => {
	api.proxyUrl = import.meta.env.VITE_PROXY_URL
	theme.change(localStorage.getItem("theme") ?? "light")
	await network.listen()
}

onMounted(onMountedCb)
onUnmounted(network.unlisten)

//

</script>