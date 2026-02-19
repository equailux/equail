<template>
	<v-layout>
		<v-main>
			<v-container class="h-100 pa-0" fluid>
				<v-row class="h-100" no-gutters>
					<v-col cols="12" class="d-flex justify-center bg-accent">
						<div class="w-50 h-100 d-none d-sm-flex align-center justify-center">
							<div class="d-flex align-center justify-center">
								<v-img eager width="250px" :src="`/logo.png`"></v-img>
							</div>
						</div>
						<div class="w-100 w-sm-50 h-100 bg-accent d-flex flex-column space-between border">
							<div class="w-100 h-25 h-sm-0 d-flex justify-center">
								<v-img
									eager
									width="250px"
									class="mt-8 d-sm-none position-absolute"
									:src="`/logo.png`"
								></v-img>
							</div>
							<div class="h-75 h-sm-100 bg-primary pa-0 d-flex flex-column align-center sheet">
								<slot></slot>
							</div>
						</div>
					</v-col>
				</v-row>
			</v-container>
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
