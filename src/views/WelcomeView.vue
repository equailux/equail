<template>
	<v-container fluid class="fill-height">
		<v-row dense justify="center">
			<v-col cols="12" sm="6" md="4" lg="3" xl="2">
				<div class="w-100 h-100 pt-16 pt-sm-0 d-flex flex-column justify-center align-center">
					<v-img
						src="/logo.png"
						width="128px"
						height="128px"
					></v-img>
					<span class="mt-10 mt-sm-0">Welcome to</span>
					<h1 class="font-weight-black text-accent">E-QUAIL</h1>
					<small>Your smart partner for quail farming!</small>
					<v-btn 
						to="/auth/sign-up"
						class="w-75 mt-10" 
						color="accent" 
					>Get Started</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
