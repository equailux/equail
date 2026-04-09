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
                    <small class="text-grey">Sign in to your dashboard</small>
                    <UserSignInForm
                        class="w-100 mt-8 pt-8 pb-4 bg-primary"
                        :disabled="!network.connected"
                        @submit="onSubmitSignIn"
                    ></UserSignInForm>
                    <router-link to="/auth/sign-up" class="mt-1 text-decoration-none text-black">
                        <span>
                            <small class="text-grey">Need an account?&nbsp;</small>
                            <small class="text-accent">Sign Up</small>
                        </span>
                    </router-link>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import UserSignInForm from '@/components/auth/UserSignInForm.vue';
import router from '@/router';
import type { UserSignInSchema } from '@/schemas/UserSchema';
import { useAuthStore } from '@/stores/auth';
import { useNetworkStore } from '@/stores/network';
import { useToastStore } from '@/stores/toast';
import type { SubmissionContext } from 'vee-validate';

//

// --- Network
const network = useNetworkStore()

// --- Utils
const toastCmp = useToastStore()
const authStore = useAuthStore()

//

const onSubmitSignIn = async (
    values: UserSignInSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignInSchema]?: unknown }>
) => {
    if (!network.connected) return toastCmp.warn("You are offline.")
    const { email, password } = values
    await authStore
        .signIn(email, password)
        .then(() => toastCmp.success("User signed-in successfully."))
        .then(() => router.push("/app/dashboard"))
        .catch((e) => toastCmp.error(e?.message))
}

//

</script>

<style scoped>

</style>
