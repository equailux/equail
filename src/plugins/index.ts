import type { App } from "vue"
import vuetify from "./vuetify"
import pinia from "./pinia"
import "chart.js/auto"

//

const registerPlugins = (app: App) => {
	app.use(vuetify)
	app.use(pinia)
}

//

export default { registerPlugins }