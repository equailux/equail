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
		<v-snackbar-queue 
			closable 
			color="secondary"
			v-model="toast.messages"
		></v-snackbar-queue>
	</v-app>
</template>

<script setup lang="ts">
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import { useTheme } from 'vuetify';
import { onMounted } from 'vue';
import { useApiStore } from './stores/api';
import { useToastStore } from './stores/toast';

//

// --- Comp/Store
const api = useApiStore()
const theme = useTheme()
const toast = useToastStore()

//

const onMountedCb = () => {
	api.proxyUrl = import.meta.env.VITE_PROXY_URL
	theme.change(localStorage.getItem("theme") ?? "light")
}

onMounted(onMountedCb)

//

</script>
