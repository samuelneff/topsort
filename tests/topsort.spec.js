/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
var topsort = require("../lib/topsort");

describe("Topological sort tests", function () {
    it("Simple 1, 2, 3", function () {
        var edges = [
            [1, 2],
            [2, 3]
        ];

        var expected = [1, 2, 3];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("Simple 3, 2, 1", function () {
        var edges = [
            [2, 1],
            [3, 2]
        ];

        var expected = [3, 2, 1];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("Extra 3, 2, 1, 1", function () {
        var edges = [
            [2, 1],
            [3, 2],
            [1]
        ];

        var expected = [3, 2, 1];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("Extra 3, 2, 1, 1, 2, 3", function () {
        var edges = [
            [2, 1],
            [3, 2],
            [1],
            [2],
            [3]
        ];

        var expected = [3, 2, 1];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("1,2,3 plus non-dependent 0", function () {
        var edges = [
            [2, 3],
            [1, 2],
            [0]
        ];

        var expected = [0, 1, 2, 3];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("non-dependent 0 then 1,2,3", function () {
        var edges = [
            [0],
            [2, 3],
            [1, 2],
            [0]
        ];

        var expected = [0, 1, 2, 3];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("0, 3-2, 3-2, 3-1, 2-1, 0, 3, 2, 1", function () {
        var edges = [
            [0],
            [3, 2],
            [3, 2],
            [3, 1],
            [2, 1],
            [0],
            [3],
            [2],
            [1]
        ];

        var expected = [0, 3, 2, 1];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("0, 3-2, 3-2-1, 3-1, 2-1, 0, 3, 2, 1", function () {
        var edges = [
            [0],
            [3, 2],
            [3, 2, 1],
            [3, 1],
            [2, 1, 1, 1],
            [0],
            [3],
            [2],
            [1]
        ];

        var expected = [0, 3, 2, 1];
        var actual = topsort(edges);
        expect(actual).toEqual(expected);
    });

    it("Simple circular reference error", function () {
        var edges = [
            [1, 2],
            [2, 1]
        ];
        var doIt = function () {
            topsort(edges);
        };
        expect(doIt).toThrow();
    });

    it("Complex circular reference error", function () {
        var edges = [
            [1, 2],
            [2, 3],
            [3, 1]
        ];
        var doIt = function () {
            topsort(edges);
        };
        expect(doIt).toThrow();
    });
});
//# sourceMappingURL=topsort.spec.js.map
