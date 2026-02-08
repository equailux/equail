import * as tf from "@tensorflow/tfjs"
import { ref, toRaw } from "vue"

//

export const useEggDetection = () => {
    const model = ref<tf.GraphModel | undefined>()
    const loading = ref(false)

    const load = async () => {
        await tf.setBackend("webgl")
        await tf.ready()

        loading.value = true
        model.value = await tf.loadGraphModel("/model/egg/model.json")
        loading.value = false

        return model.value
    }

    const warmup = async (src = "/egg.jpg") => {
        const image = await new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => res(img)
            img.onerror = rej
            img.src = src
        })

        await predict(image, 0.7)
    }

    /** Runs preprocessing, prediction, and postprocessing to get bboxes. */
    const predict = async (img: ImageData | HTMLImageElement | HTMLCanvasElement | ImageBitmap, threshold = 0.5) => {
        // model must be loaded first
        if (model.value == null) await load();

        // wrap for cleanup
        const prediction: any = tf.tidy(() => {
            const imgTensor = preprocess(img);
            const raw = toRaw(model.value!).execute(imgTensor, "Identity")
            return Array.isArray(raw) ? raw[0] : raw
        })

        // postprocess
        const bboxes = await postprocess(prediction, 0.5, threshold);

        // cleanup
        tf.dispose(prediction)

        return bboxes;
    }

    /** Resizes and normalizes an image. */
    const preprocess = (img: ImageData | HTMLImageElement | HTMLCanvasElement | ImageBitmap) => {
        return tf.tidy(() =>
            tf.browser.fromPixels(img)
                .toFloat()
                .div(255.0)
                .resizeBilinear([640, 640])
                .expandDims(0)
        );
    }

    /** YOLOv26n has prediction vector of [cx, cy, w, h, classes]. */
    const extract = (vector: any) => {
        return tf.tidy(() => {
            // note: not normalized, in range of < 640
            const cx = vector.slice([0, 0], [-1, 1]).squeeze();
            const cy = vector.slice([0, 1], [-1, 1]).squeeze();
            const w = vector.slice([0, 2], [-1, 1]).squeeze();
            const h = vector.slice([0, 3], [-1, 1]).squeeze();

            // 5th el is confidence score
            const objectness = vector.slice([0, 4], [-1, 1]).squeeze();
            return [cx, cy, w, h, objectness];
        })
    }

    /** Filters boxes based on IoU and objectness. */
    const nms = async (boxes: any, scores: any, minIoU: number, minScore: number, maxBoxCount: number) => {
        const indices = await tf.image.nonMaxSuppressionAsync(
            boxes,
            scores,
            maxBoxCount,
            minIoU,
            minScore
        );

        return indices;
    }

    const arrify = async (...tensors: any) => {
        return await Promise.all(tensors.map((t: any) => t.array()));
    }

    /** Use nms indices to find the passed boxes. */
    const classify = (nmsi: any, boxes: any, scores: any) => {
        const result = [];
        
        for (const i of nmsi) {
            // normalize
            const box = {
                x: boxes[i][0] / 640,
                y: boxes[i][1] / 640,
                w: boxes[i][2] / 640,
                h: boxes[i][3] / 640,
            };

            // map class to get string
            const label = "egg";
            const confidence = scores[i]

            result.push({ box, class: label, confidence });
        }

        return result;
    }

    /** Convert a box to x1, y1, x2, y2. */
    const corners = (cx: any, cy: any, w: any, h: any) => {
        return tf.tidy(() => {
            // divide once
            const two = tf.scalar(2);
            const [halfW, halfH] = [w.div(two), h.div(two)];

            // get coordinates
            const x1 = cx.sub(halfW);
            const y1 = cy.sub(halfH);
            const x2 = cx.add(halfW);
            const y2 = cy.add(halfH);

            return [x1, y1, x2, y2];
        })
    }

    /** Combines all processing steps into usable result. */
    const postprocess = async (prediction: any, minIoU = 0.5, minScore = 0.4, maxBoxCount = 100) => {
        // encapsulate for cleanup
        const [boxes, cornerBoxes, objectness] = tf.tidy(() => {
            // convert [1, 300, 6] into [600, 3]
            const raw = prediction.squeeze(0);

            // extract
            const [cx, cy, w, h, objectness] = extract(raw);
            const [x1, y1, x2, y2] = corners(cx, cy, w, h);

            // stack
            const boxes = tf.stack([x1, y1, w, h], 1);
            const cornerBoxes = tf.stack([x1, y1, x2, y2], 1);

            return [boxes, cornerBoxes, objectness];
        })

        // index
        const nmsi = await nms(
            cornerBoxes,
            objectness,
            minIoU,
            minScore,
            maxBoxCount
        );

        // js arrays
        const [nmsiArr, boxesArr, objectnessArr] = await arrify(nmsi, boxes, objectness);

        // cleanup remaining tensors    
        tf.dispose([nmsi, cornerBoxes, boxes, objectness]);

        // result
        return classify(nmsiArr, boxesArr, objectnessArr);
    }

    return { model, loading, load, warmup, predict }
}