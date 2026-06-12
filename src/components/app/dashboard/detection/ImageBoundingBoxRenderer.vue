<template>
	<div ref="divElement">
		<img
			ref="imageElement"
			style="aspect-ratio: 1; position: absolute; left: -9999px"
			:width="size.width"
			:height="size.height"
		/>
	</div>
</template>

<script setup lang="ts">
import type { DetectionRawSchema } from "@/schemas/DetectionSchema"
import * as PIXI from "pixi.js"
import { onMounted, onUnmounted, reactive, ref, watch } from "vue"

//

type BoundingBoxMode = "view" | "select" | "drag" | "resize" | "draw"
type DetectionId = DetectionRawSchema["id"]
type DetectionBox = DetectionRawSchema["box"]
type CanvasPoint = { x: number, y: number }
type PixelBox = { x: number, y: number, w: number, h: number }
type ResizeHandle = "top-left" | "top-right" | "bottom-right" | "bottom-left"
type ResizeHandlePoint = { handle: ResizeHandle, point: CanvasPoint }
type DragGesture = {
	id: DetectionId
	graphic: PIXI.Graphics
	box: DetectionBox
	lastPoint: CanvasPoint
}
type ResizeGesture = {
	id: DetectionId
	graphic: PIXI.Graphics
	box: DetectionBox
	handle: ResizeHandle
	fixedPoint: CanvasPoint
}
type DrawGesture = {
	startPoint: CanvasPoint
	preview: PIXI.Graphics
}

//

const props = withDefaults(defineProps<{
	src?: string | File | Blob | HTMLImageElement
	detections: DetectionRawSchema[]
	mode?: BoundingBoxMode
	selectedIds?: DetectionId[]
	onDraw?: (canvas: HTMLCanvasElement) => any
	onRender?: (canvas: HTMLCanvasElement) => any
}>(), {
	mode: "view",
	selectedIds: () => [],
})

const emit = defineEmits<{
	"update:selectedIds": [value: DetectionId[]]
	"detection-moved": [value: { id: DetectionId, box: DetectionBox }]
	"detection-resized": [value: { id: DetectionId, box: DetectionBox }]
	"detection-drawn": [value: { box: DetectionBox }]
}>()

//

const divElement = ref<HTMLDivElement>()
const imageElement = ref<HTMLImageElement>()

let observer: ResizeObserver | undefined = undefined
const size = reactive({ width: 320, height: 320 })
const minimumBoxSize = 0.02

let app: PIXI.Application<PIXI.Renderer> | undefined = undefined
let sprite: PIXI.Sprite | undefined = undefined
let texture: PIXI.Texture | undefined = undefined
let graphics: PIXI.Graphics[] = []
const graphicsById = new Map<DetectionId, PIXI.Graphics>()

let imageObjectUrl: string | undefined = undefined
let hoveredDetectionId: DetectionId | undefined = undefined
let dragGesture: DragGesture | undefined = undefined
let resizeGesture: ResizeGesture | undefined = undefined
let drawGesture: DrawGesture | undefined = undefined

//

const init = async () => {
	app = new PIXI.Application()
	await app.init({
		width: size.width,
		height: size.height,
		backgroundAlpha: 0,
		antialias: true,
	})

	if (!divElement.value) return
	divElement.value.appendChild(app.canvas)
	addStageListeners()
	syncStageHitArea()

	observer = new ResizeObserver(onResize)
	observer.observe(divElement.value)
	await draw()
}

const clean = async () => {
	observer?.disconnect()
	cancelGesture()
	removeStageListeners()
	dispose(graphics)
	if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
	app?.destroy(true, { children: true })
}

const draw = async () => {
	if (!app || !imageElement.value) return
	cancelGesture()
	dispose(graphics)
	graphics = []
	graphicsById.clear()

	if (sprite) app.stage.removeChild(sprite)
	if (texture) texture.destroy()
	if (sprite) sprite.destroy()
	sprite = undefined
	texture = undefined

	if (!props.src) return

	imageElement.value.crossOrigin = "anonymous"
	imageElement.value.src = getImageSrc()

	await new Promise<void>((resolve, reject) => {
		if (!imageElement.value) return reject()
		imageElement.value.onload = () => resolve()
		imageElement.value.onerror = () => reject()
	})

	texture = PIXI.Texture.from(imageElement.value)
	sprite = new PIXI.Sprite(texture)
	sprite.width = app.screen.width
	sprite.height = app.screen.height

	app.stage.addChild(sprite)
	props.onDraw?.(app.canvas)
	await render()
}

