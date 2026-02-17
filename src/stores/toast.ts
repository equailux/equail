import { defineStore } from "pinia";
import { ref } from "vue";

//

export const useToastStore = defineStore("toast", () => {

    //

    const messages = ref<{ text: string, color: string }[]>([])

    //

    const info = (text: string) => {
        messages.value.push({ text, color: "info" })
    }
    
    const warn = (text: string) => {
        messages.value.push({ text, color: "warning" })
    }
    
    const show = (text: string, color = "info") => {
        messages.value.push({ text, color })
    }

    const error = (text: string) => {
        messages.value.push({ text, color: "error" })
    }
    
    const success = (text: string) => {
        messages.value.push({ text, color: "success" })
    }
    
    //

    return {
        messages,
        info,
        warn,
        show,
        error,
        success,
    }
})
