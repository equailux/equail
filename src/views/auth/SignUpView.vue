<template>
	<v-container class="bg-primary fill-height" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6" md="4" lg="3" xl="2">
				<div class="d-flex flex-column align-center">
					<v-img
						src="/logo.png"
						width="128px"
						height="128px"
					></v-img>
					<h2>E-Quail</h2>
					<small class="text-grey">Create your account to access the dashboard</small>
					<UserSignUpForm
						class="w-100 mt-8 pt-8 pb-4 bg-primary"
						:disabled="!network.connected"
						@submit="onSubmitSignUp"
					></UserSignUpForm>
					<router-link to="/auth/sign-in" class="mt-5 text-decoration-none text-black">
						<span>
							<small class="text-grey">Already have an account?&nbsp;</small>
							<small class="text-accent">Sign In</small>
						</span>
					</router-link>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import UserSignUpForm from "@/components/auth/UserSignUpForm.vue"
import router from "@/router"
import type { UserSignUpSchema } from "@/schemas/UserSchema"
import { useAuthStore } from "@/stores/auth"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import type { SubmissionContext } from "vee-validate"

//

// --- Network
const network = useNetworkStore()

// --- Utils
const authStore = useAuthStore()
const toastStore = useToastStore()

//

// --- Sign Up
const onSubmitSignUp = async (
	values: UserSignUpSchema,
	ctx: SubmissionContext<{ [K in keyof UserSignUpSchema]?: unknown }>
) => {
	if (!network.connected) return toastStore.warn("You are offline.")

	await authStore
		.signUp(values.name, values.email, values.password)
		.then(() => toastStore.success("Account created successfully."))
		.then(() => router.push("/auth/sign-in"))
		.catch(error => toastStore.error(error instanceof Error ? error.message : "Unable to create account."))
}

//
</script>
