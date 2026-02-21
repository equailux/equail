<template>
	<v-layout class="bg-secondary">
		<v-app-bar class="border-b bg-primary" elevation="0">
			<template #prepend>
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
		</v-app-bar>
		<v-main>
			<slot></slot>
		</v-main>
		<v-bottom-navigation
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
            <v-btn to="/app/settings" value="Settings">
                <v-icon>mdi-cog-outline</v-icon>
                <span>Settings</span>
            </v-btn>
		</v-bottom-navigation>
	</v-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user"
import { ref } from "vue";

//

const user = useUserStore()
const page = ref("Dashboard")

//

</script>

<style scoped></style>
