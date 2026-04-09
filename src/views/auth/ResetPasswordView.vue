<template>
	<v-container class="bg-primary fill-height" fluid>
		<v-row dense justify="center">
			<v-col cols="12" sm="6" md="4" lg="3" xl="2">
				<v-sheet class="d-flex flex-column align-center bg-primary" rounded="lg">
					<v-img
						src="/logo.png"
						width="128px"
						height="128px"
					></v-img>
					<h2>E-Quail</h2>
					<small class="text-grey">Set a new password for your account</small>
					<v-alert
						v-if="!resetToken"
						class="w-100 mt-6"
						color="error"
						variant="tonal"
						text="This reset link is invalid or expired."
					></v-alert>
					<UserResetPasswordForm
						class="w-100 mt-8 pt-8 pb-4 bg-primary"
						:disabled="!network.connected || !resetToken"
						@submit="onSubmitResetPasswordForm"
					></UserResetPasswordForm>
					<router-link to="/auth/sign-in" class="mt-5 text-decoration-none text-black">
						<span>
							<small class="text-grey">Remember your password?&nbsp;</small>
							<small class="text-accent">Sign In</small>
						</span>
					</router-link>
				</v-sheet>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import UserResetPasswordForm from "@/components/auth/UserResetPasswordForm.vue"
import router from "@/router"
import type { UserResetPasswordSchema } from "@/schemas/UserSchema"
import { useAuthStore } from "@/stores/auth"
import { useNetworkStore } from "@/stores/network"
import { useToastStore } from "@/stores/toast"
import type { SubmissionContext } from "vee-validate"
import { useRoute } from "vue-router"

//

// --- Utils
const route = useRoute()
const authStore = useAuthStore()
const network = useNetworkStore()
const toastStore = useToastStore()

//

// --- Reset Password
const resetToken = route.query.token as string || ""

const onSubmitResetPasswordForm = async (
	values: UserResetPasswordSchema,
	ctx: SubmissionContext<{ [K in keyof UserResetPasswordSchema]?: unknown }>
) => {
	if (!network.connected) return toastStore.warn("You are offline.")
	if (!resetToken) return toastStore.error("Reset token is missing.")

	await authStore
		.resetPassword(values.password, resetToken)
		.then(() => toastStore.success("Password reset successfully."))
		.then(() => router.push("/auth/sign-in"))
		.catch(error => toastStore.error(error instanceof Error ? error.message : "Unable to reset password."))
}

//

</script>
