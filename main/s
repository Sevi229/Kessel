function evaluateArray(arr) {
  // Initialisiere das Mehrdimensionale Array zur Speicherung der Ergebnisse
  let resultArray = [];

  // Definiere die Array-Länge für den Iterationsbereich
  let arrayLength = arr.length;

  // Iteriere über das Array mit drei verschachtelten forEach-Schleifen
  [2, 3, 4, 5, 6, 7].forEach(num1 => {
      [27, 24, 18, 12, 9].forEach(num2 => {
          let isValid = true; // Setze die Bedingung zunächst auf gültig
          let hasK = false; // Initialisiere den Wert für 'k'

          // Überprüfe, ob genug Elemente im Array vorhanden sind
          if (arrayLength < num1) {
              isValid = false; // Setze die Bedingung auf ungültig, wenn nicht genügend Elemente vorhanden sind
          } else {
              for (let i = arrayLength - num1; i < arrayLength; i++) {
                  // Überprüfe, ob das Kriterium erfüllt ist
                  let diff = Math.max(...arr.slice(i - num1 + 1, i + 1)) - Math.min(...arr.slice(i - num1 + 1, i + 1));
                  if (diff >= num2) {
                      isValid = false; // Setze die Bedingung auf ungültig, wenn das Kriterium nicht erfüllt ist
                      break; // Beende die Schleife, wenn die Bedingung nicht erfüllt ist
                  }
                  if (arr[i] === 'k') {
                      hasK = true; // Setze 'k' auf true, wenn es zwischen den letzten 'num1' Elementen vorkommt
                  }
              }
          }







          
          // Füge das Ergebnis in das Mehrdimensionale Array ein
          let result = isValid ? (hasK ? 'F' : 'T') : 'F'; // Wenn isValid true ist, prüfe ob 'k' vorhanden ist, ansonsten ist das Ergebnis 'F'
          resultArray.push([num1, num2, result]);
      });
  });

  return resultArray;
}
