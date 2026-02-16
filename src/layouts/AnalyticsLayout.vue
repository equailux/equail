<template>
    <v-layout>
        <v-main>
            <v-container class="h-100 bg-light-green-darken-2" fluid>
                <v-row dense>
                    <v-col>
                        <div class="w-100 d-flex align-center pa-1 bg-white rounded">
                            <div class="h-100">
                                <v-img 
                                    eager 
                                    width="60px"
                                    :src="`/logo.png`"
                                ></v-img>
                            </div>
                            <h2>Hello, {{ user.user?.name }}</h2>
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <div class="w-100 d-flex align-center justify-space-around pa-2 bg-white rounded">
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
                                class="px-2 py-1 rounded text-decoration-none text-white text-subtitle-2 bg-light-green-darken-2"
                                :to="$route.path"
                            >Analytics</router-link>
                            <router-link  
                                to="/app/settings"
                                class="px-2 py-1 rounded text-decoration-none text-black text-subtitle-2"
                                active-class="text-white bg-light-green-darken-2"
                            >Settings</router-link>
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <div class="w-100 d-flex align-center justify-space-around pa-2 bg-white rounded">
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
                <v-row dense>
                    <v-col>
                        <slot></slot>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

//

const user = useUserStore()

//

</script>

<style scoped>

</style>