import path from 'path'
export default function getFileExtensions(list: FileList, skips: number[]): string[] {
    const exts: string[] = []
    for(let i = 0; i < list.length; i++) {
        if(!skips.includes(i)) {
            const name = list.item(i)?.name
            exts.push(path.extname(name!).replace(".", ""))
        }
    }
    return exts
}