<template>
    <v-layout>
        <v-main>
            <v-container class="fill-height bg-light-green-darken-2 pa-0">
                <v-row class="h-100 d-flex align-end" no-gutters>
                    <v-col class="w-100 h-75 bg-white pa-0 d-flex flex-column align-center rounded-t-pill">
                        <v-img 
                            eager
                            style="margin-top: -30dvw;" 
                            class="w-75 position-absolute" 
                            :src="`/logo.png`"
                        ></v-img>
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
.rounded-t-pill {
    border-top-left-radius: 32dvw !important;
    border-top-right-radius: 32dvw !important;
}
</style>