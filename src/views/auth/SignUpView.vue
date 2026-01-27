<template>
    <div style="padding: 32dvw 0 0 0;" class="w-100 d-flex flex-column align-center">
        <span>Create your account</span>
        <v-form class="w-100 d-flex flex-column align-center" @submit.prevent="onSubmitSignUpForm">
            <v-text-field
                class="w-75"
                label="Name"
                v-model="name"
                :disabled="isSubmitting"
                :error-messages="nameError"
            ></v-text-field>
            <v-text-field
                type="email"
                class="w-75"
                label="Email"
                v-model="email"
                :disabled="isSubmitting"
                :error-messages="emailError"
            ></v-text-field>
            <v-text-field
                class="w-75"
                label="Password"
                v-model="password"
                :type="showPasswordType"
                :disabled="isSubmitting"
                :error-messages="passwordError"
                :append-inner-icon="showPasswordIcon"
                @click:append-inner="showPassword = !showPassword"
            ></v-text-field>
            <v-btn
                type="submit"
                text="Sign up"
                class="w-75 my-2" 
                color="light-green-darken-2"
                :loading="isSubmitting"
            ></v-btn>
            <router-link to="/auth/sign-in" class="mt-5 text-decoration-none text-black">
                <span>Already have an account? Log In</span>
            </router-link>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { UserSignUpSchema } from '@/schemas/UserSchema';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

//

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(UserSignUpSchema) })

const { value: name, errorMessage: nameError } = useField<string>("name")
const { value: email, errorMessage: emailError } = useField<string>("email")
const { value: password, errorMessage: passwordError } = useField<string>("password")

const showPassword = ref(false)
const showPasswordType = computed(() => showPassword.value ? "text" : "password")
const showPasswordIcon = computed(() => showPassword.value ? "mdi-eye-off" : "mdi-eye")

const router = useRouter()

//

const onSubmitSignUpForm = handleSubmit(async (values, ctx) => {
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