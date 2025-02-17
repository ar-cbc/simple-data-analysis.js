import { SimpleDataItem, SimpleDataValue } from "../../types/SimpleData.types"
import { pairs } from "d3-array"
import { hasKey, checkTypeOfKey } from "../../exports/helpers.js"

export default function addVariation(
    data: SimpleDataItem[],
    key: string,
    newKey: string,
    valueGenerator: (a: SimpleDataValue, b: SimpleDataValue) => SimpleDataValue,
    order: "ascending" | "descending" | undefined = undefined,
    firstValue: SimpleDataValue = undefined,
    nbTestedValues = 10000,
    verbose = false
) {
    hasKey(data, key)
    hasKey(data, newKey, true)
    checkTypeOfKey(data, key, "number", 1, nbTestedValues, verbose)

    if (order === "ascending") {
        data.sort((a, b) => ((a[key] as number) < (b[key] as number) ? -1 : 1))
    } else if (order === "descending") {
        data.sort((a, b) => ((a[key] as number) < (b[key] as number) ? 1 : -1))
    } else if (order !== undefined) {
        throw new Error(
            "Unknown order " +
                order +
                ". It must be 'ascending', 'descending' or undefined if you don't want to sort the data before calculating the variation."
        )
    }

    const pairedData = pairs(data, (a, b) => valueGenerator(a[key], b[key]))

    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            data[i][newKey] = firstValue
        } else {
            data[i][newKey] = pairedData[i - 1]
        }
    }

    return data
}
