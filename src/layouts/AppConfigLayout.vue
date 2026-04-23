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
			<v-divider></v-divider>
			<v-list>
				<v-list-item
					link
					to="/app/settings"
					title="Settings"
					prepend-icon="mdi-arrow-left"
				></v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list density="compact" nav>
				<v-list-item
					link
					to="/app/config/sensor"
					title="Sensor"
					prepend-icon="mdi-sine-wave"
					@click="page = `Sensor`"
				></v-list-item>
				<v-list-item
					link
					to="/app/config/actuator"
					title="Actuator"
					prepend-icon="mdi-toggle-switch-outline"
					@click="page = `Actuator`"
				></v-list-item>
				<v-list-item
					link
					to="/app/config/threshold"
					title="Threshold"
					prepend-icon="mdi-alert-outline"
					@click="page = `Threshold`"
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
				<span class="font-weight-bold">{{ page ?? "Sensor" }}</span>
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
			<v-btn to="/app/config/sensor" value="Sensor">
                <v-icon>mdi-sine-wave</v-icon>
                <span>Sensor</span>
            </v-btn>
			<v-btn to="/app/config/actuator" value="Actuator">
                <v-icon>mdi-toggle-switch-outline</v-icon>
                <span>Actuator</span>
            </v-btn>
			<v-btn to="/app/config/threshold" value="Threshold">
                <v-icon>mdi-alert-outline</v-icon>
                <span>Threshold</span>
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
const page = ref("Sensor")

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
		if (path == "/app/config/actuator") page.value = "Actuator"
		else if (path == "/app/config/threshold") page.value = "Threshold"
		else page.value = "Sensor"
	},
	{ immediate: true }
)

//
</script>
