import { z } from "zod"
import { DetectionSchema } from "@/schemas/DetectionSchema"

//

export default () => {

    //

    const apiUrl = import.meta.env.VITE_AI_API_URL

    //

    const detect = async (image: File) => {
        const form = new FormData()
        form.append("file", image)

        const url = `${apiUrl}/api/model/egg/predict`
        const res = await fetch(url, { method: "POST", body: form })
            .catch(() => { throw new Error("Something went wrong.") })
        
        if (!res.ok) throw new Error(await res.text())
        const payload = await res.json()
        
        const { data, error, success } = z.array(DetectionSchema).safeParse(payload)
        if (!success) throw new Error(error.issues[0]!.message)
        return data
    }

    //

    return { apiUrl, detect }
}