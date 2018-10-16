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

export class EdgeNode<T> {
  public afters: T[] = [];
  constructor(public id: T) { }
}

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
export function topsort<T>(edges: T[][], options?: { continueOnCircularDependency: boolean }): T[] {
  const nodes: { [key: string]: EdgeNode<T> } = {};
  options = options || { continueOnCircularDependency: false };

  const sorted: T[] = [];

  // hash: id of already visited node => true
  const visited: { [key: string]: boolean } = {};

  // 1. build data structures
  edges.forEach((edge: T[]) => {

    const fromEdge: T = edge[0];
    const fromStr: string = fromEdge.toString();
    let fromNode: EdgeNode<T>;

    // tslint:disable-next-line:no-conditional-assignment
    if (!(fromNode = nodes[fromStr])) {
      fromNode = nodes[fromStr] = new EdgeNode<T>(fromEdge);
    }

    edge.forEach((toEdge: T) => {

      // since from and to are in same array, we'll always see from again, so make sure we skip it..
      if (toEdge === fromEdge) {
        return;
      }

      const toEdgeStr: string = toEdge.toString();

      if (!nodes[toEdgeStr]) {
        nodes[toEdgeStr] = new EdgeNode<T>(toEdge);
      }
      fromNode.afters.push(toEdge);
    });
  });

  // 2. topological sort
  const keys: string[] = Object.keys(nodes);
  keys.sort(sortDesc);
  keys.forEach(function visit(idstr: string, ancestorsIn: any) {
    const node: EdgeNode<T> = nodes[idstr];
    const id: T = node.id;

    // if already exists, do nothing
    if (visited[idstr]) {
      return;
    }

    const ancestors: T[] = Array.isArray(ancestorsIn) ? ancestorsIn : [];

    ancestors.push(id);
    visited[idstr] = true;

    node.afters.sort(sortDesc);
    node.afters.forEach((afterID: T) => {
      // if already in ancestors, a closed chain exists.
      if (ancestors.indexOf(afterID) >= 0) {
        if (options.continueOnCircularDependency) {
          return;
        }
        // tslint:disable-next-line:max-line-length
        throw new Error(`Circular chain found: ${id} must be before ${afterID} due to a direct order specification, but ${afterID} must be before ${id} based on other specifications.`);
      }

      // recursive call
      visit(afterID.toString(), ancestors.map((v) => v));
    });

    sorted.unshift(id);
  });

  return sorted;
}
