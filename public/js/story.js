document.addEventListener('DOMContentLoaded', function() {
    displayStory();

    document.getElementById('tryAgainBtn').addEventListener('click', function() {
        localStorage.removeItem('selectedEmojis');
        window.location.href = '/';
    });
});

function displayStory() {
    const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis'));
    if (selectedEmojisData && selectedEmojisData.length > 0) {
        const prompt = createPromptFromEmojis(selectedEmojisData);
        generateStory(prompt);
    }
}

function createPromptFromEmojis(selectedEmojisData) {
    // Construct a prompt based on selected emojis
    // This is an example. Modify it according to your needs.
    let prompt = "Create a fairy tale story about ";
    selectedEmojisData.forEach((emoji, index) => {
        prompt += emoji.key + (index < selectedEmojisData.length - 1 ? ', ' : '');
    });
    return prompt;
}

function generateStory(prompt) {
    fetch('/generate-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        displayGeneratedStory(data.choices[0].text);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayGeneratedStory(story) {
    const output = document.getElementById('fairyTaleOutput');
    output.textContent = story; // Display the story returned from OpenAI
}
