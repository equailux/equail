/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins"
import router from "@/router"
import { pinia } from "@/stores"
import "@/plugins/chartjs"

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"

// Styles
import "unfonts.css"

const app = createApp(App)

registerPlugins(app)
app.use(pinia)
app.use(router)

app.mount("#app")
