/**
 * Project Standarts :
 * -Login standarts
 * - Naming standarts
      function, method , variable => CAMEL    goHome
      class => PASCAL                         MemberService
      folder => KEBAB
      css => SNAKE                            button_style
- Eror handling
 */

/**
 Traditional API
 Rest API
 GraphQL API
 ...
 */

/**
 Traditional FD  => BSSR    => EJS
 Modern FD       => SPA   => REACT
 */



function mergeSortedArrays(arr1: number[], arr2: number[]) {
      return [...arr1, ...arr2].sort((a, b) => a - b);
}

console.log(mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]));
// [0, 3, 4, 4, 6, 30, 31]