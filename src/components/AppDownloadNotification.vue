<template>
    <div class="pa-2 px-4 bg-white rounded d-flex align-center justify-space-between">
        <span class="font-weight-bold text-light-green-darken-4">Mobile App Available</span>
        <v-btn
            size="small"
            icon="mdi-download"
            color="light-green-darken-2"
            @click="props.onClickDownload"
        ></v-btn>
    </div>
</template>

<script setup lang="ts">

//

const props = defineProps<{ onClickDownload?: () => any }>()

//

</script>

<style scoped>

</style>