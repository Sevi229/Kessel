const fs = require('fs');
fs.readFile('numbers.txt', 'utf8', function(err, data) {
    if (err) {
        console.error(err);
        return;
    }
    var number = data.split('\n').map(Number);
    var numbers = [];
    numbers.push(...number); 
    console.log("Test");

    var probabilities = {};
    var rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    console.log(calculateProbabilities(numbers));
});



//var welche alle nummern enthält. für jede nummer sollte die wahrscheindlichkeit der nächsten nummer drin stehen z.b 0 -> Wahrscheindlichkeit dass 0 = 2%,  1 = 2%, 2 = 5%, 3 = 2%, 4 = 3%, 5 = 1% usw. 
function calculateProbabilities(numbers) {
    var probabilities = {};
    for (var i = 0; i < numbers.length - 1; i++) {
        var currentNumber = numbers[i];
        var nextNumber = numbers[i + 1];
        if (!probabilities[currentNumber]) {
            probabilities[currentNumber] = {};
        }
        if (!probabilities[currentNumber][nextNumber]) {
            probabilities[currentNumber][nextNumber] = 0;
        }
        probabilities[currentNumber][nextNumber]++;
    }
    return probabilities;
}



