<template>
    <v-container class="bg-primary fill-height" fluid>
        <v-row dense justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                <div class="d-flex flex-column align-center">
                    <div 
                        class="rounded pa-3 bg-accent d-flex align-center justify-center" 
                        style="width: 60px; height: 60px"
                    >
                        <QuailSvg size="36px"></QuailSvg>
                    </div>
                    <h2 class="mt-3">E-Quail</h2>
                    <small class="text-grey">Sign in to your dashboard</small>
                    <UserSignInForm
                        class="w-100 mt-8 pt-8 pb-4 border rounded bg-primary elevation-1"
                        @submit="onSubmitSignIn"
                    ></UserSignInForm>
                    <router-link to="/auth/sign-up" class="mt-5 text-decoration-none text-black">
                        <span>
                            <small class="text-grey">Don't have an account?&nbsp;</small>
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
import type { UserSignInSchema } from '@/schemas/UserSchema';
import { useApiStore } from '@/stores/api';
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const api = useApiStore()
const router = useRouter()

//

const onSubmitSignIn = async (
    values: UserSignInSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignInSchema]?: unknown }>
) => {
    await new Promise(res => setTimeout(res, 1000))
    await router.push("/app/dashboard")
    // await api.signIn(values)
    //     .then(async () => await router.push("/app/dashboard"))
    //     .catch((e) => console.info(e?.message))
}

//

</script>

<style scoped>

</style>