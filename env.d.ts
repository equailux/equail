/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PROXY_URL: string
    readonly VITE_APP_ANDROID_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}