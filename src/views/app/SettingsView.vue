<template>
    <v-container class="pa-0" fluid>
        <v-row no-gutters>
            <v-col>
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar color="white" class="overflow-visible">
                            <v-img eager src="/icon/notification.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Notification Settings</span>
                    </template>
                    <template #subtitle>
                        <span class="pb-0 text-subtitle-2 font-weight-regular">
                            Configure alerts and notifications
                        </span>
                    </template>
                    <template #text>
                        <div class="d-flex align-center justify-space-between">
                            <span>Push Notifications</span>
                            <v-switch
                                inset
                                hide-details
                                color="light-green-darken-2"
                                density="compact"
                                v-model="allowPushNotifications"
                                @update:model-value="onTogglePushNotifications"
                            ></v-switch>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <span>Low Feed Alerts</span>
                            <v-switch
                                inset
                                hide-details
                                color="light-green-darken-2"
                                density="compact"
                                v-model="allowLowFeedAlerts"
                                @update:model-value="onToggleLowFeedAlerts"
                            ></v-switch>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <span>Low Water Alerts</span>
                            <v-switch
                                inset
                                hide-details
                                color="light-green-darken-2"
                                density="compact"
                                v-model="allowLowWaterAlerts"
                                @update:model-value="onToggleLowWaterAlerts"
                            ></v-switch>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <span>Environment Alerts</span>
                            <v-switch
                                inset
                                hide-details
                                color="light-green-darken-2"
                                density="compact"
                                v-model="allowEnvironmentAlerts"
                                @update:model-value="onToggleEnvironmentAlerts"
                            ></v-switch>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col>
                <v-btn
                    to="/"
                    text="Logout"
                    color="white"
                    class="w-100"
                    prepend-icon="mdi-logout"
                ></v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

//

const allowPushNotifications = ref(true)
const allowLowFeedAlerts = ref(true)
const allowLowWaterAlerts = ref(true)
const allowEnvironmentAlerts = ref(true)

//

const onTogglePushNotifications = async (value: boolean | null) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
}

const onToggleLowFeedAlerts = async (value: boolean | null) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
}

const onToggleLowWaterAlerts = async (value: boolean | null) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
}

const onToggleEnvironmentAlerts = async (value: boolean | null) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000))
}

//

</script>

<style scoped>

</style>