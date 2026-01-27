<template>
	<v-app>
		<router-view #="{ Component, route }">
			<AuthLayout v-if="route.meta?.layout === `auth`">
				<component :is="Component"></component>
			</AuthLayout>
		</router-view>
	</v-app>
</template>

<script setup lang="ts">
import AuthLayout from './layouts/AuthLayout.vue';

//
</script>
