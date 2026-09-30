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



function objectToArray(obj: object): any[] {
      return Object.entries(obj);
}

console.log(objectToArray({ a: 10, b: 20 }));
// [["a", 10], ["b", 20]]