import { SimpleDataItem } from "../../types/SimpleData.types.js"
import { hasKey } from "../../exports/helpers.js"

export default function selectKeys(
    data: SimpleDataItem[],
    keys: string[]
): SimpleDataItem[] {
    for (const key of keys) {
        hasKey(data, key)
    }

    const selectedData = []

    for (let i = 0; i < data.length; i++) {
        const obj: SimpleDataItem = {}
        for (const key of keys) {
            obj[key] = data[i][key]
        }
        selectedData.push(obj)
    }

    return selectedData
}
