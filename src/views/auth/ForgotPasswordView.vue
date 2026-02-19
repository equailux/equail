<template>
    <v-container class="bg-primary fill-height" fluid>
        <v-row dense>
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                <div class="d-flex flex-column align-center">
                    <div 
                        class="rounded pa-3 bg-accent d-flex align-center justify-center" 
                        style="width: 60px; height: 60px"
                    >
                        <QuailSvg size="36px"></QuailSvg>
                    </div>
                    <h2 class="mt-3">E-Quail</h2>
                    <small class="text-grey">Enter 6-digit code from email</small>
                    <UserForgotPasswordForm
                        class="w-100 mt-8 pt-8 pb-4 border rounded bg-primary elevation-1"
                        @submit="onSubmitForgotPasswordForm"
                    ></UserForgotPasswordForm>
                    <router-link to="/auth/sign-in" class="mt-5 text-decoration-none text-black">
                        <span>
                            <small>Remember your password?&nbsp;</small>
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
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const router = useRouter()

//

const onSubmitForgotPasswordForm = async(
    values: UserForgotPasswordSchema,
    ctx: SubmissionContext<{ [K in keyof UserForgotPasswordSchema]?: unknown }>
) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
    await router.push("/auth/sign-in")
}

//

</script>

<style scoped>

</style>