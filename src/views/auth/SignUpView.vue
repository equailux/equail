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
                    <small class="text-grey">Sign up for an account</small>
                    <UserSignUpForm
                        class="w-100 mt-8 pt-8 pb-4 border rounded bg-primary elevation-1"
                        @submit="onSubmitSignUpForm"
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
import UserSignUpForm from '@/components/auth/UserSignUpForm.vue';
import type { UserSignUpSchema } from '@/schemas/UserSchema';
import { useApiStore } from '@/stores/api';
import { useUserStore } from '@/stores/user';
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const api = useApiStore()
const user = useUserStore()
const router = useRouter()

//

const onSubmitSignUpForm = async(
    values: UserSignUpSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignUpSchema]?: unknown }>
) => {
    await new Promise(res => setTimeout(res, 1000))
    await router.push("/auth/sign-in")
    user.user = { ...values, id: 0, createdAt: new Date(), updatedAt: new Date() }
    // await api.signUp(values)
    //     .then(async () => await router.push("/auth/sign-in"))
    //     .catch((e) => console.error(e?.message))
}

//

</script>

<style scoped>

</style>