import { SimpleDataItem } from "../../types/SimpleData.types.js"
import { quantile, extent } from "d3-array"
import {
    hasKey,
    checkTypeOfKey,
    log,
    toPercentage,
} from "../../exports/helpers.js"

export default function addOutliers(
    data: SimpleDataItem[],
    key: string,
    newKey: string,
    nbTestedValues = 10000,
    verbose = false
): SimpleDataItem[] {
    hasKey(data, key)
    hasKey(data, newKey, true)
    checkTypeOfKey(data, key, "number", 1, nbTestedValues, verbose)

    const values = data.map((d) => d[key]) as Iterable<number>
    const q1 = quantile(values, 0.25) as number
    const q3 = quantile(values, 0.75) as number
    const interQuartileRange = q3 - q1

    const upper = q3 + interQuartileRange * 1.5
    const lower = q1 - interQuartileRange * 1.5

    const [min, max] = extent(values)

    verbose &&
        log(
            `Min: ${min}, Lower threshold: ${lower}, Q1: ${q1}, Q3: ${q3}, Upper threshold: ${upper}, Max: ${max}`,
            "blue"
        )

    let outliers = 0

    for (let i = 0; i < data.length; i++) {
        if (
            (data[i][key] as number) < lower ||
            (data[i][key] as number) > upper
        ) {
            data[i][newKey] = true
            outliers += 1
        } else {
            data[i][newKey] = false
        }
    }

    verbose &&
        log(
            `${outliers} outliers found, representing ${toPercentage(
                outliers,
                data.length
            )} of the incoming data.`,
            "blue"
        )

    return data
}
