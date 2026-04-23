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
					to="/app/config/esp"
					title="Esp"
					prepend-icon="mdi-chip"
					@click="page = `Esp`"
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
			<v-btn to="/app/config/esp" value="Esp">
                <v-icon>mdi-chip-outline</v-icon>
                <span>Esp</span>
            </v-btn>
		</v-bottom-navigation>
	</v-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useNetworkStore } from "@/stores/network";
import { Capacitor } from "@capacitor/core";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

//

// --- Utils
const authStore = useAuthStore()
const network = useNetworkStore()

// --- User
const page = ref("Sensor")

// --- Responsive
const { mdAndDown, smAndDown } = useDisplay()
const isDrawer = ref(!smAndDown.value)
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)
const isNative = Capacitor.isNativePlatform()

//

</script>

<style scoped></style>