const render = async () => {
	if (!app || !texture || !texture.source || !props.src) return
	dispose(graphics)
	graphics = []
	graphicsById.clear()

	if (props.detections.length <= 0) return await props.onRender?.(app.canvas)
	for (const detection of props.detections) {
		const g = new PIXI.Graphics()
		drawDetectionGraphic(g, detection.id, detection.box)
		bindDetectionGraphic(g, detection)

		app.stage.addChild(g)
		graphics.push(g)
		graphicsById.set(detection.id, g)
	}

	await props.onRender?.(app.canvas)
}

const dispose = (graphics: PIXI.Graphics[]) => {
	for (const g of graphics) {
		app?.stage.removeChild(g)
		g.destroy()
	}
}

const getImageSrc = () => {
	if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
	imageObjectUrl = undefined

	if (typeof props.src == "string") return props.src
	if (props.src instanceof HTMLImageElement) return props.src.src

	imageObjectUrl = URL.createObjectURL(props.src as File | Blob)
	return imageObjectUrl
}

const addStageListeners = () => {
	if (!app) return
	app.stage.eventMode = "static"
	app.stage.on("pointerdown", onStagePointerDown)
	app.stage.on("globalpointermove", onStagePointerMove)
	app.stage.on("pointerup", onStagePointerUp)
	app.stage.on("pointerupoutside", onStagePointerUp)
}

const removeStageListeners = () => {
	if (!app) return
	app.stage.off("pointerdown", onStagePointerDown)
	app.stage.off("globalpointermove", onStagePointerMove)
	app.stage.off("pointerup", onStagePointerUp)
	app.stage.off("pointerupoutside", onStagePointerUp)
}

const syncStageHitArea = () => {
	if (!app) return
	app.stage.hitArea = new PIXI.Rectangle(0, 0, size.width, size.height)
	syncCanvasCursor()
}

const syncCanvasCursor = () => {
	if (!app) return
	if (dragGesture) app.canvas.style.cursor = "grabbing"
	else if (resizeGesture) app.canvas.style.cursor = "nwse-resize"
	else if (props.mode == "draw") app.canvas.style.cursor = "crosshair"
	else app.canvas.style.cursor = ""
}

const bindDetectionGraphic = (g: PIXI.Graphics, detection: DetectionRawSchema) => {
	if (props.mode == "view" || props.mode == "draw") {
		g.eventMode = "none"
		g.cursor = "default"
		return
	}

	g.eventMode = "static"

	if (props.mode == "select") {
		g.cursor = "pointer"
		g.on("pointertap", event => onDetectionPointerTap(event, detection.id))
		return
	}

	if (props.mode == "drag") {
		g.cursor = "grab"
		g.on("pointerover", () => onDetectionPointerOver(detection.id))
		g.on("pointerout", () => onDetectionPointerOut(detection.id))
		g.on("pointerdown", event => onDetectionPointerDown(event, detection, g))
		return
	}

	if (props.mode == "resize") {
		g.cursor = "nwse-resize"
		g.on("pointerover", () => onDetectionPointerOver(detection.id))
		g.on("pointerout", () => onDetectionPointerOut(detection.id))
		g.on("pointerdown", event => onDetectionResizePointerDown(event, detection, g))
	}
}

const drawDetectionGraphic = (g: PIXI.Graphics, id: DetectionId, box: DetectionBox) => {
	const pixelBox = getDetectionPixelBox(box)
	const { x, y, w, h } = pixelBox
	const isSelected = props.mode == "select" && props.selectedIds.includes(id)
	const isResizing = props.mode == "resize" && resizeGesture?.id == id
	const isHovered = (props.mode == "drag" || props.mode == "resize")
		&& hoveredDetectionId == id
		&& !dragGesture
		&& !resizeGesture
	const hitPadding = props.mode == "resize" ? getResizeHandleSize() : 0
	const hitX = clamp(x - hitPadding, 0, size.width)
	const hitY = clamp(y - hitPadding, 0, size.height)

	g.clear()
	g.hitArea = new PIXI.Rectangle(
		hitX,
		hitY,
		Math.max(0, Math.min(size.width - hitX, w + hitPadding * 2)),
		Math.max(0, Math.min(size.height - hitY, h + hitPadding * 2)),
	)
	g.rect(x, y, w, h)

	if (isSelected) {
		g.fill({ color: 0x2196f3, alpha: 0.12 })
		g.stroke({ width: 3, color: 0x2196f3, alpha: 1 })
		return
	}

	if (props.mode == "resize") {
		g.fill({ color: 0x4caf50, alpha: isHovered || isResizing ? 0.1 : 0.04 })
		g.stroke({ width: 2, color: 0x4caf50, alpha: 1 })
		drawResizeHandles(g, pixelBox)
		return
	}

	if (isHovered) {
		g.fill({ color: 0xff9800, alpha: 0.08 })
		g.stroke({ width: 2, color: 0xff9800, alpha: 1 })
		return
	}

	g.stroke({ width: 2, color: 0xff0000, alpha: 1 })
}

