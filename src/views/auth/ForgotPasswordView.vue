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
                    <small class="text-grey">Enter your email to receive reset link.</small>
                    <UserForgotPasswordForm
                        class="w-100 mt-8 pt-8 pb-4 bg-primary"
                        :disabled="!network.connected"
                        @submit="onSubmitForgotPasswordForm"
                    ></UserForgotPasswordForm>
                    <router-link to="/auth/sign-in" class="mt-5 text-decoration-none text-black">
                        <span>
                            <small class="text-grey">Remember your password?&nbsp;</small>
                            <small class="text-accent">Sign In</small>
                        </span>
                    </router-link>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import UserForgotPasswordForm from '@/components/auth/UserForgotPasswordForm.vue';
import type { UserForgotPasswordSchema } from '@/schemas/UserSchema';
import { useAuthStore } from '@/stores/auth';
import { useNetworkStore } from '@/stores/network';
import { useToastStore } from '@/stores/toast';
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

// --- Network
const network = useNetworkStore()

// --- Utils
const authStore = useAuthStore()
const toastStore = useToastStore()

//

const onSubmitForgotPasswordForm = async(
    values: UserForgotPasswordSchema,
    ctx: SubmissionContext<{ [K in keyof UserForgotPasswordSchema]?: unknown }>
) => {
    const callbackUrl = `${window.location.origin}/auth/reset-password`
    await authStore.forgotPassword(values.email, callbackUrl)
    toastStore.info("Please check your email for the reset link.")
}

//

</script>

<style scoped>

</style>