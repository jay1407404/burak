function getSquareNumbers(array: number[]) {
    const result = [];

    for (let i = 0; i < array.length; i++) {
        result.push({
            number: array[i],
            square: array[i] * array[i]
        });
    }

    return result;
}


// N-Task

console.log(getSquareNumbers([1, 2, 3]));

function palindromCheck(word: string): boolean {
    let reversed = word.split("").reverse().join("");

    return word === reversed;
}

console.log(palindromCheck("dad")); // true
console.log(palindromCheck("son")); // false