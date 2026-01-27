<template>
    <v-container class="fill-height bg-light-green-darken-2 pa-0">
        <v-row class="h-100 d-flex align-end" no-gutters>
            <v-col class="w-100 h-75 bg-white pa-0 d-flex flex-column align-center rounded-t-pill">
                <div class="w-100 d-flex flex-column align-center">
                    <v-img style="margin-top: -30dvw;" class="w-75" :src="`/logo.png`"></v-img>
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
                            <span>Alread have an account? Log In</span>
                        </router-link>
                    </v-form>
                </div>
            </v-col>
        </v-row>
    </v-container>
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
    router.push("/dashboard")
})

//

</script>

<style scoped>
.rounded-t-pill {
    border-top-left-radius: 32dvw !important;
    border-top-right-radius: 32dvw !important;
}
</style>