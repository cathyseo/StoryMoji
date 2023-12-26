const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static('public'));

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
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: req.body.prompt, // or construct your prompt based on request data
            max_tokens: 150 // or any other parameters
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while calling OpenAI API');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});






