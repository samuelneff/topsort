export declare class EdgeNode<T> {
    id: T;
    afters: T[];
    constructor(id: T);
}
/**
 * General topological sort
 * @param edges List of edges. Each edge forms an []Array<ID,ID> e.g. [12, 3]
 * @param options If 'continueOnCircularDependency' set to true, sorting will continue even if a circular dependency is
 * found. The precise sort is not guaranteed.
 * @returns Topological sorted list of IDs
 */
export declare function topsort<T>(edges: T[][], options?: {
    continueOnCircularDependency: boolean;
}): T[];
