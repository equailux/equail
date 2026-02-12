<template>
    <v-container class="pa-0" fluid>
        <v-row no-gutters align="center">
            <v-col cols="2">
                <v-btn
                    to="/app/settings"
                    size="small"
                    icon="mdi-arrow-left"
                    class="bg-white"
                ></v-btn>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-5">
            <v-col cols="12" class="text-center">
                <h2>Quail Egg Detection</h2>
                <span class="text-grey">Upload an image to count quail eggs.</span>
            </v-col>
        </v-row>
        <v-row no-gutters class="pt-5">
            <v-col cols="12" sm="6">
                <div class="w-100 h-100 d-flex align-center justify-center">
                    <v-file-upload
                        v-if="!imageFiles.length"
                        color="light-green-lighten-5"
                        label="Upload Image"
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        v-model="imageFiles"
                        :multiple="false"
                        @update:model-value="onUploadImageFiles"
                    ></v-file-upload>
                    <ImageBoundingBoxRenderer
                        v-show="imagePreviewUrl"
                        :src="imagePreviewUrl"
                        :detections="detections"
                    ></ImageBoundingBoxRenderer>
                </div>
            </v-col>
            <v-col cols="12" sm="6">
                <div class="w-100 h-100 px-5 py-10">
                    <h3 class="pb-2">Results</h3>
                    <div class="pr-16 d-flex align-center justify-space-between">
                        <span>Quail Eggs Found:&nbsp;</span>
                        <v-chip color="light-green">{{ 0 }}</v-chip>
                    </div>
                    <div class="pr-16 d-flex align-center justify-space-between">
                        <span>Avg. Confidence:&nbsp;</span>
                        <v-chip color="light-green">{{ 0 }}%</v-chip>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ImageBoundingBoxRenderer from '@/components/app/ImageBoundingBoxRenderer.vue';
import useEggDetection from '@/composables/use-egg-detection';
import type { DetectionSchema } from '@/schemas/DetectionSchema';
import { onMounted, ref } from 'vue'

//

// --- Image Upload
const imageFiles = ref<File[]>([])
const imagePreviewUrl = ref("")

const onUploadImageFiles = async (files: File[]) => {
    if (files.length <= 0) return
    const file = files[0]!
    imagePreviewUrl.value = URL.createObjectURL(file)
    detectFromImageFile(file)
}

// --- Egg Detection
const detections = ref<DetectionSchema[]>([])
const detectionComp = useEggDetection()

const detectFromImageFile = async (file: File) => {
    await detectionComp.detect(file)
        .then((res) => detections.value = res)
        .catch(console.error)
}

//

const onMountedCallback = async () => {
    // --- Wake Up ML Server
    await fetch("https://equail-api-ai.onrender.com")
        .catch(console.error)
}

onMounted(onMountedCallback)

//

</script>

<style scoped>

</style>