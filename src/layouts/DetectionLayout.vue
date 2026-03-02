<template>
	<v-layout class="bg-secondary">
		<v-app-bar class="border-b bg-primary" elevation="0">
			<template #prepend>
				<v-btn
					to="/app/dashboard/detection"
					size="small"
					icon="mdi-arrow-left"
					class="ml-4 mr-2"
				></v-btn>
			</template>
			<template #title>
				<span class="font-weight-bold">Back to Detection</span>
			</template>
		</v-app-bar>
		<v-main>
			<slot></slot>
		</v-main>
	</v-layout>
</template>

<script setup lang="ts"></script>

<style scoped></style>
