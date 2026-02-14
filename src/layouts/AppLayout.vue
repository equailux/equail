<template>
    <v-layout>
        <v-main>
            <v-container class="h-100 bg-light-green-darken-2" fluid>
                <v-row no-gutters>
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
                <v-row no-gutters class="pt-2">
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
                                to="/app/analytics/monthly-eggs"
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