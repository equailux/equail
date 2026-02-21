import router from "@/router"
import plugins from "@/plugins"
import App from "./App.vue"
import { createApp } from "vue"
import "unfonts.css"

//

const app = createApp(App)

//

plugins.registerPlugins(app)
app.use(router)
app.mount("#app")
