<template>
    <div class="w-100 h-100 pt-16 pt-sm-0 d-flex flex-column justify-center align-center">
        <span>Login to continue</span>
        <UserSignInForm
            class="w-100"
            @submit="onSubmitSignIn"
        ></UserSignInForm>
    </div>
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