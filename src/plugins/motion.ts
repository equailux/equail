import type { App } from "vue"
import { MotionPlugin, type Options } from "motion-v"

//

const presets: Record<string, Options> = {
	"motion-pop": {
		initial: { scale: 0.96, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0.98, opacity: 0 },
		transition: { type: "spring", stiffness: 260, damping: 18 },
	},
	"motion-fade": {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-fade-up": {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 10 },
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-fade-down": {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-fade-left": {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 10 },
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-fade-right": {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -10 },
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-slide-up": {
		initial: { y: 40 },
		animate: { y: 0 },
		exit: { y: 20 },
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-slide-down": {
		initial: { y: -40 },
		animate: { y: 0 },
		exit: { y: -20 },
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-slide-left": {
		initial: { x: 40 },
		animate: { x: 0 },
		exit: { x: 20 },
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-slide-right": {
		initial: { x: -40 },
		animate: { x: 0 },
		exit: { x: -20 },
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
	},
	"motion-scale": {
		initial: { opacity: 0, scale: 0.92 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.96 },
		transition: { type: "spring", stiffness: 220, damping: 20, mass: 0.8 },
	},
	"motion-scale-up": {
		initial: { opacity: 0, scale: 0.9, y: 10 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 6 },
		transition: { type: "spring", stiffness: 240, damping: 18 },
	},
	"motion-rotate-left": {
		initial: { opacity: 0, rotate: -12 },
		animate: { opacity: 1, rotate: 0 },
		exit: { opacity: 0, rotate: -6 },
		transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
	},
	"motion-rotate-right": {
		initial: { opacity: 0, rotate: 12 },
		animate: { opacity: 1, rotate: 0 },
		exit: { opacity: 0, rotate: 6 },
		transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
	},
}

const install = (app: App) => {
	app.use(MotionPlugin, { presets })
}

//

export default { install }
