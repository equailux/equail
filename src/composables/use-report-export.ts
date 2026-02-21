import { Filesystem, Directory } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"
import { Capacitor } from "@capacitor/core"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

//

export default () => {

    //

    const exportPDF = async (el: HTMLElement, filename: string) => {
        const pdf = await generatePDF(el)
        if (!Capacitor.isNativePlatform()) await downloadPDF(pdf, filename)
        else await downloadPDFApp(pdf, filename)
    }

    const generatePDF = async (el: HTMLElement) => {
        // --- Create A4 report
        const pdf = new jsPDF({
            orientation: "p",
            unit: "px",
            format: "a4",
            hotfixes: ["px_scaling"],
        })

        // --- 96px = 1inch
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        // --- Create canvas of the element
        const canvas = await html2canvas(el, {
            useCORS: true,
            width: el.scrollWidth,
            height: el.scrollHeight,
        })

        // --- Convert canvas to image in ratio
        const imgData = canvas.toDataURL("image/png")
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // --- Record increments
        let heightLeft = imgHeight
        let heightUsed = 0

        // --- Slice the first part of the image
        pdf.addImage(imgData, "PNG", 0, heightUsed, imgWidth, imgHeight)
        heightLeft -= pdfHeight

        // --- Pull up the image
        while (heightLeft > 0) {
            heightUsed -= pdfHeight
            pdf.addPage()
            pdf.addImage(imgData, "PNG", 0, heightUsed, imgWidth, imgHeight)
            heightLeft -= pdfHeight
        }

        return pdf
    }

    const downloadPDF = async (pdf: jsPDF, filename: string) => {
        await pdf.save(filename, { returnPromise: true })
    }

    const downloadPDFApp = async (pdf: jsPDF, filename: string) => {
        // --- Get base64
        const base64 = pdf.output('datauristring').split(',')[1]!

        // --- Save to filesystem
        await Filesystem.writeFile({
            path: filename,
            data: base64,
            directory: Directory.Cache,
        })

        // --- Get reference
        const fileUri = await Filesystem.getUri({
            path: filename,
            directory: Directory.Cache,
        })

        // --- Open native share sheet (Save to Files, Drive, etc.)
        await Share.share({
            title: 'Download Report',
            url: fileUri.uri,
            dialogTitle: 'Save or Share Report',
        })
    }

    //

    return {
        exportPDF,
        generatePDF,
        downloadPDF,
        downloadPDFApp,
    }
}