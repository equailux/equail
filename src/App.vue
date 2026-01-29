<template>
	<v-app>
		<router-view #="{ Component, route }">
			<Motion 
				as-child
				:initial="{ opacity: 0, transform: `translateY(-10dvh)` }"
				:animate="{ opacity: 1, transform: `translateY(0)` }"
				:transition="{ type: `spring` }"
			>
				<AppDownloadNotification 
					v-if="mustRecommendAppDownload"
					class="mt-2 position-absolute top-0"
					style="width: 96dvw; left: 2dvw; z-index: 9999"
					@click-download="onClickDownload" 
				/>
			</Motion>
			<AuthLayout v-if="route.meta?.layout === `auth`">
				<component :is="Component"></component>
			</AuthLayout>
			<AppLayout v-else-if="route.meta?.layout === `app`">
				<component :is="Component"></component>
			</AppLayout>
			<AnalyticsLayout v-else-if="route.meta?.layout === `analytics`">
				<component :is="Component"></component>
			</AnalyticsLayout>
		</router-view>
	</v-app>
</template>

<script setup lang="ts">
import AppDownloadNotification from './components/AppDownloadNotification.vue';
import AnalyticsLayout from './layouts/AnalyticsLayout.vue';
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import { useAppStore } from './stores/app';
import { Motion } from "motion-v"
//

const app = useAppStore()
const { isWeb, isDownloaded, lastTimeDownloadAsked } = app
const mustRecommendAppDownload = isWeb && !isDownloaded && Date.now() - lastTimeDownloadAsked > 60000

//

const onClickDownload = async () => {
	app.isDownloaded = true
	window.location.href = "/app/download/equail.apk"
}

//

</script>
