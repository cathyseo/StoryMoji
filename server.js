const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));
app.use(express.json());

// Route for the emoji selection page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route for the story results page
app.get('/story', (req, res) => {
    res.sendFile(__dirname + '/public/story.html');
});

// Endpoint to handle OpenAI API requests
app.post('/generate-story', async (req, res) => {
    // Log the entire request body and headers
    // console.log("Request Body:", req.body);
    // console.log("Request Headers:", req.headers);

    try {
        // Your existing code to handle the request
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: req.body.prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});






