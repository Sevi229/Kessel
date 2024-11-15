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
  let backtestStarted = waitForLosses === 0; // Normal backtest starts immediately

  for (let i = 18; i < numbersArray.length - 1; i++) {
      const last18Unique = getLastUniqueNumbers(numbersArray.slice(i - 18, i + 1));

      if (last18Unique) {
          lastUniqueNumbers = last18Unique;
          const nextNumber = numbersArray[i + 1];

          if (!backtestStarted) {
              if (last18Unique.includes(nextNumber)) {
                  lossStreak++;
              } else {
                  lossStreak = 0;
              }

              // Check if the required loss streak is met
              if (lossStreak >= waitForLosses) {
                  backtestStarted = true;
                  lossStreak = 0; // Reset loss streak for next backtest round
              }
              continue;
          }

          // Perform backtest calculation once condition is met
          if (!last18Unique.includes(nextNumber)) {
              winCount++;
              results.push({ position: i + 1, result: "Win", number: nextNumber });
              if (waitForLosses === 0) backtestStarted = true; // Normal backtest continues immediately
          } else {
              lossCount++;
              results.push({ position: i + 1, result: "Loss", number: nextNumber });
              if (waitForLosses > 0) {
                  backtestStarted = false; // Stop backtest and wait for the specified losses again
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
      oppositeNumbers,
      waitForLosses
  };
}

// Testing the function with multiple conditions
const testArray = [
  3, 5, 3, 8, 9, 5, 3, 7, 5, 9, 3, 7, 3, 7, 9, 8, 7, 3, 8, 9, 5, 3, 6, 12, 15, 18, 21, 24, 27, 30, 23, 4, 5, 6]


console.log("== Normal Backtest ==");
console.log(backtestStrategy(testArray, 0));

console.log("\n== Wait for 1 Loss ==");
console.log(backtestStrategy(testArray, 1));

console.log("\n== Wait for 2 Losses ==");
console.log(backtestStrategy(testArray, 2));

console.log("\n== Wait for 3 Losses ==");
console.log(backtestStrategy(testArray, 3));

console.log("\n== Wait for 4 Losses ==");
console.log(backtestStrategy(testArray, 4));

console.log("\n== Wait for 5 Losses ==");
console.log(backtestStrategy(testArray, 5));

console.log("\n== Wait for 6 Losses ==");
console.log(backtestStrategy(testArray, 6));
