import "jasmine";
import { topsort } from "./topsort";

describe("Topological sort tests", () => {
  it("Simple 1, 2, 3", () => {
    const edges: number[][] = [
      [1, 2],
      [2, 3],
    ];

    const expected: number[] = [1, 2, 3];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("Simple 3, 2, 1", () => {
    const edges: number[][] = [
      [2, 1],
      [3, 2],
    ];

    const expected: number[] = [3, 2, 1];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("Extra 3, 2, 1, 1", () => {
    const edges: number[][] = [
      [2, 1],
      [3, 2],
      [1],
    ];

    const expected: number[] = [3, 2, 1];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("Extra 3, 2, 1, 1, 2, 3", () => {
    const edges: number[][] = [
      [2, 1],
      [3, 2],
      [1],
      [2],
      [3],
    ];

    const expected: number[] = [3, 2, 1];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("1,2,3 plus non-dependent 0", () => {
    const edges: number[][] = [
      [2, 3],
      [1, 2],
      [0],
    ];

    const expected: number[] = [0, 1, 2, 3];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("non-dependent 0 then 1,2,3", () => {
    const edges: number[][] = [
      [0],
      [2, 3],
      [1, 2],
      [0],
    ];

    const expected: number[] = [0, 1, 2, 3];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("0, 3-2, 3-2, 3-1, 2-1, 0, 3, 2, 1", () => {
    const edges: number[][] = [
      [0],
      [3, 2],
      [3, 2],
      [3, 1],
      [2, 1],
      [0],
      [3],
      [2],
      [1],
    ];

    const expected: number[] = [0, 3, 2, 1];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("0, 3-2, 3-2-1, 3-1, 2-1, 0, 3, 2, 1", () => {
    const edges: number[][] = [
      [0],
      [3, 2],
      [3, 2, 1],
      [3, 1],
      [2, 1, 1, 1],
      [0],
      [3],
      [2],
      [1],
    ];

    const expected: number[] = [0, 3, 2, 1];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("Simple circular reference error", () => {
    const edges: number[][] = [
      [1, 2],
      [2, 1],
    ];
    const doIt = () => {
      topsort(edges);
    };
    expect(doIt).toThrow();
  });

  it("Complex circular reference error", () => {
    const edges: number[][] = [
      [1, 2],
      [2, 3],
      [3, 1],
    ];
    const doIt = () => {
      topsort(edges);
    };
    expect(doIt).toThrow();
  });

  it("Ignore simple circular reference error", () => {
    const edges: number[][] = [
      [1, 2],
      [2, 1],
    ];

    const actual: number[] = topsort(edges, { continueOnCircularDependency: true });

    // order is not specified or guaranteed in any way when circular dependencies exist
    // only guarantee is that all items will be returned once each

    // confirm 2 items returned..
    expect(actual.length).toBe(2);
    expect(actual).toContain(1);
    expect(actual).toContain(2);
  });

  it("Ignore complex circular reference error", () => {
    const edges: number[][] = [
      [1, 2],
      [2, 3],
      [3, 1],
    ];
    const actual: number[] = topsort(edges, { continueOnCircularDependency: true });

    // order is not specified or guaranteed in any way when circular dependencies exist
    // only guarantee is that all items will be returned once each

    // confirm 3 items returned..
    expect(actual.length).toBe(3);
    expect(actual).toContain(1);
    expect(actual).toContain(2);
    expect(actual).toContain(3);
  });

  it("one, two, three, four, five, six, seven, eight, nine", () => {
    const edges: string[][] =
      [
        ["two", "three"],
        ["four", "six"],
        ["one", "three"],
        ["two", "four"],
        ["six", "nine"],
        ["five", "seven"],
        ["five", "eight"],
        ["five", "nine"],
        ["seven", "eight"],
        ["eight", "nine"],
        ["one", "two"],
        ["four", "five"],
        ["four", "six"],
        ["three", "six"],
        ["six", "seven"],
        ["three", "four"],
      ];

    const expected: string[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const actual: string[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("6,5,4, 10,11,12,  22,21,20", () => {
    const edges: number[][] = [
      [6, 5],
      [5, 4],
      [4, 11],
      [4, 10],
      [4, 12],
      [12, 20],
      [11, 20],
      [10, 20],
      [10, 22],
      [11, 22],
      [12, 22],
      [22, 21],
      [21, 20],
    ];

    const expected: number[] = [6, 5, 4, 10, 11, 12, 22, 21, 20];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });

  it("6,5,4, 10,11,12,  22,21,20, again..", () => {
    const edges: number[][] = [
      [6, 5],
      [5, 4],
      [22, 21],
      [21, 20],
      [4, 22],
      [10],
      [11],
      [12],
    ];

    const expected: number[] = [10, 11, 12, 6, 5, 4, 22, 21, 20];
    const actual: number[] = topsort(edges);
    expect(actual).toEqual(expected);
  });
});
