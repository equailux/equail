<template>
    <div style="padding: 32dvw 0 0 0;" class="w-100 d-flex flex-column align-center">
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
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const router = useRouter()

//

const onSubmitSignIn = async (
    values: UserSignInSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignInSchema]?: unknown }>
) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
    await router.push("/app/dashboard")
}

//

</script>

<style scoped>

</style>