import toast from './toast'

export default function fileListToBase64(list: FileList, maxSize: number): [string[], number[]] {
    const bases: string[] = []
    const skips: number[] = []

    for(let i = 0; i < list.length; i++) {
        const reader = new FileReader()
        const current = list.item(i) as Blob
        if(current.size > maxSize * 1000000) {
            toast("ERROR", `File ${list.item(i)?.name} exceeds the ${maxSize}mb size limit!`)
            skips.push(i)
        } else {
            reader.readAsDataURL(current)
            reader.addEventListener("load", () => {
                const result = reader.result?.toString().replace(/^data:image\/(png|jpg|gif|jpeg);base64,/, "")
                if(result) bases.push(result)
            })
        }
    }

    return [bases, skips]
}