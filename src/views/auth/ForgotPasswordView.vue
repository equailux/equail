<template>
    <div style="padding: 32dvw 0 0 0;" class="w-100 d-flex flex-column align-center">
        <v-form 
            class="w-100 mt-2 d-flex flex-column align-center" 
            @submit.prevent="onSubmitForgotPasswordForm"
        >
            <v-text-field
                type="email"
                class="w-75"
                label="Email"
                v-model="email"
                :disabled="isSubmitting"
                :error-messages="emailError"
            ></v-text-field>
            <small class="w-75 text-grey">
                Enter your username, then input the 6-digit code to received via email to login.
            </small>
            <v-btn
                type="submit"
                text="Send Code"
                class="w-75 my-2 mt-4" 
                color="light-green-darken-2"
                :loading="isSubmitting"
            ></v-btn>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { UserForgotPasswordSchema } from '@/schemas/UserSchema';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

//

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(UserForgotPasswordSchema) })

const { value: email, errorMessage: emailError } = useField<string>("email")

const router = useRouter()

//

const onSubmitForgotPasswordForm = handleSubmit(async (values, ctx) => {
    // --- Temporary while no API
    await new Promise((res) => setTimeout(res, 1000))
    router.push("/auth/sign-in")
})

//

</script>

<style scoped>
.rounded-t-pill {
    border-top-left-radius: 32dvw !important;
    border-top-right-radius: 32dvw !important;
}
</style>