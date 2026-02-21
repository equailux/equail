import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import { VDateInput } from "vuetify/labs/VDateInput"
import { VFileUpload } from "vuetify/labs/VFileUpload"

//

export default createVuetify({
	theme: {
		defaultTheme: "light",
		themes: {
			light: {
				dark: false,
				colors: {
					accent: "#679e36",
					primary: "#fafaf9",
					secondary: "#ece9e4",
				},
			},
			dark: {
				dark: true,
				colors: {
					accent: "#7bb640",
					primary: "#1a1918",
					secondary: "#2a2725",
				},
			},
		},
	},
	components: { VDateInput, VFileUpload },
	defaults: {
		VBtn: {
			class: "text-none",
			elevation: 0,
		},
		VTextField: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
		VNumberInput: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
		VSelect: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
		VSwitch: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
		VTextarea: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
		VDateInput: {
			variant: "outlined",
			density: "compact",
			class: "mt-1",
		},
	},
})
