<template>
    <v-container class="pa-0" fluid>
        <v-row no-gutters>
            <v-col>
                <v-card color="white" elevation="0">
                    <v-card-title class="pb-0 text-subtitle-1">Today's Summary</v-card-title>
                    <v-card-subtitle class="text-subtitle-2">Real-time overview of quail farm</v-card-subtitle>
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between">
                            <div class="w-50 d-flex align-center ga-2">
                                <div class="h-100 w-33">
                                    <v-img eager src="/icon/boiled-egg.png"></v-img>
                                </div>
                                <div class="h-100 w-66">
                                    <span>Eggs Today</span>
                                    <br>
                                    <span class="text-h5">{{ eggsToday }}</span>
                                </div>
                            </div>
                            <div class="w-50 d-flex align-center ga-2">
                                <div class="h-100 w-33">
                                    <v-img eager src="/icon/light-bulb.png"></v-img>
                                </div>
                                <div class="h-100 w-66">
                                    <span>Lighting</span>
                                    <br>
                                    <v-switch
                                        inset
                                        hide-details
                                        color="light-green-darken-2"
                                        density="compact"
                                        v-model="isLightOn"
                                    ></v-switch>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col cols="6" class="pr-1 pb-1">
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar size="small" color="white">
                            <v-img eager src="/icon/thermometer.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Temperature</span>
                        <br>
                        <span class="text-h5">{{ temperature }}°C</span>
                    </template>
                    <template #text>
                        <div class="text-end">
                            <span class="pa-1 bg-light-green-darken-2 text-white rounded">Optimal</span>
                        </div>
                    </template>
                </v-card>
            </v-col>
            <v-col cols="6" class="pl-1 pb-1">
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar size="small" color="white">
                            <v-img eager src="/icon/humidity.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Humidity</span>
                        <br>
                        <span class="text-h5">{{ humidity }}%</span>
                    </template>
                    <template #text>
                        <div class="text-end">
                            <span class="pa-1 bg-light-green-darken-2 text-white rounded">Optimal</span>
                        </div>
                    </template>
                </v-card>
            </v-col>
            <v-col cols="6" class="pt-1 pr-1">
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar size="small" color="white" class="overflow-visible">
                            <v-img eager src="/icon/death.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Mortality Rate</span>
                        <br>
                        <span class="text-h5">{{ mortalityRate }}</span>
                    </template>
                    <template #text>
                        <div class="text-end">
                            <span class="pa-1 text-white rounded"></span>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col>
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar size="small" color="white" class="overflow-visible">
                            <v-img eager src="/icon/feed.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Feed Level</span>
                    </template>
                    <template #text>
                        <v-slider 
                            readonly 
                            hide-details
                            color="light-green-darken-2" 
                            v-model="feedLevel"
                        ></v-slider>
                        <div class="px-2 d-flex align-center justify-space-between">
                            <span>{{ feedLevel }}%</span>
                            <div class="text-end">
                                <span class="pa-1 bg-light-green-darken-2 text-white rounded">Good</span>
                            </div>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col>
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar size="small" color="white" class="overflow-visible">
                            <v-img eager src="/icon/sea-level.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Water Level</span>
                    </template>
                    <template #text>
                        <v-slider 
                            readonly 
                            hide-details
                            color="light-green-darken-2" 
                            v-model="waterLevel"
                        ></v-slider>
                        <div class="px-2 d-flex align-center justify-space-between">
                            <span>{{ waterLevel }}%</span>
                            <div class="text-end">
                                <span class="pa-1 bg-light-green-darken-2 text-white rounded">Good</span>
                            </div>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';


//

const eggsToday = ref(15)
const isLightOn = ref(false)
const temperature = ref(25.9)
const humidity = ref(65)
const mortalityRate = ref(10)
const feedLevel = ref(70)
const waterLevel = ref(80)

//

</script>

<style scoped>

</style>