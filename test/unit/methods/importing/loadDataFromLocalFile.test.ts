import assert from "assert"
import { SimpleDataNode } from "../../../../src/index.js"

describe("loadDataFromLocalFile", function () {
    it("should return an array of objects from a csv file", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.csv",
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a csv file without headers", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/dataNoHeaders.csv",
            headers: ["key1", "key2"],
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a text file but with a specific format", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.txt",
            format: "csv",
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from multiple files", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: [
                "./test/data/files/data.csv",
                "./test/data/files/data.tsv",
                "./test/data/files/data.json",
            ],
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
            { key1: 1, key2: 2 },
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from multiple files file name as value", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: [
                "./test/data/files/data.csv",
                "./test/data/files/data.tsv",
                "./test/data/files/data.json",
            ],
            fileNameAsValue: true,
        })

        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2", file: "data.csv" },
            { key1: "3", key2: "coucou", file: "data.csv" },
            { key1: "8", key2: "10", file: "data.csv" },
            { key1: "brioche", key2: "croissant", file: "data.csv" },
            { key1: "1", key2: "2", file: "data.tsv" },
            { key1: "3", key2: "coucou", file: "data.tsv" },
            { key1: "8", key2: "10", file: "data.tsv" },
            { key1: "brioche", key2: "croissant", file: "data.tsv" },
            { key1: 1, key2: 2, file: "data.json" },
            { key1: 3, key2: "coucou", file: "data.json" },
            { key1: 8, key2: 10, file: "data.json" },
            { key1: "brioche", key2: "croissant", file: "data.json" },
        ])
    })

    it("should return an array of objects from a csv file with specific items included", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.csv",
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
        ])
    })

    it("should return an array of objects from a csv file while skipping rows", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/dataExtraLines.csv",
            nbFirstRowsToExclude: 2,
            nbLastRowsToExclude: 3,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a csv file with specific items included, while skipping rows", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/dataExtraLines.csv",
            nbFirstRowsToExclude: 2,
            nbLastRowsToExclude: 3,
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
        ])
    })

    it("should return an array of objects from a tsv file", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.tsv",
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "1", key2: "2" },
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a tsv file with specific items included", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.tsv",
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: "3", key2: "coucou" },
            { key1: "8", key2: "10" },
        ])
    })

    it("should return an array of objects from a json file", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.json",
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 1, key2: 2 },
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a json file with specific items included", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.json",
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
        ])
    })

    it("should return an array of objects from an object of arrays", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/dataArrays.json",
            dataAsArrays: true,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 1, key2: 2 },
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
            { key1: "brioche", key2: "croissant" },
        ])
    })

    it("should return an array of objects from a csv file with inferred types", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.csv",
            autoType: true,
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
        ])
    })
    it("should return an array of objects from a tsv file with inferred types", function () {
        const sd = new SimpleDataNode().loadDataFromLocalFile({
            path: "./test/data/files/data.tsv",
            autoType: true,
            firstItem: 1,
            lastItem: 2,
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 3, key2: "coucou" },
            { key1: 8, key2: 10 },
        ])
    })
})
