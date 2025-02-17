import assert from "assert"
import { SimpleData } from "../../../../src/index.js"

const data = [
    { key1: 66, key2: 5, key3: new Date(Date.UTC(2022, 7, 1)) },
    { key1: 88, key2: null, key3: new Date(Date.UTC(2022, 7, 2)) },
    { key1: 77, key2: 9, key3: new Date(Date.UTC(2022, 7, 3)) },
    { key1: 99, key2: -11.1, key3: new Date(Date.UTC(2022, 7, 4)) },
    { key1: 44, key2: 6, key3: new Date(Date.UTC(2022, 7, 5)) },
    { key1: 55, key2: undefined, key3: new Date(Date.UTC(2022, 7, 6)) },
    { key1: 44, key2: "haha", key3: new Date(Date.UTC(2022, 7, 7)) },
]

describe("getMax", function () {
    it("should return max value 99 from key holding all numbers", function () {
        assert.deepStrictEqual(
            new SimpleData({ data }).getMax({ key: "key1" }),
            99
        )
    })
    it("should throw an error when different types", function () {
        assert.throws(() => new SimpleData({ data }).getMax({ key: "key2" }))
    })
    it("should throw an error when not working with with numbers", function () {
        assert.throws(() => new SimpleData({ data }).getMax({ key: "key3" }))
    })
    it("should return max value when the type provided (Date)", function () {
        assert.deepStrictEqual(
            new SimpleData({ data }).getMax({ key: "key3", type: "Date" }),
            new Date(Date.UTC(2022, 7, 7))
        )
    })
})
