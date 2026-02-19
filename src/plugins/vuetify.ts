/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

// Composables
import { createVuetify } from "vuetify"
import { VDateInput } from "vuetify/labs/VDateInput"
import { VFileUpload } from "vuetify/labs/VFileUpload"

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
	theme: {
		defaultTheme: "light",
		themes: {
			light: {
				dark: false,
				colors: {
					accent: "#36cd83",
					primary: "#ffffff",
					secondary: "#ebfff380",
				},
			},
			dark: {
				dark: true,
				colors: {
					accent: "#36cd83",
					primary: "#1f2937",
					secondary: "#ebfff380",
				},
			},
		},
	},
	components: { VDateInput, VFileUpload },
	defaults: {
		VBtn: {
			class: "text-none",
			color: "accent",
			elevation: 0,
		},
		VTextField: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
		VNumberInput: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
		VSelect: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
		VSwitch: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
		VTextarea: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
		VDateInput: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
			color: "accent",
		},
	},
})
