const express = require('express');
const { OpenAI } = require('openai');

const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));
app.use(express.json());

const openai = new OpenAI(process.env.OPENAI_API_KEY);

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
    try {
        console.log("Received messages:", req.body.messages);

        // Update lengthTokenMapping to reflect the character count choices
        const lengthTokenMapping = {
            "Under 100 characters": 25,
            "Under 200 characters": 50,
            "Under 300 characters": 75
        };

        const maxTokens = lengthTokenMapping[req.body.confirmedLengthSelection] || 25; // default to the shortest if not specified

        const completion = await openai.chat.completions.create({
            messages: req.body.messages,
            model: "gpt-4",
            max_tokens: maxTokens
        });

        console.log("OpenAI response:", completion);
        res.json(completion.choices[0]);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
