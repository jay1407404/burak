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




function countChars(str: string): object {
      const result: any = {};

      for (const char of str) {
            result[char] = (result[char] || 0) + 1;
      }

      return result;
}

console.log(countChars("hello"));
// { h: 1, e: 1, l: 2, o: 1 }