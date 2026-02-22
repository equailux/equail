import { createPinia } from 'pinia'
import dexie from "./dexie"

//

const pinia = createPinia()
pinia.use(dexie.onDexiePersist)

//

export default pinia
