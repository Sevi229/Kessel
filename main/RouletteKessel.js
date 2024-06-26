// var numbers = [];
//     for (var i = 0; i < 500; i++) {
//         numbers.push(Math.floor(Math.random() * 37));
//     }
//     var rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    
//     console.log(calculateProbabilities(numbers));
//     var numberOccurrences = countOccurrences(numbers);
//     console.log(numberOccurrences);
//     var numberDistances = calculateDistances(numbers, rouletteOrder);
//     console.log(numberDistances);

document.addEventListener('DOMContentLoaded', (event) => {
    var numbers = [];
    for (var i = 0; i < 500; i++) {
        numbers.push(Math.floor(Math.random() * 37));
    }
    var rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    
    console.log(calculateProbabilities(numbers));
    var numberOccurrences = countOccurrences(numbers);
    console.log(numberOccurrences);
    var numberDistances = calculateDistances(numbers, rouletteOrder);
    console.log(numberDistances);
    
    document.getElementById('myDiv').textContent = 'Apfel';
});

//Schaut in in arr für jede zahl welche zahl wie viel mal als nächstes gekommen ist
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

//Zählt wie oft eine Zahl vorkommt
function countOccurrences(numbers) {
    var occurrences = {};
    for (var i = 0; i < numbers.length; i++) {
        var number = numbers[i];
        if (!occurrences[number]) {
            occurrences[number] = { count: 0, percentage: 0 };
        }
        occurrences[number].count++;
    }

    for (var number in occurrences) {
        occurrences[number].percentage = parseFloat(((occurrences[number].count / numbers.length) * 100).toFixed(2));
    }

    return occurrences;
}

//Kesselgucken
function calculateDistances(numbers, rouletteOrder) {
    var distances = [];
    for (var i = 0; i < numbers.length - 1; i++) {
        var currentNumber = numbers[i];
        var nextNumber = numbers[i + 1];
        var currentIndex = rouletteOrder.indexOf(currentNumber);
        var nextIndex = rouletteOrder.indexOf(nextNumber);
        var distance;
        if (nextIndex >= currentIndex) {
            distance = nextIndex - currentIndex;
        } else {
            distance = nextIndex - currentIndex + 37;
        }
        if (!distances[distance]) {
            distances[distance] = { distance: distance, count: 0, percentage: 0 };
        }
        distances[distance].count++;
    }

    var totalDistances = numbers.length - 1;
    for (var i = 0; i < distances.length; i++) {
        if (distances[i]) {
            distances[i].percentage = parseFloat(((distances[i].count / totalDistances) * 100).toFixed(2));
        }
    }

    return distances;
}

