function calculateWinRateDetailed(numbersArray) {
    let winCount = 0;
    let lossCount = 0;
    const results = [];

    let i = 0;
    let groupNumber = 1;
    
    while (i < numbersArray.length - 1) {
        let uniqueNumbers = [];
        let seenNumbers = new Set();
        let duplicateCount = 0;
        let j = i;
        let groupBuildLog = []; // Logs for building the current group

        // Attempt to collect 18 unique numbers starting from position `i`
        while (uniqueNumbers.length < 18 && j < numbersArray.length) {
            const currentNumber = numbersArray[j];
            if (!seenNumbers.has(currentNumber)) {
                uniqueNumbers.push(currentNumber);
                seenNumbers.add(currentNumber);
                groupBuildLog.push(`Position ${j}: Number ${currentNumber} added to unique list (${uniqueNumbers.length}/18)`);
            } else {
                duplicateCount++;
                groupBuildLog.push(`Position ${j}: Duplicate number ${currentNumber} encountered, moving on`);
            }
            j++;
        }

        // Display the group-building phase logs
        console.log(`\n--- Group ${groupNumber} Building ---`);
        groupBuildLog.forEach(log => console.log(log));

        let groupResult = {
            groupName: `Group ${groupNumber}`,
            startPosition: i + 1,
            duplicates: duplicateCount,
            result: ""
        };

        // If we successfully built a group of 18 unique numbers, check the next number
        if (uniqueNumbers.length === 18 && j < numbersArray.length) {
            const nextNumber = numbersArray[j];
            if (seenNumbers.has(nextNumber)) {
                lossCount++;
                groupResult.result = "Loss";
                console.log(`Position ${j}: Loss, number ${nextNumber} is a duplicate`);
            } else {
                winCount++;
                groupResult.result = "Win";
                console.log(`Position ${j}: Win, number ${nextNumber} is unique`);
            }
        } else if (uniqueNumbers.length < 18) {
            // Stop if fewer than 18 unique numbers can be built from this position
          
            break;
        }

        // Save the group result to the results array
        results.push(groupResult);

        // Move to the next position and increment group number
        i++;
        groupNumber++;
    }

    const totalAttempts = winCount + lossCount;
    const winRate = totalAttempts > 0 ? (winCount / totalAttempts) * 100 : 0;

    console.log(`\nFinal Results:`);
    console.log(`Wins: ${winCount}, Losses: ${lossCount}, Win Rate: ${winRate.toFixed(2)}%`);
    console.log("Detailed Group Results:", results);

    return {
        winCount,
        lossCount,
        winRate: winRate.toFixed(2),
        results
    };
}

// Testing the function
const testArray = [
    13, 35, 15, 31, 20, 33, 31, 2, 33, 32, 5, 24,
    13, 20, 32, 18, 19, 30, 28, 1, 32, 15,
    3, 2, 14, 4, 34, 3, 24, 23, 15, 24,
    26, 15, 27, 26, 26, 30, 24, 35, 15, 18
];

console.log("== Win Rate Calculation with Group Details and Duplicate Counting ==");
calculateWinRateDetailed(testArray);
