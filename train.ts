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



function sumOdds(num: number): number {
      let count: number = 0;

      for (let i = 1; i <= num; i += 2) {
            count++;
      }

      return count;
}

console.log(sumOdds(9));  // 4
console.log(sumOdds(11)); // 5