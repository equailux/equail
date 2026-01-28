<template>
    <v-layout>
        <v-main>
            <v-container class="h-100 bg-light-green-darken-2" fluid>
                <v-row no-gutters>
                    <v-col>
                        <div class="w-100 d-flex align-center pa-1 bg-white rounded">
                            <div class="h-100 w-25">
                                <v-img eager :src="`/logo.png`"></v-img>
                            </div>
                            <h2>Hello, Juan</h2>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters class="pt-2">
                    <v-col>
                        <div class="w-100 d-flex align-center justify-space-between pa-2 bg-white rounded">
                            <router-link  
                                to="/app/dashboard"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Dashboard</router-link>
                            <router-link  
                                to="/app/controls"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Controls</router-link>
                            <router-link  
                                to="/app/analytics"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Analytics</router-link>
                            <router-link  
                                to="/app/settings"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Settings</router-link>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters class="pt-2">
                    <v-col>
                        <div class="w-100 d-flex align-center justify-space-between pa-2 bg-white rounded">
                            <router-link  
                                to="/app/analytics/monthly-eggs"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Monthly Eggs</router-link>
                            <router-link  
                                to="/app/analytics/environment"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Environment</router-link>
                            <router-link  
                                to="/app/analytics/feed-usage"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Feed Usage</router-link>
                            <router-link  
                                to="/app/analytics/mortality"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Mortality</router-link>
                        </div>
                    </v-col>
                </v-row>
                <v-row no-gutters class="pt-2">
                    <v-col>
                        <slot></slot>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>