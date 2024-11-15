function calculateWinRateDetailed(numbersArray) {
    let winCount = 0;
    let lossCount = 0;
    const results = [];
    let i = 0;
    let groupNumber = 1;

    while (i < numbersArray.length) {
        let uniqueNumbers = [];
        let seenNumbers = new Set();
        let duplicateCount = 0;
        let j = i;
        let groupBuildLog = [];

        // Reset result data for each new group
        let resultData = {
            result1: null, result2: null, result3: null, result4: null, result5: null, result6: null
        };

        console.log(`\n--- Starting Group ${groupNumber} ---`);

        // Build group with up to 18 unique numbers
        while (uniqueNumbers.length < 18 && j < numbersArray.length) {
            const currentNumber = numbersArray[j];
            const status = seenNumbers.has(currentNumber) ? "D" : "U";
            groupBuildLog.push(status);

            if (status === "U") {
                uniqueNumbers.push(currentNumber);
                seenNumbers.add(currentNumber);
            } else {
                duplicateCount++;
            }
            j++;
        }

        let groupResult = {
            groupName: groupNumber,
            startPosition: i + 1,
            duplicates: duplicateCount,
            uniqueGroup: uniqueNumbers.slice(),
            lastFiveEntries: groupBuildLog.slice(-5),
            result: ""
        };

        // Process results if the group is complete (18 unique numbers)
        if (uniqueNumbers.length === 18 && j < numbersArray.length) {
            let isLossStreak = true;

            // Check each result from result1 to result6 sequentially
            for (let k = 0; k <= 5; k++) {
                const nextIndex = j + k;
                if (nextIndex < numbersArray.length) {
                    const checkNumber = numbersArray[nextIndex];
                    const resultKey = `result${k + 1}`;

                    // If we are in a loss streak, continue checking, else stop
                    if (isLossStreak && seenNumbers.has(checkNumber)) {
                        resultData[resultKey] = "Loss";
                        if (k === 0) {
                            groupResult.result = "Loss";
                            lossCount++;
                        }
                    } else if (isLossStreak) {
                        resultData[resultKey] = "Win";
                        isLossStreak = false; // Stop further calculations if "Win" is found
                    } else {
                        break; // Stop further checks after a "Win"
                    }
                }
            }

            // If the first result isn’t a "Loss," mark as "Win"
            if (groupResult.result !== "Loss") {
                groupResult.result = "Win";
                resultData.result1 = "Win";
                winCount++;
            }

            groupResult = { ...groupResult, ...resultData };
            results.push(groupResult);
            i += 1;
            groupNumber++;
        } else if (numbersArray.length - i < 18) {
            // Mark as Complete or Incomplete if fewer than 18 remaining entries
            groupResult.result = groupResult.lastFiveEntries.every(entry => entry === "U") ? "Complete" : "Incomplete";
            results.push(groupResult);
            break;
        } else {
            i += 1;
        }
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

// Test the function
const testArray = [
    13, 35, 15, 31, 20, 33, 31, 2, 33, 32, 5, 24,
    13, 20, 32, 18, 19, 30, 28, 1, 32, 15,
    3, 2, 14, 4, 34, 3, 24, 23, 15, 24,
    26, 15, 27, 26, 26, 30, 24, 35, 15, 18, 18, 18, 18,
    17, 9, 29, 21, 11, 16, 12, 22, 36, 25,
    8, 7, 6, 4, 3, 5, 10, 23, 19, 27,
    32, 34, 33, 31, 28, 24, 2, 15, 20, 12,
    9, 0, 8, 6, 14, 1, 11, 5, 3, 21,
    29, 13, 34, 7, 22, 16, 18, 25, 26, 9,
    15, 32, 33, 17, 30, 8, 36, 10, 11, 2,
    4, 28, 23, 19, 27, 24, 20, 35, 13, 3,
    14, 6, 12, 1, 26, 16, 5, 9, 18, 22,
    34, 29, 21, 8, 7, 19, 36, 25, 25, 24, 15, 8
];

// Run the test
const backtestResults = calculateWinRateDetailed(testArray);

// Display the full results
console.log(JSON.stringify(backtestResults, null, 2));
