function getLastUniqueNumbers(numbersArray) {
    const uniqueNumbers = [];
    const seenNumbers = new Set();

    for (let i = numbersArray.length - 1; i >= 0; i--) {
        const currentNumber = numbersArray[i];
        if (!seenNumbers.has(currentNumber)) {
            uniqueNumbers.push(currentNumber);
            seenNumbers.add(currentNumber);
        }
        if (uniqueNumbers.length === 18) break;
    }

    return uniqueNumbers.length === 18 ? uniqueNumbers.reverse() : null;
}

function getOppositeNumbers(uniqueNumbers) {
    const allNumbers = Array.from({ length: 37 }, (_, i) => i);
    return allNumbers.filter(num => !uniqueNumbers.includes(num));
}

function backtestStrategy(numbersArray, waitForLosses = 0) {
    const results = [];
    let winCount = 0;
    let lossCount = 0;
    let lastUniqueNumbers = [];
    let lossStreak = 0;
    let backtestStarted = waitForLosses === 0; // Initial condition if no wait required

    for (let i = 18; i < numbersArray.length - 1; i++) {
        const last18Unique = getLastUniqueNumbers(numbersArray.slice(i - 18, i + 1));

        if (last18Unique) {
            lastUniqueNumbers = last18Unique;
            const nextNumber = numbersArray[i + 1];

            // Check if waiting for losses to start backtesting
            if (!backtestStarted) {
                if (last18Unique.includes(nextNumber)) {
                    lossStreak++;
                } else {
                    lossStreak = 0;
                }

                if (lossStreak >= waitForLosses) {
                    backtestStarted = true; // Start backtest after required losses
                    lossStreak = 0;
                }
                continue;
            }

            // Actual backtesting logic
            if (!last18Unique.includes(nextNumber)) {
                winCount++;
                results.push({ position: i + 1, result: "Win", number: nextNumber });
                if (waitForLosses === 0) backtestStarted = true; // Restart for regular backtest
            } else {
                lossCount++;
                results.push({ position: i + 1, result: "Loss", number: nextNumber });
                if (waitForLosses > 0) {
                    backtestStarted = false; // Stop backtest until losses meet the threshold
                    lossStreak = 1; // Start new streak
                }
            }
        }
    }

    const totalAttempts = winCount + lossCount;
    const winRate = totalAttempts > 0 ? (winCount / totalAttempts) * 100 : 0;
    const oppositeNumbers = getOppositeNumbers(lastUniqueNumbers);

    return {
        winCount,
        lossCount,
        winRate: winRate.toFixed(2),
        results,
        oppositeNumbers
    };
}

// Test the function
const testArray = [
    3, 5, 3, 8, 9, 5, 3, 7, 5, 9, 3, 7, 3, 7, 9, 8, 7, 3, 8, 9, 5, 3, 6, 12, 15, 18, 21, 24, 27, 30, 33, 36,
    9, 0, 1, 2, 25, 14, 7, 16, 16, 16, 16, 16
];

console.log("== Normal Backtest ==");
console.log(backtestStrategy(testArray, 0)); // Regular backtest without wait

console.log("\n== Wait for 1 Loss ==");
console.log(backtestStrategy(testArray, 1)); // Start after one loss

console.log("\n== Wait for 2 Losses ==");
console.log(backtestStrategy(testArray, 2)); // Start after two consecutive losses
