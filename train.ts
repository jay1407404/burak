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



function calculateSumOfNumbers(arr: any[]): number {
      let sum = 0;

      for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] === "number") {
                  sum += arr[i];
            }
      }

      return sum;
}

console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]));