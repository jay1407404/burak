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

console.log(getSquareNumbers([1, 2, 3]));