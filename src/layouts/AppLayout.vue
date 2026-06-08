<template>
	<v-layout class="bg-secondary">
		<v-navigation-drawer
			v-if="!isNative"
			class="bg-primary position-fixed"
			:rail="isTablet"
			:permanent="!isMobile"
			:expand-on-hover="isTablet"
			v-model="isDrawer"
		>
			<template #prepend>
				<v-list>
					<v-list-item
						prepend-icon="mdi-account"
						:title="authStore.user?.name"
						:subtitle="authStore.user?.email"
					></v-list-item>
				</v-list>
			</template>
			<v-list density="compact" nav>
				<v-list-item
					link
					to="/app/dashboard"
					title="Dashboard"
					prepend-icon="mdi-view-dashboard"
					@click="page = `Dashboard`"
				></v-list-item>
				<v-list-item
					link
					to="/app/controls"
					title="Controls"
					prepend-icon="mdi-toggle-switch-outline"
					@click="page = `Controls`"
				></v-list-item>
				<v-list-item
					link
					to="/app/analytics"
					title="Analytics"
					prepend-icon="mdi-chart-line"
					@click="page = `Analytics`"
				></v-list-item>
				<v-list-item
					link
					to="/app/system-error"
					title="System Errors"
					prepend-icon="mdi-alert-circle-outline"
					@click="page = `System Errors`"
				></v-list-item>
				<v-list-item
					link
					to="/app/settings"
					title="Settings"
					prepend-icon="mdi-cog-outline"
					@click="page = `Settings`"
				></v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar class="border-b bg-primary" elevation="0">
			<template #prepend>
				<v-btn
					v-if="!isNative"
					icon="mdi-menu"
					class="text-accent bg-transparent"
					@click="isDrawer = !isDrawer"
				></v-btn>
				<v-img
					src="/logo.png"
					class="ml-4"
					width="48px"
					height="48px"
				></v-img>
			</template>
			<template #title>
				<span class="font-weight-bold">{{ page ?? "Dashboard" }}</span>
			</template>
			<template #append>
				<v-icon 
					class="mr-4"
					:color="network.connected ? 'accent' : 'orange'"
					v-tooltip="network.connected ? 'Online' : 'Offline'"
				>mdi-cloud-{{ !network.connected ? "off-" : "" }}outline</v-icon>
			</template>
		</v-app-bar>
		<v-main>
			<slot></slot>
		</v-main>
		<v-bottom-navigation
			v-if="isNative"
			grow 
            fixed 
            mode="shift"
			color="accent"
			bg-color="primary"
            class="position-fixed bottom-0 left-0" 
			v-model="page"
		>
			<v-btn to="/app/dashboard" value="Dashboard">
                <v-icon>mdi-view-dashboard-outline</v-icon>
                <span>Dashboard</span>
            </v-btn>
            <v-btn to="/app/controls" value="Controls">
                <v-icon>mdi-toggle-switch-outline</v-icon>
                <span>Controls</span>
            </v-btn>
            <v-btn to="/app/analytics" value="Analytics">
                <v-icon>mdi-chart-line</v-icon>
                <span>Analytics</span>
            </v-btn>
			<v-btn to="/app/system-error" value="System Errors">
                <v-icon>mdi-alert-circle-outline</v-icon>
                <span>Errors</span>
            </v-btn>
            <v-btn to="/app/settings" value="Settings">
                <v-icon>mdi-cog-outline</v-icon>
                <span>Settings</span>
            </v-btn>
		</v-bottom-navigation>
	</v-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"
import { useNetworkStore } from "@/stores/network"
import { Capacitor } from "@capacitor/core"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useDisplay } from "vuetify"

//

// --- Utils
const authStore = useAuthStore()
const network = useNetworkStore()
const route = useRoute()

// --- User
const page = ref("Dashboard")

// --- Responsive
const { mdAndDown, smAndDown } = useDisplay()
const isDrawer = ref(!smAndDown.value)
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)
const isNative = Capacitor.isNativePlatform()

//

watch(
	() => route.path,
	path => {
		if (path == "/app/controls") page.value = "Controls"
		else if (path == "/app/analytics") page.value = "Analytics"
		else if (path == "/app/system-error") page.value = "System Errors"
		else if (path == "/app/settings") page.value = "Settings"
		else page.value = "Dashboard"
	},
	{ immediate: true }
)

//

</script>

<style scoped></style>
