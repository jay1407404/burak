// I-Task
function majorityElement(array) {
    let result = array[0];
    let maxCount = 0;

    for (let i = 0; i < array.length; i++) {
        let count = 0;

        for (let j = 0; j < array.length; j++) {
            if (array[i] === array[j]) {
                count++;
            }
        }

        if (count > maxCount) {
            maxCount = count;
            result = array[i];
        }
    }

    return result;
}

console.log(majorityElement([1, 2, 3, 4, 5, 4, 3, 4]));