import assert from "assert"
import getExtension from "../../../src/helpers/getExtension.js"

describe("getExtension", function () {
    it("should return the extension", function () {
        const extension = getExtension("coucou/key2/pat.a.te.xyz", false)
        assert.deepStrictEqual(extension, "xyz")
    })
})
