"use strict";
/*
* @author Samuel Neff (https://github.com/samuelneff)
* @author Vincent Nadoll (vincent.nadoll@gmail.com)
*
* based almost entirely on gist from
*
* @author SHIN Suzuki (shinout310@gmail.com)
*
* https://gist.github.com/shinout/1232505
*/
Object.defineProperty(exports, "__esModule", { value: true });
var EdgeNode = /** @class */ (function () {
    function EdgeNode(id) {
        this.id = id;
        this.afters = [];
    }
    return EdgeNode;
}());
exports.EdgeNode = EdgeNode;
function sortDesc(a, b) {
    if (a < b) {
        return 1;
    }
    if (a > b) {
        return -1;
    }
    // a must be equal to b
    return 0;
}
/**
 * General topological sort
 * @param edges List of edges. Each edge forms an []Array<ID,ID> e.g. [12, 3]
 * @param options If 'continueOnCircularDependency' set to true, sorting will continue even if a circular dependency is
 * found. The precise sort is not guaranteed.
 * @returns Topological sorted list of IDs
 */
function topsort(edges, options) {
    var nodes = {};
    options = options || { continueOnCircularDependency: false };
    var sorted = [];
    // hash: id of already visited node => true
    var visited = {};
    // 1. build data structures
    edges.forEach(function (edge) {
        var fromEdge = edge[0];
        var fromStr = fromEdge.toString();
        var fromNode;
        // tslint:disable-next-line:no-conditional-assignment
        if (!(fromNode = nodes[fromStr])) {
            fromNode = nodes[fromStr] = new EdgeNode(fromEdge);
        }
        edge.forEach(function (toEdge) {
            // since from and to are in same array, we'll always see from again, so make sure we skip it..
            if (toEdge === fromEdge) {
                return;
            }
            var toEdgeStr = toEdge.toString();
            if (!nodes[toEdgeStr]) {
                nodes[toEdgeStr] = new EdgeNode(toEdge);
            }
            fromNode.afters.push(toEdge);
        });
    });
    // 2. topological sort
    var keys = Object.keys(nodes);
    keys.sort(sortDesc);
    keys.forEach(function visit(idstr, ancestorsIn) {
        var node = nodes[idstr];
        var id = node.id;
        // if already exists, do nothing
        if (visited[idstr]) {
            return;
        }
        var ancestors = Array.isArray(ancestorsIn) ? ancestorsIn : [];
        ancestors.push(id);
        visited[idstr] = true;
        node.afters.sort(sortDesc);
        node.afters.forEach(function (afterID) {
            // if already in ancestors, a closed chain exists.
            if (ancestors.indexOf(afterID) >= 0) {
                if (options.continueOnCircularDependency) {
                    return;
                }
                // tslint:disable-next-line:max-line-length
                throw new Error("Circular chain found: " + id + " must be before " + afterID + " due to a direct order specification, but " + afterID + " must be before " + id + " based on other specifications.");
            }
            // recursive call
            visit(afterID.toString(), ancestors.map(function (v) { return v; }));
        });
        sorted.unshift(id);
    });
    return sorted;
}
exports.topsort = topsort;
//# sourceMappingURL=topsort.js.map