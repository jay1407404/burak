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



function calculate(str: string) {
      return str.split("+").reduce((sum: number, num: string) => sum + Number(num), 0);
}

console.log(calculate("1+3")); // 4
console.log(calculate("10+20+5")); // 35