const drawResizeHandles = (g: PIXI.Graphics, box: PixelBox) => {
	const handleSize = getResizeHandleSize()
	const halfHandleSize = handleSize / 2

	for (const { point } of getResizeHandlePoints(box)) {
		g.rect(point.x - halfHandleSize, point.y - halfHandleSize, handleSize, handleSize)
		g.fill({ color: 0xffffff, alpha: 1 })
		g.stroke({ width: 2, color: 0x4caf50, alpha: 1 })
	}
}

const drawPreviewGraphic = (g: PIXI.Graphics, box: PixelBox) => {
	g.clear()
	g.rect(box.x, box.y, box.w, box.h)
	g.fill({ color: 0x2196f3, alpha: 0.08 })
	drawDashedLine(g, box.x, box.y, box.x + box.w, box.y)
	drawDashedLine(g, box.x + box.w, box.y, box.x + box.w, box.y + box.h)
	drawDashedLine(g, box.x + box.w, box.y + box.h, box.x, box.y + box.h)
	drawDashedLine(g, box.x, box.y + box.h, box.x, box.y)
	g.stroke({ width: 2, color: 0x2196f3, alpha: 1 })
}

const drawDashedLine = (g: PIXI.Graphics, x1: number, y1: number, x2: number, y2: number) => {
	const dash = 8
	const gap = 5
	const length = Math.hypot(x2 - x1, y2 - y1)
	if (length <= 0) return

	const dx = (x2 - x1) / length
	const dy = (y2 - y1) / length
	let distance = 0

	while (distance < length) {
		const next = Math.min(distance + dash, length)
		g.moveTo(x1 + dx * distance, y1 + dy * distance)
		g.lineTo(x1 + dx * next, y1 + dy * next)
		distance = next + gap
	}
}

const redrawDetection = (id: DetectionId) => {
	const detection = props.detections.find(d => d.id == id)
	const g = graphicsById.get(id)
	if (!detection || !g) return
	drawDetectionGraphic(g, id, detection.box)
}

const onDetectionPointerTap = (event: PIXI.FederatedPointerEvent, id: DetectionId) => {
	if (props.mode != "select") return
	event.stopPropagation()

	const selected = new Set(props.selectedIds)
	if (selected.has(id)) selected.delete(id)
	else selected.add(id)
	emit("update:selectedIds", [...selected])
}

const onDetectionPointerOver = (id: DetectionId) => {
	if ((props.mode != "drag" && props.mode != "resize") || dragGesture || resizeGesture) return
	hoveredDetectionId = id
	redrawDetection(id)
}

const onDetectionPointerOut = (id: DetectionId) => {
	if (hoveredDetectionId != id || dragGesture || resizeGesture) return
	hoveredDetectionId = undefined
	redrawDetection(id)
}

const onDetectionPointerDown = (
	event: PIXI.FederatedPointerEvent,
	detection: DetectionRawSchema,
	graphic: PIXI.Graphics,
) => {
	if (props.mode != "drag") return
	event.stopPropagation()

	dragGesture = {
		id: detection.id,
		graphic,
		box: { ...detection.box },
		lastPoint: getCanvasPoint(event),
	}

	syncCanvasCursor()
}

const onDetectionResizePointerDown = (
	event: PIXI.FederatedPointerEvent,
	detection: DetectionRawSchema,
	graphic: PIXI.Graphics,
) => {
	if (props.mode != "resize") return
	event.stopPropagation()

	const point = getCanvasPoint(event)
	const handle = getNearestResizeHandle(point, detection.box)
	resizeGesture = {
		id: detection.id,
		graphic,
		box: { ...detection.box },
		handle,
		fixedPoint: getFixedResizePoint(handle, detection.box),
	}

	syncCanvasCursor()
}

