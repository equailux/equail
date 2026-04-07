import { createAuthClient } from "better-auth/client"
import type { App } from "vue"

//

const config = { baseURL: `${import.meta.env.VITE_API_URL}/api/auth` }
const auth: ReturnType<typeof createAuthClient<typeof config>> = createAuthClient(config)

const install = (app: App) => {
	app.config.globalProperties.$auth = auth
	app.provide("auth", auth)
}

//

export { auth }
export default { install }
