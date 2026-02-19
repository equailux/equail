<template>
	<v-form class="mt-2 d-flex flex-column align-center" @submit.prevent="onSubmit">
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
		<v-btn type="submit" text="Send Code" class="w-75 my-2 mt-4" color="primary" :loading="isSubmitting"></v-btn>
	</v-form>
</template>

<script setup lang="ts">
import { UserForgotPasswordSchema } from "@/schemas/UserSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { useField, useForm, type SubmissionContext } from "vee-validate"

//

const props = defineProps<{
	onError?: (error: any) => any
	onSubmit?: (
		values: UserForgotPasswordSchema,
		ctx: SubmissionContext<{ [K in keyof UserForgotPasswordSchema]?: unknown }>
	) => any
}>()

const { handleSubmit, isSubmitting } = useForm({ validationSchema: toTypedSchema(UserForgotPasswordSchema) })

const { value: email, errorMessage: emailError } = useField<string>("email")

//

const onSubmit = handleSubmit(async (values, ctx) => {
	await Promise.resolve()
		.then(() => props.onSubmit && props.onSubmit(values, ctx))
		.catch(err => props.onError && props.onError(err))
})

//
</script>

<style scoped></style>
