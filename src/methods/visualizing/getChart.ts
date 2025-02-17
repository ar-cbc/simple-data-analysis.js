import { SimpleDataItem } from "../../types/SimpleData.types.js"
import {
    frame as frameMark,
    dot,
    line,
    barY,
    barX,
    boxY,
    boxX,
    linearRegressionY,
} from "@observablehq/plot"
import { regressionLinear } from "d3-regression"
import {
    log,
    round,
    hasKey,
    plotChart,
    checkTypeOfKey,
} from "../../exports/helpers.js"
import { getUniqueValues } from "../../exports/exporting.js"

export default function getChart(
    data: SimpleDataItem[],
    type:
        | "dot"
        | "line"
        | "bar"
        | "barVertical"
        | "barHorizontal"
        | "box"
        | "boxVertical"
        | "boxHorizontal",
    x: string,
    y: string,
    color?: string,
    colorScale?: "linear" | "diverging" | "categorical" | "ordinal",
    trend?: boolean,
    showTrendEquation?: boolean,
    marginLeft?: number,
    marginBottom?: number,
    width = 600,
    height = 450,
    title?: string,
    smallMultipleKey?: string,
    smallMultipleWidth?: number,
    smallMultipleHeight?: number
): string {
    if (typeof smallMultipleKey === "string") {
        hasKey(data, smallMultipleKey)

        const smallMultiple = getUniqueValues(data, smallMultipleKey)

        let multipleCharts = ""
        const gap = 10

        for (const multiple of smallMultiple) {
            if (typeof multiple !== "string") {
                throw new Error(
                    `Values of ${smallMultipleKey} must be strings.`
                )
            }

            multipleCharts += `<div>${renderChart(
                data.filter((d) => d[smallMultipleKey] === multiple),
                type,
                x,
                y,
                smallMultipleWidth ? smallMultipleWidth - gap : width - gap,
                smallMultipleHeight ? smallMultipleHeight - gap : height - gap,
                color,
                colorScale,
                trend,
                showTrendEquation,
                marginLeft,
                marginBottom,
                multiple,
                true
            )}</div>`
        }

        let titleHTML = ""
        if (title) {
            titleHTML = `<div style="font-family:system-ui, sans-serif;font-size:20px;font-weight: bold;margin-bottom: 8px;">${title}</div>`
        }

        return `<div style='width: ${width}px; height: auto;'>
                    <div>${titleHTML}</div>
                    <div style='display: flex; flex-wrap: wrap; gap: ${gap}px; width: ${width}px; height: auto;'>
                        ${multipleCharts}
                    </div>
        </div>`
    } else {
        return renderChart(
            data,
            type,
            x,
            y,
            width,
            height,
            color,
            colorScale,
            trend,
            showTrendEquation,
            marginLeft,
            marginBottom,
            title
        )
    }
}

function renderChart(
    data: SimpleDataItem[],
    type:
        | "dot"
        | "line"
        | "bar"
        | "barVertical"
        | "barHorizontal"
        | "box"
        | "boxVertical"
        | "boxHorizontal",
    x: string,
    y: string,
    width: number,
    height: number,
    color?: string,
    colorScale?: "linear" | "diverging" | "categorical" | "ordinal",
    trend?: boolean,
    showTrendEquation?: boolean,
    marginLeft?: number,
    marginBottom?: number,
    title?: string,
    frame?: boolean
) {
    const markOption: { [key: string]: string | number } = { x, y }

    hasKey(data, x)
    hasKey(data, y)
    color && hasKey(data, color)

    if (
        color &&
        [
            "bar",
            "barVertical",
            "barHorizontal",
            "box",
            "boxVertical",
            "boxHorizontal",
        ].includes(type)
    ) {
        markOption.fill = color
    } else if (color) {
        markOption.stroke = color
    }

    let mark
    if (type === "dot") {
        mark = dot(data, markOption)
    } else if (type === "line") {
        mark = line(data, markOption)
    } else if (type === "bar" || type === "barVertical") {
        mark = barY(data, markOption)
    } else if (type === "barHorizontal") {
        mark = barX(data, markOption)
    } else if (type === "box" || type === "boxVertical") {
        mark = boxY(data, markOption)
    } else if (type === "boxHorizontal") {
        mark = boxX(data, markOption)
    } else {
        throw new Error("Unknown chart type.")
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plotOptions: { [key: string]: any } = {
        width: width,
        height: height,
        grid: true,
        marks: [mark],
    }

    if (trend) {
        plotOptions.marks.push(linearRegressionY(data, { x: x, y: y }))
    }

    if (frame) {
        plotOptions.marks.push(frameMark())
    }

    if (marginLeft) {
        plotOptions.marginLeft = marginLeft
    }
    if (marginBottom) {
        plotOptions.marginBottom = marginBottom
    }

    if (color && colorScale) {
        if (plotOptions.color) {
            plotOptions.color.type = colorScale
        } else {
            plotOptions.color = { type: colorScale }
        }
        if (colorScale === "diverging") {
            plotOptions.color.scheme = "BuRd"
        }
        if (colorScale === "linear") {
            plotOptions.color.scheme = "viridis"
        }
    } else if (
        color &&
        checkTypeOfKey(data, color, "number", 0.5, 100, false, true)
    ) {
        if (plotOptions.color) {
            plotOptions.color.scheme = "viridis"
        } else {
            plotOptions.color = { scheme: "viridis" }
        }
    }

    if (checkTypeOfKey(data, x, "string", 0.5, 100, false, true)) {
        if (type === "dot") {
            plotOptions.x = { type: "point" }
        } else if (type !== "line") {
            plotOptions.x = { type: "band" }
        }
    }
    if (checkTypeOfKey(data, y, "string", 0.5, 100, false, true)) {
        if (type === "dot") {
            plotOptions.y = { type: "point" }
        }
    }

    const chart = plotChart(plotOptions)
    const chartHTML = chart.html

    let titleHTML = ""
    if (title) {
        titleHTML = `<div style="font-family:system-ui, sans-serif;font-size:14px;font-weight: bold;">${title}</div>`
    }

    let legendHTML = ""
    if (color && ["line", "dot"].includes(type)) {
        let legend

        try {
            legend = chart.plt.legend("color").outerHTML
        } catch (err) {
            log(
                "You chart is supposed to have a legend, but it couldn't be rendered.",
                "blue"
            )
        }
        if (legend) {
            legendHTML =
                `<div style="width:${width ? width : 640}px;margin-top: ${
                    title ? 8 : 0
                }px;">` +
                legend +
                "</div>"
        }
    }

    let trendEquationHTML = ""
    if (showTrendEquation) {
        const linearRegression = regressionLinear()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .x((d) => d[x])
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .y((d) => d[y])(data)
        let nbDigits = 0

        while (
            nbDigits < 10 &&
            (Math.abs(linearRegression.a) < 1 / Math.pow(10, nbDigits) ||
                Math.abs(linearRegression.b) < 1 / Math.pow(10, nbDigits))
        ) {
            nbDigits += 1
        }

        trendEquationHTML = `<div style='width: 100%; max-width: ${
            width ? width - 20 : 620
        }px;font-family:system-ui, sans-serif;font-size:10px;text-align:right;'><div>y = ${round(
            linearRegression.a,
            nbDigits + 1
        )}x + ${round(
            linearRegression.b,
            nbDigits + 1
        )} , R<sup>2</sup>: ${round(linearRegression.rSquared, 2)}</div></div>`
    }

    return (
        "<div>" +
        titleHTML +
        legendHTML +
        trendEquationHTML +
        chartHTML +
        "</div>"
    )
}
