import { ref } from "vue"

//

export default () => {
    
    //

    const messages = ref<{ text: string, color: string }[]>([])

    //

    const add = (text: string, color = "info") => {
        messages.value.push({ text, color })
    }

    //

    return { messages, add }
}