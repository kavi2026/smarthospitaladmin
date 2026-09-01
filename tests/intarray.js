function findMaxConsecutiveOnes(nums) {
    let maxCount = 0;
    let currentCount = 0;

    for (let num of nums) {
        if (num === 1) {
            currentCount++;
            // Update maxCount if the current streak is longer
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
        } else {
            // Reset the streak when hitting any number other than 1
            currentCount = 0;
        }
    }

    return maxCount;
}

const input = [0, 1, 1, 0, 3, 4, 5, 1, 1, 1];
console.log(findMaxConsecutiveOnes(input)); // Output: 3
