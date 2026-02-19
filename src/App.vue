<template>
	<v-app class="bg-primary">
		<router-view #="{ Component, route }">
			<AuthLayout v-if="route.meta?.layout === `auth`">
				<component :is="Component"></component>
			</AuthLayout>
			<AppLayout v-else-if="route.meta?.layout === `app`">
				<component :is="Component"></component>
			</AppLayout>
			<SettingsLayout v-else-if="route.meta?.layout === `settings`">
				<component :is="Component"></component>
			</SettingsLayout>
			<AnalyticsLayout v-else-if="route.meta?.layout === `analytics`">
				<component :is="Component"></component>
			</AnalyticsLayout>
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
import SettingsLayout from './layouts/SettingsLayout.vue';
import AnalyticsLayout from './layouts/AnalyticsLayout.vue';
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
