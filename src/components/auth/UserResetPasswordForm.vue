<template>
	<v-form class="mt-2 d-flex flex-column align-center" @submit.prevent="onSubmitForm">
		<v-text-field
			class="w-75"
			label="New Password"
			v-model="password"
			:type="showPasswordType"
			:disabled="isSubmitting || disabled"
			:error-messages="passwordError"
			:append-inner-icon="showPasswordIcon"
			@click:append-inner="showPassword = !showPassword"
		></v-text-field>
		<v-text-field
			class="w-75"
			label="Confirm Password"
			v-model="confirm"
			:type="showConfirmType"
			:disabled="isSubmitting || disabled"
			:error-messages="confirmError"
			:append-inner-icon="showConfirmIcon"
			@click:append-inner="showConfirm = !showConfirm"
		></v-text-field>
		<v-btn
			type="submit"
			text="Reset Password"
			class="w-75 my-2 mt-4"
			color="accent"
			:disabled="disabled"
			:loading="isSubmitting"
		></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import { UserResetPasswordSchema } from "@/schemas/UserSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"
import { computed, ref } from "vue"

//

const props = defineProps<{
	disabled?: boolean
	onError?: (error: unknown) => unknown
	onSubmit?: (
		values: UserResetPasswordSchema,
		ctx: SubmissionContext<{ [K in keyof UserResetPasswordSchema]?: unknown }>
	) => unknown
}>()

//

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: toTypedSchema(UserResetPasswordSchema),
})

const { value: password, errorMessage: passwordError } = useField<string>("password")
const { value: confirm, errorMessage: confirmError } = useField<string>("confirm")

const showPassword = ref(false)
const showConfirm = ref(false)

//

const showPasswordType = computed(() => (showPassword.value ? "text" : "password"))
const showPasswordIcon = computed(() => (showPassword.value ? "mdi-eye-off" : "mdi-eye"))
const showConfirmType = computed(() => (showConfirm.value ? "text" : "password"))
const showConfirmIcon = computed(() => (showConfirm.value ? "mdi-eye-off" : "mdi-eye"))

const onSubmitForm = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => props.onSubmit && props.onSubmit(values, ctx))
		.catch(err => props.onError && props.onError(err))
})

//
</script>
