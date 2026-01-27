<template>
    <v-container class="fill-height bg-light-green-darken-2 pa-0">
        <v-row class="h-100 d-flex align-end" no-gutters>
            <v-col class="w-100 h-75 bg-white pa-0 d-flex flex-column align-center rounded-t-pill">
                <div class="w-100 d-flex flex-column align-center">
                    <v-img style="margin-top: -30dvw;" class="w-75" :src="`/logo.png`"></v-img>
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
            </v-col>
        </v-row>
    </v-container>
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