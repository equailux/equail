<template>
	<v-layout>
		<v-main>
			<v-container class="h-100 bg-accent" fluid>
				<v-row no-gutters>
					<v-col>
						<div class="w-100 d-flex align-center pa-1 bg-primary rounded">
							<div class="h-100">
								<v-img eager width="60px" :src="`/logo.png`"></v-img>
							</div>
							<h2>Hello, {{ user.user?.name }}</h2>
						</div>
					</v-col>
				</v-row>
				<v-row no-gutters class="pt-2">
					<v-col>
						<div class="w-100 d-flex align-center justify-space-around pa-2 bg-primary rounded">
							<router-link
								to="/app/dashboard"
								class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
								active-class="text-white bg-accent"
								>Dashboard</router-link
							>
							<router-link
								to="/app/controls"
								class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
								active-class="text-white bg-accent"
								>Controls</router-link
							>
							<router-link
								to="/app/analytics/monthly-eggs"
								class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
								active-class="text-white bg-accent"
								>Analytics</router-link
							>
							<router-link
								to="/app/settings"
								class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
								active-class="text-white bg-accent"
								>Settings</router-link
							>
						</div>
					</v-col>
				</v-row>
				<v-row no-gutters class="pt-2">
					<v-col>
						<slot></slot>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user"

//

const user = useUserStore()

//
</script>

<style scoped></style>
