import { Capacitor } from "@capacitor/core";
import { defineStore } from "pinia";
import { ref } from "vue";

//

export const useAppStore = defineStore("app", () => {
    const isWeb = Capacitor.getPlatform() == "web"
    const isDownloaded = ref(false)
    const lastTimeDownloadAsked = ref(0)
    return { isWeb, isDownloaded, lastTimeDownloadAsked }
}, { persist: true })