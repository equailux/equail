<template>
	<v-layout>
		<v-navigation-drawer
		></v-navigation-drawer>
		<v-app-bar class="border-b bg-primary" elevation="0">
			<template #prepend>
				<div 
					class="ml-5 text-accent d-flex align-center justify-center" 
					style="width: 30px; height: 30px"
				>
					<QuailSvg></QuailSvg>
				</div>
			</template>
			<template #title>
				<span class="font-weight-bold">Dashboard</span>
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
            class="position-fixed bottom-0 left-0" 
		>
			<v-btn to="/app/dashboard" value="dashboard">
                <v-icon>mdi-view-dashboard-outline</v-icon>
                <span>Dashboard</span>
            </v-btn>
            <v-btn to="/app/controls" value="controls">
                <v-icon>mdi-toggle-switch-outline</v-icon>
                <span>Controls</span>
            </v-btn>
            <v-btn to="/app/analytics" value="analytics">
                <v-icon>mdi-chart-line</v-icon>
                <span>Analytics</span>
            </v-btn>
            <v-btn to="/app/settings" value="settings">
                <v-icon>mdi-cog-outline</v-icon>
                <span>Settings</span>
            </v-btn>
		</v-bottom-navigation>
	</v-layout>
</template>

<script setup lang="ts">
import QuailSvg from "@/components/QuailSvg.vue";
import { useUserStore } from "@/stores/user"

//

const user = useUserStore()

//
</script>

<style scoped></style>
