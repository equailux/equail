<template>
    <v-container class="pa-0" fluid>
        <v-row no-gutters>
            <v-col>
                <v-card color="white" elevation="0">
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Monthly Egg Production</span>
                    </template>
                    <template #subtitle>
                        <span class="pb-0 text-subtitle-2 font-weight-regular">
                            Total Eggs Production per month
                        </span>
                    </template>
                    <template #text>
                        <MonthlyEggProductionChart 
                            class="w-100"
                            :eggs-per-month
                        ></MonthlyEggProductionChart>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import MonthlyEggProductionChart from '@/components/app/analytics/MonthlyEggProductionChart.vue';
import { reactive } from 'vue';

//

const eggsPerMonth = reactive<Record<string, number>>({
    "January": 8,
    "February": 13,
    "March": 17,
    "April": 20,
})

//

</script>

<style scoped>

</style>