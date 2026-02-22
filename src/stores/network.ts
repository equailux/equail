import { Network, type ConnectionStatus, type ConnectionType } from "@capacitor/network"
import { defineStore } from "pinia"
import { ref } from "vue"

//

export const useNetworkStore = defineStore("network", () => {

    //

    const connected = ref(true)
    const connectionType = ref<ConnectionType>("none")

    //

    const listen = async () => {
        const status = await Network.getStatus();
        [connected.value, connectionType.value] = [status.connected, status.connectionType]
        await Network.addListener("networkStatusChange", callback)
    }
    
    const unlisten = async () => {
        await Network.removeAllListeners()
    }

    const callback = (status: ConnectionStatus) => {
        connected.value = status.connected
        connectionType.value = status.connectionType
    }

    //

    return {
        connected,
        connectionType,
        listen,
        unlisten,
        callback,
    }
})