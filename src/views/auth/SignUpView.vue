<template>
    <div style="padding: 32dvw 0 0 0;" class="w-100 d-flex flex-column align-center">
        <span>Create your account</span>
        <UserSignUpForm
            class="w-100"
            @submit="onSubmitSignUpForm"
        ></UserSignUpForm>
    </div>
</template>

<script setup lang="ts">
import UserSignUpForm from '@/components/auth/UserSignUpForm.vue';
import type { UserSignUpSchema } from '@/schemas/UserSchema';
import type { SubmissionContext } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const router = useRouter()

//

const onSubmitSignUpForm = async(
    values: UserSignUpSchema,
    ctx: SubmissionContext<{ [K in keyof UserSignUpSchema]?: unknown }>
) => {
    // --- Temporary while no API
    await new Promise((res) => setTimeout(res, 1000))
    await router.push("/auth/sign-in")
}

//

</script>

<style scoped>

</style>