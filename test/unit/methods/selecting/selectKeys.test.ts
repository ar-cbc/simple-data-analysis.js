import assert from "assert"
import { SimpleData } from "../../../../src/index.js"

describe("selectKeys", function () {
    it("should select keys", function () {
        const data = [
            { key1: 0, key2: 2, key3: "orignal" },
            { key1: 1, key2: 2, key3: "raton" },
            { key1: 2, key2: 4, key3: "castor" },
            { key1: 2, key2: 6, key3: "chat" },
        ]
        const sd = new SimpleData({ data }).selectKeys({
            keys: ["key1", "key2"],
        })
        assert.deepStrictEqual(sd.getData(), [
            { key1: 0, key2: 2 },
            { key1: 1, key2: 2 },
            { key1: 2, key2: 4 },
            { key1: 2, key2: 6 },
        ])
    })
})
