/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify"
import "./chartjs"

// Types
import type { App } from "vue"

export function registerPlugins(app: App) {
	app.use(vuetify)
}
