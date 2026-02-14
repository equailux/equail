import type { UserSafeSchema } from "@/schemas/UserSchema";
import { defineStore } from "pinia";
import { ref } from "vue";

//

export const useUserStore = defineStore("user", () => {
    const user = ref<UserSafeSchema>()
    return { user }
}, { persist: true })