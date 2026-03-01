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
                        class="w-100 mt-8 pt-8 pb-4 border rounded bg-primary elevation-1"
                        :disabled="!network.connected"
                        @submit="onSubmitSignIn"
                    ></UserSignInForm>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import UserSignInForm from '@/components/auth/UserSignInForm.vue';
import type { UserSignInSchema } from '@/schemas/UserSchema';
import { useApiStore } from '@/stores/api';
import { useNetworkStore } from '@/stores/network';
import { useToastStore } from '@/stores/toast';
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

// --- Network
const network = useNetworkStore()

// --- Api
const api = useApiStore()
const toast = useToastStore()
const router = useRouter()

//

const onSubmitSignIn = async (
    values: UserSignInSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignInSchema]?: unknown }>
) => {
    if (!network.connected) return toast.warn("You are offline.")
    await api.signIn(values)
        .then(() => toast.success("User signed-in successfully."))
        .then(async () => await router.push("/app/dashboard"))
        .catch((e) => toast.error(e?.message))
}

//

</script>

<style scoped>

</style>