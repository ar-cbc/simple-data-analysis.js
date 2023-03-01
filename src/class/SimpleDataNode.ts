import SimpleData from "./SimpleData.js"
import { SimpleDataItem } from "../types/SimpleData.types"
import loadDataFromLocalFile_ from "../methods/importing/loadDataFromLocalFile.js"
import loadDataFromLocalDirectory_ from "../methods/importing/loadDataFromLocalDirectory.js"
import saveData_ from "../methods/exporting/saveData.js"
import { logCall, asyncLogCall } from "../helpers/logCall.js"
import loadDataFromUrlNode_ from "../methods/importing/loadDataFromUrlNode.js"
import saveChart_ from "../methods/visualizing/saveChart.js"
import saveCustomChart_ from "../methods/visualizing/saveCustomChart.js"

export default class SimpleDataNode extends SimpleData {
    // If modified, might need to be modified in SimpleData too
    #updateSimpleData(data: SimpleDataItem[]) {
        this._data = data
    }

    // ** OVERWRITING METHODS ** //

    @asyncLogCall()
    async loadDataFromUrl({
        url,
        autoType = false,
        dataAsArrays = false,
        missingKeyValues = { null: null, NaN: NaN, undefined: undefined },
        fillMissingKeys = false,
        firstItem = 0,
        lastItem = Infinity,
        nbFirstRowsToExclude = 0,
        nbLastRowsToExclude = Infinity,
    }: {
        url: string | string[]
        autoType?: boolean
        dataAsArrays?: boolean
        missingKeyValues?: SimpleDataItem
        fillMissingKeys?: boolean
        firstItem?: number
        lastItem?: number
        nbFirstRowsToExclude?: number
        nbLastRowsToExclude?: number
    }): Promise<this> {
        const data = await loadDataFromUrlNode_(
            url,
            autoType,
            dataAsArrays,
            firstItem,
            lastItem,
            nbFirstRowsToExclude,
            nbLastRowsToExclude,
            fillMissingKeys,
            missingKeyValues,
            this.verbose
        )
        this.#updateSimpleData(data)

        return this
    }

    // ** SPECIFIC NODEJS METHODS ** //

    @logCall()
    loadDataFromLocalFile({
        path,
        autoType = false,
        dataAsArrays = false,
        missingKeyValues = { null: null, NaN: NaN, undefined: undefined },
        encoding = "utf8",
        fillMissingKeys = false,
        firstItem = 0,
        lastItem = Infinity,
        nbFirstRowsToExclude = 0,
        nbLastRowsToExclude = Infinity,
    }: {
        path: string | string[]
        autoType?: boolean
        dataAsArrays?: boolean
        encoding?: BufferEncoding
        missingKeyValues?: SimpleDataItem
        fillMissingKeys?: boolean
        firstItem?: number
        lastItem?: number
        nbFirstRowsToExclude?: number
        nbLastRowsToExclude?: number
    }): this {
        if (this._data.length > 0) {
            throw new Error(
                "This SimpleData already has data. Create another one."
            )
        }

        this.#updateSimpleData(
            loadDataFromLocalFile_(
                path,
                autoType,
                dataAsArrays,
                firstItem,
                lastItem,
                nbFirstRowsToExclude,
                nbLastRowsToExclude,
                fillMissingKeys,
                missingKeyValues,
                encoding,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    loadDataFromLocalDirectory({
        path,
        autoType = false,
        dataAsArrays = false,
        missingKeyValues = { null: null, NaN: NaN, undefined: undefined },
        encoding = "utf8",
        fillMissingKeys = false,
        fileNameAsId = false,
        firstItem = 0,
        lastItem = Infinity,
        nbFirstRowsToExclude = 0,
        nbLastRowsToExclude = Infinity,
    }: {
        path: string
        autoType?: boolean
        dataAsArrays?: boolean
        encoding?: BufferEncoding
        missingKeyValues?: SimpleDataItem
        fillMissingKeys?: boolean
        fileNameAsId?: boolean
        firstItem?: number
        lastItem?: number
        nbFirstRowsToExclude?: number
        nbLastRowsToExclude?: number
    }): this {
        if (this._data.length > 0) {
            throw new Error(
                "This SimpleData already has data. Create another one."
            )
        }

        this.#updateSimpleData(
            loadDataFromLocalDirectory_(
                path,
                autoType,
                dataAsArrays,
                firstItem,
                lastItem,
                nbFirstRowsToExclude,
                nbLastRowsToExclude,
                fillMissingKeys,
                fileNameAsId,
                missingKeyValues,
                encoding,
                this.verbose
            )
        )

        return this
    }

    @logCall()
    saveData({
        path,
        dataAsArrays = false,
        encoding = "utf8",
    }: {
        path: string
        dataAsArrays?: boolean
        encoding?: BufferEncoding
    }): this {
        saveData_(this._data, path, dataAsArrays, this.verbose, encoding)

        return this
    }

    @logCall()
    saveChart({
        path,
        type,
        x,
        y,
        color,
        colorScale,
        trend = false,
        showTrendEquation = false,
        width,
        height,
        marginLeft,
        marginBottom,
        title,
        smallMultipleKey,
        smallMultipleWidth,
        smallMultipleHeight,
    }: {
        path: string
        type:
            | "dot"
            | "line"
            | "bar"
            | "barVertical"
            | "barHorizontal"
            | "box"
            | "boxVertical"
            | "boxHorizontal"
        x: string
        y: string
        color?: string
        colorScale?: "linear" | "diverging" | "categorical" | "ordinal"
        trend?: boolean
        showTrendEquation?: boolean
        width?: number
        height?: number
        marginLeft?: number
        marginBottom?: number
        title?: string
        smallMultipleKey?: string
        smallMultipleWidth?: number
        smallMultipleHeight?: number
    }): this {
        saveChart_(
            this._data,
            path,
            type,
            x,
            y,
            color,
            colorScale,
            trend,
            showTrendEquation,
            marginLeft,
            marginBottom,
            width,
            height,
            title,
            smallMultipleKey,
            smallMultipleWidth,
            smallMultipleHeight,
            this.verbose
        )

        return this
    }

    @logCall()
    saveCustomChart({
        path,
        plotOptions,
    }: {
        path: string
        plotOptions: object
    }): this {
        saveCustomChart_(path, plotOptions, this.verbose)

        return this
    }
}
