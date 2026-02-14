<template>
    <div class="w-100 h-100 pt-16 pt-sm-0 d-flex flex-column justify-center align-center">
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