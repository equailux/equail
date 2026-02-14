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
                <div class="w-100 h-100 px-5 py-10 d-flex flex-column align-start">
                    <h3 class="pb-2">Results</h3>
                    <div class="pr-16 d-flex align-center justify-space-between">
                        <span>Quail Eggs Found:&nbsp;</span>
                        <v-chip color="light-green">{{ detectionEggCount }}</v-chip>
                    </div>
                    <div class="pr-16 d-flex align-center justify-space-between">
                        <span>Avg. Confidence:&nbsp;</span>
                        <v-chip color="light-green">{{ detectionAvgConfidence.toFixed(2) }}%</v-chip>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                        text="Clear"
                        color="red"
                        :loading="detectionLoading"
                        :disabled="!imagePreviewUrl"
                        @click="onClickClear"
                    ></v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ImageBoundingBoxRenderer from '@/components/app/ImageBoundingBoxRenderer.vue';
import useEggDetection from '@/composables/use-egg-detection';
import type { DetectionSchema } from '@/schemas/DetectionSchema';
import { computed, onMounted, ref } from 'vue'

//

// --- Image Upload
const imageFiles = ref<File[]>([])
const imagePreviewUrl = ref("")

const onUploadImageFiles = async (files: File[]) => {
    if (files.length <= 0) return
    if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
    const file = files[0]!
    imagePreviewUrl.value = URL.createObjectURL(file)
    detectFromImageFile(file)
}

// --- Egg Detection
const detections = ref<DetectionSchema[]>([])
const detectionComp = useEggDetection()
const detectionLoading = ref(false)
const detectionEggCount = computed(() => detections.value.length)
const detectionAvgConfidence = computed(() => getAvgDetectionConfidence())

const detectFromImageFile = async (file: File) => {
    detectionLoading.value = true
    await detectionComp.detect(file)
        .then((res) => detections.value = res)
        .catch(console.error)
    detectionLoading.value = false
}

const getAvgDetectionConfidence = () => {
    if (detections.value.length <= 0) return 0
    const total = detections.value.reduce((p, c) => p + c.confidence, 0) || 0
    return total / detections.value.length * 100
}

const onClickClear = () => {
    imageFiles.value = []
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = ""
    detections.value = []
}

//

const onMountedCallback = async () => {
    await fetch("https://equail-api-ai.onrender.com")
        .catch(console.error)
}

onMounted(onMountedCallback)

//

</script>

<style scoped>

</style>