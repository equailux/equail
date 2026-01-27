<template>
	<v-app>
		<router-view #="{ Component, route }">
			<AuthLayout v-if="route.meta?.layout === `auth`">
				<component :is="Component"></component>
			</AuthLayout>
			<AppLayout v-else-if="route.meta?.layout === `app`">
				<component :is="Component"></component>
			</AppLayout>
		</router-view>
	</v-app>
</template>

<script setup lang="ts">
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

//
</script>
