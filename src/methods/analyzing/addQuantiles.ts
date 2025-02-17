import { SimpleDataItem } from "../../types/SimpleData.types.js"
import { range } from "d3-array"
import { scaleQuantile } from "d3-scale"
import { hasKey, checkTypeOfKey } from "../../exports/helpers.js"

export default function addQuantiles(
    data: SimpleDataItem[],
    key: string,
    newKey: string,
    nbQuantiles: number,
    nbTestedValues = 10000,
    verbose = false
): SimpleDataItem[] {
    hasKey(data, key)

    hasKey(data, newKey, true)
    if (nbQuantiles < 1) {
        throw new Error("nbQuantiles should always be > 0.")
    }
    checkTypeOfKey(data, key, "number", 1, nbTestedValues, verbose)

    const quantileGenerator = scaleQuantile()
        .domain(data.map((d) => d[key] as number))
        .range(range(1, nbQuantiles + 1))

    for (let i = 0; i < data.length; i++) {
        const value = data[i][key] as number
        const quantile = quantileGenerator(value)
        data[i][newKey] = quantile
    }

    return data
}
