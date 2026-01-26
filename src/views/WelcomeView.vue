<template>
    <v-container class="fill-height bg-light-green-darken-2 pa-0">
        <v-row class="h-100 d-flex align-end" no-gutters>
            <v-col class="w-100 h-75 bg-white pa-0 d-flex flex-column align-center rounded-t-pill">
                <div class="w-100 d-flex flex-column align-center">
                    <v-img style="margin-top: -30dvw;" class="w-75" :src="`/logo.png`"></v-img>
                    <span>Welcome to</span>
                    <h1 class="font-weight-black text-light-green-darken-2">E-QUAIL</h1>
                    <small>Your smart partner for quail farming!</small>
                    <v-btn class="w-75 mt-10" color="light-green-darken-2" to="/auth/signup">Get Started</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>
.rounded-t-pill {
    border-top-left-radius: 32dvw !important;
    border-top-right-radius: 32dvw !important;
}
</style>