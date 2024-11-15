const fetch = require('node-fetch'); // Ensure node-fetch is installed
const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

(async () => {
    // Step 1: Set up the Express server
    const app = express();
    const PORT = 4000;

    // Middleware to parse JSON requests
    app.use(express.json());

    // Define the path to the main directory
    const mainDir = path.join(__dirname, 'main');

    // Serve the index.html file from the main directory
    app.get('/', (req, res) => {
        res.sendFile(path.join(mainDir, 'V4.0A.html'));
    });

    // Endpoint to receive betting data array
    app.post('/receive-array', (req, res) => {
        const receivedArray = req.body.array;

        // Log received data
        receivedArray.forEach((entry, index) => {
            const { repeat, betting, multiplier } = entry;
            console.log(`Entry ${index + 1} - Repeat: ${repeat}, Betting: ${betting}, Multiplier: ${multiplier}`);
        });

        // Send response
        res.send({ message: 'Array received successfully', data: receivedArray });
    });

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Step 2: Start Puppeteer and close any default blank page
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });

    const pages = await browser.pages();
    if (pages.length > 0) {
        await pages[0].close();
    }

    // Open jackpots.ch in the first tab
    const page = await browser.newPage();
    await page.goto('https://jackpots.ch');

    // Open a new tab to load the local server (localhost:4000)
    const localPage = await browser.newPage();
    await localPage.goto('http://localhost:4000');

    // Switch back to the jackpots.ch tab
    await page.bringToFront();

    // Step 3: Polling function to periodically request data from /receive-array
    async function fetchReceivedArray() {
        try {
            const response = await fetch('http://localhost:4000/receive-array', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ array: [] }) // Trigger the route
            });
            const data = await response.json();
            console.log("Fetched data:", data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Set an interval to fetch data every 5 seconds
    setInterval(fetchReceivedArray, 5000);

})();
