import type { ZodSchema } from "zod";

//

export default (schema: ZodSchema) => {

    //

    const serialize = (store: any) => {
        return JSON.stringify(store)
    }

    const deserialize = (store: string) => {
        const json = JSON.parse(store)
        const data = schema.parse(json)
        return data
    }

    //

    return { serialize, deserialize }
}