import type { App } from "vue"
import vuetify from "./vuetify"
import pinia from "./pinia"
import api from "./api"
import "chart.js/auto"
import auth from "./auth"

//

const registerPlugins = (app: App) => {
	app.use(vuetify)
	app.use(pinia)
	app.use(auth)
	app.use(api)
}

//

export default { registerPlugins }