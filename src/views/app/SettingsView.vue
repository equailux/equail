<template>
	<v-container class="bg-secondary" fluid>
		<v-row dense>
			<v-col cols="12" sm="8">
				<div class="pb-4">
					<small class="text-accent">Preferences</small>
					<h3>Settings</h3>
				</div>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12" sm="6">
				<div class="border rounded-lg elevation-1 overflow-hidden">
					<div class="pa-2 px-4 border-b">
						<h5 class="text-grey-darken-1">NOTIFICATIONS</h5>
					</div>
					<div class="pa-4 d-flex flex-column ">
						<div class="d-flex align-center ga-3">
							<div 
								class="pa-4 rounded-lg d-flex align-center justify-center"
								style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
							>
								<v-icon color="accent">mdi-alert-outline</v-icon>
							</div>
							<div class="w-50">
								<h5>Threshold Alerts</h5>
								<small class="text-grey-darken-1 text-caption">
									Get warned on exceeding readings
								</small>
							</div>
							<v-spacer></v-spacer>
							<v-switch
								inset
								hide-details
								color="accent"
								base-color="accent"
								:disabled="!network.connected"
							></v-switch>
						</div>
					</div>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="border rounded-lg elevation-1 overflow-hidden">
					<div class="pa-2 px-4 border-b">
						<h5 class="text-grey-darken-1">APPEARANCE</h5>
					</div>
					<div class="pa-4 d-flex flex-column ">
						<div class="d-flex align-center ga-3">
							<div 
								class="pa-4 rounded-lg d-flex align-center justify-center"
								style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
							>
								<v-icon color="accent">mdi-weather-night</v-icon>
							</div>
							<div class="w-50">
								<h5>Dark Mode</h5>
								<small class="text-grey-darken-1 text-caption">
									Switch between light and dark themes
								</small>
							</div>
							<v-spacer></v-spacer>
							<v-switch
								inset
								hide-details
								color="accent"
								base-color="accent"
								:model-value="theme == `dark`"
								@update:model-value="onToggleTheme"
							></v-switch>
						</div>
					</div>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="border rounded-lg elevation-1 overflow-hidden">
					<div class="pa-2 px-4 border-b">
						<h5 class="text-grey-darken-1">CONFIGURATIONS</h5>
					</div>
					<div class="pa-4 d-flex flex-column ">
						<div class="d-flex align-center ga-3">
							<div 
								class="pa-4 rounded-lg d-flex align-center justify-center"
								style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
							>
								<v-icon color="accent">mdi-code-tags</v-icon>
							</div>
							<div class="w-50">
								<h5>Dev Mode</h5>
								<small class="text-grey-darken-1 text-caption">
									Configure devices and thresholds
								</small>
							</div>
							<v-spacer></v-spacer>
							<v-switch
								inset
								hide-details
								color="accent"
								base-color="accent"
								v-model="devMode"
							></v-switch>
						</div>
						<div v-if="devMode" class="pt-5 d-flex flex-column ">
							<v-btn
								to="/app/config/sensor"
								text="Configure"
								color="primary"
								class="w-100"
								append-icon="mdi-wrench"
							></v-btn>
						</div>
					</div>
				</div>
			</v-col>
			<v-col cols="12" sm="6">
				<div class="border rounded-lg elevation-1 overflow-hidden">
					<div class="pa-2 px-4 border-b">
						<h5 class="text-grey-darken-1">ACTIONS</h5>
					</div>
					<div class="pa-4 d-flex flex-column ">
						<div v-if="!isNative" class="d-flex align-center ga-3">
							<div 
								class="pa-4 rounded-lg d-flex align-center justify-center"
								style="width: 38px; height: 38px; background-color: rgba(var(--v-theme-accent), 0.1)"
							>
								<v-icon color="accent">mdi-android</v-icon>
							</div>
							<div class="w-50">
								<h5>Android App</h5>
								<small class="text-grey-darken-1 text-caption">
									Get mobile app.
								</small>
							</div>
							<v-spacer></v-spacer>
							<v-btn
								size="small"
								icon="mdi-download-outline"
								color="accent"
								:disabled="!network.connected"
								@click="onClickDownloadAndroidApp"
							></v-btn>
						</div>
						<div class="pt-5">
							<v-btn
								to="/auth/sign-in"
								text="Logout"
								color="primary"
								class="w-100"
								append-icon="mdi-logout"
								@click="authStore.signOut()"
							></v-btn>
						</div>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useNetworkStore } from '@/stores/network';
import { Capacitor } from '@capacitor/core';
import { onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';

//

// --- Utils
const network = useNetworkStore()
const isNative = Capacitor.isNativePlatform()
const authStore = useAuthStore()

// --- Theme
const theme = ref("light")
const themeComp = useTheme()

const onToggleTheme = (v: unknown) => {
	const newTheme = !!v ? "dark" : "light"
	themeComp.change(newTheme)
	localStorage.setItem("theme", newTheme)
	theme.value = newTheme
}

// --- Configuration
const devMode = ref(false)

// --- Mobile App
const appAndroidUrl = import.meta.env.VITE_APP_ANDROID_URL

const onClickDownloadAndroidApp = () => {
	window.location.href = appAndroidUrl
}

//

const onMountedCb = () => {
	theme.value = localStorage.getItem("theme") ?? "light"
}

onMounted(onMountedCb)

//

</script>

<style scoped></style>
