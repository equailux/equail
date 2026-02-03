<template>
    <div class="w-100 h-100 pt-16 pt-sm-0 d-flex flex-column justify-center align-center">
        <UserForgotPasswordForm
            class="w-100"
            @submit="onSubmitForgotPasswordForm"
        ></UserForgotPasswordForm>
    </div>
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