const onStagePointerDown = (event: PIXI.FederatedPointerEvent) => {
	if (!app || props.mode != "draw" || dragGesture || resizeGesture || drawGesture) return

	const point = getCanvasPoint(event)
	if (isPointInsideDetection(point)) return

	const preview = new PIXI.Graphics()
	app.stage.addChild(preview)
	drawGesture = { startPoint: point, preview }
	drawPreviewGraphic(preview, { x: point.x, y: point.y, w: 0, h: 0 })
}

const onStagePointerMove = (event: PIXI.FederatedPointerEvent) => {
	if (dragGesture) return moveDragGesture(event)
	if (resizeGesture) return updateResizeGesture(event)
	if (drawGesture) updateDrawGesture(event)
}

const onStagePointerUp = (event: PIXI.FederatedPointerEvent) => {
	if (dragGesture) {
		moveDragGesture(event)
		emit("detection-moved", { id: dragGesture.id, box: { ...dragGesture.box } })
		dragGesture = undefined
		syncCanvasCursor()
		return
	}

	if (resizeGesture) {
		updateResizeGesture(event)
		emit("detection-resized", { id: resizeGesture.id, box: { ...resizeGesture.box } })
		resizeGesture = undefined
		syncCanvasCursor()
		return
	}

	if (!drawGesture) return
	updateDrawGesture(event)

	const pixelBox = getPixelBox(drawGesture.startPoint, getCanvasPoint(event))
	const normalizedBox = normalizePixelBox(pixelBox)
	const preview = drawGesture.preview
	app?.stage.removeChild(preview)
	preview.destroy()
	drawGesture = undefined

	if (normalizedBox.w < 0.02 || normalizedBox.h < 0.02) return
	emit("detection-drawn", { box: normalizedBox })
}

const moveDragGesture = (event: PIXI.FederatedPointerEvent) => {
	if (!dragGesture) return

	const point = getCanvasPoint(event)
	const dx = (point.x - dragGesture.lastPoint.x) / size.width
	const dy = (point.y - dragGesture.lastPoint.y) / size.height
	const maxX = Math.max(0, 1 - dragGesture.box.w)
	const maxY = Math.max(0, 1 - dragGesture.box.h)

	dragGesture.box.x = clamp(dragGesture.box.x + dx, 0, maxX)
	dragGesture.box.y = clamp(dragGesture.box.y + dy, 0, maxY)
	dragGesture.lastPoint = point
	drawDetectionGraphic(dragGesture.graphic, dragGesture.id, dragGesture.box)
}

const updateResizeGesture = (event: PIXI.FederatedPointerEvent) => {
	if (!resizeGesture) return

	const point = getConstrainedResizePoint(
		getCanvasPoint(event),
		resizeGesture.handle,
		resizeGesture.fixedPoint,
	)
	const pixelBox = getPixelBox(resizeGesture.fixedPoint, point)
	resizeGesture.box = normalizePixelBox(pixelBox)
	drawDetectionGraphic(resizeGesture.graphic, resizeGesture.id, resizeGesture.box)
}

const updateDrawGesture = (event: PIXI.FederatedPointerEvent) => {
	if (!drawGesture) return
	drawPreviewGraphic(drawGesture.preview, getPixelBox(drawGesture.startPoint, getCanvasPoint(event)))
}

const cancelGesture = () => {
	if (drawGesture) {
		app?.stage.removeChild(drawGesture.preview)
		drawGesture.preview.destroy()
		drawGesture = undefined
	}

	dragGesture = undefined
	resizeGesture = undefined
	syncCanvasCursor()
}

const getCanvasPoint = (event: PIXI.FederatedPointerEvent): CanvasPoint => {
	if (!app) return { x: 0, y: 0 }
	const point = app.stage.toLocal(event.global)
	return {
		x: clamp(point.x, 0, size.width),
		y: clamp(point.y, 0, size.height),
	}
}

const getPixelBox = (start: CanvasPoint, end: CanvasPoint): PixelBox => ({
	x: Math.min(start.x, end.x),
	y: Math.min(start.y, end.y),
	w: Math.abs(end.x - start.x),
	h: Math.abs(end.y - start.y),
})

