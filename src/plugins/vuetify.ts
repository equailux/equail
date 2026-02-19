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
					accent: "#774826",
					primary: "#fffdfc",
					secondary: "#f1eae5",
				},
			},
			dark: {
				dark: true,
				colors: {
					accent: "#c77a41",
					primary: "#201814",
					secondary: "#17100c",
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
