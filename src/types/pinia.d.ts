import type { ZodSchema } from "zod"

//

declare module "pinia" {
    
    interface DefineStoreOptionsBase<S, Store> {
        persist?: DexiePersistOptions | boolean
    }
    
    interface DexiePersistOptions {
        serialize?: (state: unknown) => string
        deserialize?: <T = Record<any, any> | ZodSchema>(value: string) => T
    }
}

//

export {}