const normalizePixelBox = (box: PixelBox): DetectionBox => ({
	x: clamp(box.x / size.width, 0, 1),
	y: clamp(box.y / size.height, 0, 1),
	w: clamp(box.w / size.width, 0, 1),
	h: clamp(box.h / size.height, 0, 1),
})

const getDetectionPixelBox = (box: DetectionBox): PixelBox => ({
	x: box.x * size.width,
	y: box.y * size.height,
	w: box.w * size.width,
	h: box.h * size.height,
})

const getResizeHandleSize = () => clamp(size.width * 0.04, 12, 20)

const getMinimumBoxPixelSize = () => Math.min(size.width, size.height) * minimumBoxSize

const getResizeHandlePoints = (box: PixelBox): ResizeHandlePoint[] => [
	{ handle: "top-left", point: { x: box.x, y: box.y } },
	{ handle: "top-right", point: { x: box.x + box.w, y: box.y } },
	{ handle: "bottom-right", point: { x: box.x + box.w, y: box.y + box.h } },
	{ handle: "bottom-left", point: { x: box.x, y: box.y + box.h } },
]

const getNearestResizeHandle = (point: CanvasPoint, box: DetectionBox): ResizeHandle => {
	const handles = getResizeHandlePoints(getDetectionPixelBox(box))
	let nearest: ResizeHandle = "top-left"
	let nearestDistance = Number.POSITIVE_INFINITY

	for (const handle of handles) {
		const distance = Math.hypot(handle.point.x - point.x, handle.point.y - point.y)
		if (distance >= nearestDistance) continue

		nearest = handle.handle
		nearestDistance = distance
	}

	return nearest
}

const getFixedResizePoint = (handle: ResizeHandle, box: DetectionBox): CanvasPoint => {
	const pixelBox = getDetectionPixelBox(box)

	if (handle == "top-left") return { x: pixelBox.x + pixelBox.w, y: pixelBox.y + pixelBox.h }
	if (handle == "top-right") return { x: pixelBox.x, y: pixelBox.y + pixelBox.h }
	if (handle == "bottom-right") return { x: pixelBox.x, y: pixelBox.y }
	return { x: pixelBox.x + pixelBox.w, y: pixelBox.y }
}

const getConstrainedResizePoint = (
	point: CanvasPoint,
	handle: ResizeHandle,
	fixedPoint: CanvasPoint,
): CanvasPoint => {
	const minSize = getMinimumBoxPixelSize()

	if (handle == "top-left") {
		return {
			x: clamp(point.x, 0, Math.max(0, fixedPoint.x - minSize)),
			y: clamp(point.y, 0, Math.max(0, fixedPoint.y - minSize)),
		}
	}

	if (handle == "top-right") {
		return {
			x: clamp(point.x, Math.min(size.width, fixedPoint.x + minSize), size.width),
			y: clamp(point.y, 0, Math.max(0, fixedPoint.y - minSize)),
		}
	}

	if (handle == "bottom-right") {
		return {
			x: clamp(point.x, Math.min(size.width, fixedPoint.x + minSize), size.width),
			y: clamp(point.y, Math.min(size.height, fixedPoint.y + minSize), size.height),
		}
	}

	return {
		x: clamp(point.x, 0, Math.max(0, fixedPoint.x - minSize)),
		y: clamp(point.y, Math.min(size.height, fixedPoint.y + minSize), size.height),
	}
}

const isPointInsideDetection = (point: CanvasPoint) => props.detections.some(({ box }) => {
	const { x, y, w, h } = getDetectionPixelBox(box)
	return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h
})

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

//

const onResize = async () => {
	if (!app || !divElement.value) return

	const { clientWidth, clientHeight } = divElement.value
	const min = Math.min(clientWidth, clientHeight)
	if (min <= 0) return

	cancelGesture()
	app.renderer.resize(min, min)
	size.width = min
	size.height = min
	syncStageHitArea()
	
	if (sprite) {
		sprite.width = min
		sprite.height = min
		await render()
	}
}

//

watch(() => props.src, draw)
watch(() => props.detections, () => {
	cancelGesture()
	render()
}, { deep: true })
watch(() => props.selectedIds, render, { deep: true })
watch(() => props.mode, () => {
	hoveredDetectionId = undefined
	cancelGesture()
	render()
	syncCanvasCursor()
})

//

onMounted(init)
onUnmounted(clean)

//
</script>

<style scoped></style>
