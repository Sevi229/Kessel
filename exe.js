// Import required modules
const express = require('express');
const path = require('path');

(async () => {
    // Dynamically import node-fetch as it's an ES module
    const fetch = (await import('node-fetch')).default;

    // Step 1: Set up the Express server
    const app = express();
    const PORT = 5000;
    const launchBrowser = async () => {
        try {
            const puppeteer = require('puppeteer'); // Import Puppeteer here
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--start-maximized'],
                defaultViewport: null
            });
            return browser;
        } catch (error) {
            console.error("Error launching Puppeteer:", error);
            throw error;
        }
    };
  
    // Middleware to parse JSON requests
    app.use(express.json());

    // Define the path to the main directory
    const mainDir = path.join(__dirname, 'main');

    // Serve the index.html file from the main directory
    app.get('/', (req, res) => {
        res.sendFile(path.join(mainDir, 'V4.0A.html'));
    });
   
    let BetNow = [];
    let BetLater = [];
    let multiplier1String = '';
    let multiplier2String = '';
    let multiplier4String = '';
    let multiplierCustomString = '';
    let autobetsafe = true;

    const browser = await launchBrowser();

    // Open jackpots.ch in the first tab
    const page = await browser.newPage();
    // Endpoint to receive betting data array
    app.post('/receive-array', (req, res) => {
        let receivedArray = req.body.array;
    
        receivedArray.forEach((entry, index) => {
            let { repeat, betting, multiplier, tabchange, autobet, clean } = entry;
            console.log(`Entry ${index + 1} - Repeat: ${repeat}, Betting: ${betting}, Multiplier: ${multiplier}, tabchange: ${tabchange} , Autobet: ${autobet} , Clean: ${clean}` );
    
            // Set globalsync only if it has not been set before
         
            if (tabchange === undefined && autobet === undefined && clean === undefined) {
            // Add entry to BetNow array
            BetNow.push(entry);
    
            // If repeat is greater than 1, add a modified copy to BetLater and reduce repeat by 1
            if (repeat > 1) {
                let entryLater = {
                    repeat: repeat - 1,
                    betting,
                    multiplier,
                    sync
                };
                BetLater.push(entryLater);
            } else {
                // Remove the entry from BetLater if repeat is 1 or less
                BetLater = BetLater.filter(item => item !== entry);
            }
    
            console.log("BetNow:", BetNow);
            console.log("BetLater:", BetLater);
    
            // Update multiplier strings based on BetNow
            BetNow.forEach(entry => {
                let bettingArray = entry.betting.split(',').map(Number); // Convert betting string to an array of numbers
                let sortedBetting = bettingArray.sort((a, b) => a - b).join(', ');
            
                if (entry.multiplier === 1) {
                    multiplier1String += (multiplier1String ? ', ' : '') + sortedBetting;
                } else if (entry.multiplier === 2) {
                    multiplier2String += (multiplier2String ? ', ' : '') + sortedBetting;
                } else if (entry.multiplier === 4) {
                    multiplier4String += (multiplier4String ? ', ' : '') + sortedBetting;
                } else {
                    multiplierCustomString += (multiplierCustomString ? ', ' : '') + sortedBetting;
                }
            });
            
            // Sort the final concatenated strings
            multiplier1String = multiplier1String.split(', ').map(Number).sort((a, b) => a - b).join(', ');
            multiplier2String = multiplier2String.split(', ').map(Number).sort((a, b) => a - b).join(', ');
            multiplier4String = multiplier4String.split(', ').map(Number).sort((a, b) => a - b).join(', ');
            multiplierCustomString = multiplierCustomString.split(', ').map(Number).sort((a, b) => a - b).join(', ');
            
            console.log("Multiplier 1:", multiplier1String);
            console.log("Multiplier 2:", multiplier2String);
            console.log("Multiplier 4:", multiplier4String);
            console.log("Custom Multiplier:", multiplierCustomString); 
        }else{
            autobetsafe = autobet;
        }
        
        const firstTab = pages[0]; // Ensure this is the first tab
        if(clean == true){    BetNow = [];
             BetLater = [];
             multiplier1String = '';
             multiplier2String = '';
             multiplier4String = '';
             multiplierCustomString = ''; }
        if(tabchange == true){page.bringToFront();}
        if (autobetsafe && pages.indexOf(firstTab) === 0) {
            console.log("Autobetsafe is true and you are on the first tab. Executing function immediately...");
            executeFunction()
              .then(() => {
                console.log("Function executed successfully.");
              })
              .catch((error) => {
                console.error("Error executing the function:", error);
              });
          } else {
            console.log("Either Autobetsafe is false or you are not on the first tab. Waiting for Enter key...");
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', (key) => {
              if (key.toString() === '\r') { // '\r' is the Enter key
                console.log("Enter key pressed, executing the function...");
                executeFunction()
                  .then(() => {
                    console.log("Function executed successfully.");
                    process.stdin.pause(); // Stop listening after execution
                  })
                  .catch((error) => {
                    console.error("Error executing the function:", error);
                  });
              }
            });
          }
    
            
        });
    
        res.send({ message: 'Array received successfully', data: receivedArray });
    });
    
   

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });


    const pages = await browser.pages();
    if (pages.length > 0) {
        await pages[0].close();
    }

    await page.goto('https://jackpots.ch');

    // Open a new tab to load the local server (localhost:4000)
    const localPage = await browser.newPage();
    await localPage.goto('http://localhost:5000');

    // Switch back to the jackpots.ch tab
    await page.bringToFront();
    // Step 2: Define the launch function with error handling for Puppeteer


    // Initialize Puppeteer and open pages
   

    // Function to periodically fetch the latest data from /receive-array
  
})();
