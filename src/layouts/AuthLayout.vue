<template>
	<v-layout>
		<v-main>
			<slot></slot>
		</v-main>
	</v-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.sheet {
	border-top-left-radius: 32dvw;
	border-top-right-radius: 32dvw;
}

@media (min-width: 768px) {
	.sheet {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
}
</style>
