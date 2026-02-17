import { WsEventQuery, WsEventSchema, type WsEvent, type WsEventHandler, type WsEventOptions } from "@/schemas/WsEventSchema"
import { ref } from "vue"

//

export default () => { 
    
    //

    const ws = ref<WebSocket>()
    const handlers = ref<WsEventOptions<any>[]>([])
    const connected = ref(false)
    const connecting = ref(false)

    //

    const emit = (name: string, query: WsEventQuery, data: any[]) => {
        const event: WsEvent = { name, query, data }
        const payload = JSON.stringify(event)
        if (ws.value) ws.value.send(payload)
    }

    const listen = <T extends object = object>(
        name: string,
        query: WsEventQuery,
        handler: WsEventHandler<T>
    ) => {
        handlers.value.push({ name, query, handler })
    }

    const connect = (url: string) => {
        if (ws.value) ws.value.close()
        
        ws.value = new WebSocket(url)
        ws.value.addEventListener("open", onConnect)
        ws.value.addEventListener("message", onMessage)
        
        connecting.value = true
        connected.value = false
    }

    const disconnect = () => {
        if (ws.value) ws.value.close()
        connecting.value = false
        connected.value = false
    }

    //

    const onConnect = (e: Event) => {
        connecting.value = false
        connected.value = true
    }

    const onMessage = (ev: MessageEvent<any>) => {
        const { data, success } = WsEventSchema.safeParse(ev.data)
        if (!success) return

        for (const { name, query, handler } of handlers.value) {
            if (name != data.name) continue
            if (query != data.query) continue
            handler(data.data as any)
        }
    }

    //

    return { ws, emit, listen, connect, disconnect }
}