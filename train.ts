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




function chunkArray(arr: number[], size: number): number[][] {
      const result: number[][] = [];

      for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
      }

      return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
// [[1,2,3], [4,5,6], [7,8,9], [10]]