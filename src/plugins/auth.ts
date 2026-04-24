import { createAuthClient } from "better-auth/client"
import type { App } from "vue"

//

const baseURL = `${import.meta.env.VITE_API_URL}/api/auth`
const fetchOptions = { credentials: "include" as const }
const auth: ReturnType<typeof createAuthClient> = createAuthClient({ baseURL, fetchOptions })

const install = (app: App) => {
	app.config.globalProperties.$auth = auth
	app.provide("auth", auth)
}

//

export { auth }
export default { install }
