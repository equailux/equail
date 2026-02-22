import Dexie from "dexie";
import type { DexiePersistOptions, PiniaPluginContext } from "pinia";

//

const dexie = new Dexie("store") as (Dexie & { store: Dexie.Table<{ key: string, value: string }, string> })
dexie.version(1).stores({ store: "key" })

//

const onDexiePersist = (ctx: PiniaPluginContext) => {
    const persist = ctx.options.persist
    if (persist == undefined || persist == false) return;

    // --- Set defaults
    const options: DexiePersistOptions = persist == true ? {} : persist
    const {
        serialize = (state: unknown) => JSON.stringify(state),
        deserialize = (value: string) => JSON.parse(value),
    } = options

    // --- Retrieve existing stored
    const key = ctx.store.$id
    dexie.store.get(key)
        .then((saved) => saved?.value && deserialize(saved?.value))
        .then((res) => ctx.store.$patch(res))
        .catch(console.error)
    
    // --- Subscribe to mutations
    ctx.store.$subscribe(async (_, state) => await dexie.store.put({ key, value: serialize(state) }))
}

//

export default { dexie, onDexiePersist }
