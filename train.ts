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



function missingNumber(arr) {
      for (let i = 0; i <= arr.length; i++) {
            if (!arr.includes(i)) {
                  return i;
            }
      }
}

console.log(missingNumber([3, 0, 1])); // 2