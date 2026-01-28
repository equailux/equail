<template>
    <v-container class="pa-0" fluid>
        <v-row no-gutters>
            <v-col>
                <v-card color="white" elevation="0">
                    <template #prepend>
                        <v-avatar color="white">
                            <v-img eager src="/icon/light-bulb.png"></v-img>
                        </v-avatar>
                    </template>
                    <template #title>
                        <span class="pb-0 text-subtitle-2">Lighting Control</span>
                    </template>
                    <template #subtitle>
                        <span class="pb-0 text-subtitle-2 font-weight-regular">Manage lighting</span>
                    </template>
                    <template #text>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <span class="text-subtitle-2">Lighting Status</span>
                                <br>
                                <span class="text-grey-darken-2 text-subtitle-2 font-weight-regular">Turn On/Off</span>
                            </div>
                            <v-switch
                                inset
                                hide-details
                                color="light-green-darken-2"
                                density="compact"
                                v-model="isLightOn"
                            ></v-switch>
                        </div>
                    </template>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col>
                <v-card color="white" elevation="0">
                    <v-card-title class="text-subtitle-2">About Lighting Control</v-card-title>
                    <v-card-text>
                        <span>Purpose of light:</span>
                        <br>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;Helps quails see food and water.</span>
                        <br>
                        <br>
                        <ul class="px-5">
                            <li>During feeding and drinking times.</li>
                            <li>8-10 hours of light per day.</li>
                            <li>Dim or warm/red light is preferred to reduce stress.</li>
                            <li>Keep the rest of the day dark to allow recovery and minimize movement.</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-2">
            <v-col>
                <v-card color="white" elevation="0">
                    <v-card-title class="text-subtitle-2">Mortality Records</v-card-title>
                    <v-card-text>
                        <QuailDeathCreateForm @submit="onSubmitQuailDeathCreateForm" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import QuailDeathCreateForm from '@/components/app/QuailDeathCreateForm.vue';
import type { QuailDeathCreateSchema } from '@/schemas/QuailDeathSchema';
import type { SubmissionContext } from 'vee-validate';
import { ref } from 'vue';

//

const isLightOn = ref(false)

//

const onSubmitQuailDeathCreateForm = async (
    values: QuailDeathCreateSchema,
    ctx: SubmissionContext<{ [K in keyof QuailDeathCreateSchema]?: unknown }>
) => {
    // --- Temporary while no API
    await new Promise(res => setTimeout(res, 1000)).then(() => ctx.resetForm())
}

//

</script>

<style scoped>

</style>