topsort
=======

Topological sort implementation in JavaScript (aka, dependency sorting).

Given an array of arrays, where the inner array identifies dependency order, the individual items will be sorted such that all dependencies are adhered to and otherwise by default sort order.

## Usage

`topsort` expects an array of arrays. The inner arrays are typically two items each. For example, lets review this simplest example:

```js
var topsort = require('topsort');
var edges = [ [1, 2], [2, 3] ];
var sorted = topsort(edges);

// sorted = [1, 2, 3];
```

Here we're providing two pairs of numbers, first 1 and 2 where 1 must come before 2. Then 2 and 3 where 2 must come before 3. 

We can reverse the dependencies like this:

```js
var edges = [ [2, 1], [3, 2] ];
var sorted = topsort(edges);

// sorted = [3, 2, 1];
```

Here we provided the same numbers but the pairs are all reversed. Now 2 must come before 1 and 3 must come before 2.

Significantly more complex lists are also supported, such as:

```js
var edges = [
    ['two', 'three'],
    ['four', 'six'],
    ['one', 'three'],
    ['two', 'four'],
    ['six', 'nine'],
    ['five', 'seven'],
    ['five', 'eight'],
    ['five', 'nine'],
    ['seven', 'eight'],
    ['eight', 'nine'],
    ['one', 'two'],
    ['four', 'five'],
    ['four', 'six'],
    ['three', 'six'],
    ['six', 'seven'],
    ['three', 'four']
];

var sorted = topsort(edges);
// sorted = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
```

In this past example we specified many more dependencies than were necessary, and all the dependencies were evaluated to put the items in correct order.

It's also possible that the order of some items is not based on dependencies. In that case, the order of those items is alphabetical.

For example:

```js
var edges = [
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
  [21, 20]
];

var sorted = topsort(edges);
// sorted = [6, 5, 4, 10, 11, 12, 22, 21, 20];
```

Here we've provided dependency rules that specify the order for 6,5,4 and then for 22,21,20, and that 6,5,4 must be before 10,11,12, and that 10,11,12 must be before 22,21,20, but no where in the list of dependencies do we specify that 10 is before 11 or that 11 is before 12. That sorting results from the default numerical sort on groups of items that are together but otherwise without dependencies.

We can also include additional values as an array of individual values to be included in the final list even if there are no specific dependencies. Items that are included and are not dependent on anything else will be sorted at the front of the list.

```js
var edges = [
    [6, 5],
    [5, 4],
    [22, 21],
    [21, 20],
    [4, 22],
    [11],
    [10],
    [12]
];

var sorted = topsort(edges);
// sorted = [10, 11, 12, 6, 5, 4, 22, 21, 20];
```

Here we specified ordering that forced 6, 5, 4, 22, 21, 20 into the order shown, but 10, 11, and 12 are not dependent on anything so they show up first, in numerically sorted order.

Finally, circular dependencies are identified and an error is thrown:

```js
var edges = [
    [1, 2],
    [2, 3],
    [3, 1]
];
var sorted = topsort(edges);
/*
  Error: 
  
  Circular chain found: 2 must be before 3 due to a direct order specification, 
  but 3 must be before 2 based on other specifications.
*/
```

Here'we we've specified that 1 must be before 2 and 2 must be before 3 but also that 3 must be before 1. This is an impossible circular dependency and results in an appropriate and detailed error.

## Credit

This project is very largely based on the topsort algorithm from Shin Suzuki who published it via a [Gist](https://gist.github.com/shinout/1232505). I've taken his implemenation, added support for items without dependencies, items with multiple dependencies, wrapped it in an NPM module and provided additional and formal unit tests.

## TypeScript Support

The package is written in TypeScript and both the TypeScript and JavaScript files are included. TypeScript users can import the typed topsort function and benefit from typings whereas JavaScript users can use the JavaScript function normally and totally ignore the TypeScript files.
