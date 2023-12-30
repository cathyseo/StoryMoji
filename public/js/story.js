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
    let prompt = "Create a fairy tale story in an one sentence. The story is about ";
    selectedEmojisData.forEach((emoji, index) => {
        prompt += emoji.key + (index < selectedEmojisData.length - 1 ? ', ' : '');
    });
    return prompt;
}


function generateStory(prompt) {
    const messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ];

    console.log("Sending request with messages:", messages);

    fetch('/generate-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messages })
    })
    .then(response => {
        console.log("Received response:", response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Data from OpenAI:", data);
        displayGeneratedStory(data.message.content);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function displayGeneratedStory(story) {
    const output = document.getElementById('fairyTaleOutput');
    output.textContent = story; // Display the story returned from OpenAI
}
