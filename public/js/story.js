let confirmedTypeSelection = "";

// Main story script
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
  });
  
  async function loadContent() {
    try {
      // Show loading animation
      document.getElementById('loadingAnimation').style.display = 'flex'; // Show the loading container
  
      const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis'));
      if (selectedEmojisData && selectedEmojisData.length > 0) {
        const prompt = createPromptFromEmojis(selectedEmojisData);
        await generateStory(prompt); // This function now needs to be async
  
        // Fetch and display selected emoji 3D images
        const metadataResponse = await fetch('metadata.json');
        if (!metadataResponse.ok) throw new Error('Failed to load emoji metadata');
        const metadata = await metadataResponse.json();
  
        displayEmojis(selectedEmojisData, metadata);
      }
  
      // Hide loading animation and show the story content
      document.getElementById('loadingAnimation').style.display = 'none';
      document.getElementById('storyView').style.display = 'block';
    } catch (error) {
      console.error('Error loading content:', error);
      // Handle any errors appropriately here
    }
  }
  
  function displayEmojis(selectedEmojisData, metadata) {
    const selectedEmojisContainer = document.getElementById('selectedEmojisPlaceholder');
    selectedEmojisContainer.innerHTML = selectedEmojisData
        .map(emoji => {
            const emojiData = metadata[emoji.key];
            return emojiData ? `<img src="${emojiData.styles['3D']}" alt="${emoji.key}" />` : '';
        })
        .join(' ');
  }
  
  function createPromptFromEmojis(selectedEmojisData) {
    let storyTypes = {
        "Fairy Story": "Create a fairy tale story in one sentence. The story is about ",
        "Horror": "Create a horror movie story in one sentence. The story is about ",
        "Dad Joke": "Create a funny dad joke in one sentence. The joke is about ",
        "Breaking News": "Create a breaking news story in one sentence. The story is about ",
        "Sci-Fi": "Create a sci-fi story in one sentence. The story is about "
    };

    let promptIntro = storyTypes[confirmedTypeSelection] || "Create a story in one sentence. The story is about ";
    let prompt = promptIntro;

    selectedEmojisData.forEach((emoji, index) => {
        prompt += emoji.key + (index < selectedEmojisData.length - 1 ? ', ' : '');
    });
    return prompt;
}

  
  async function generateStory(prompt) {
    const messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ];
  
    try {
      const response = await fetch('/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: messages })
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      displayGeneratedStory(data.message.content);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function displayGeneratedStory(story) {
    const output = document.getElementById('fairyTaleOutput');
    output.textContent = story;
  }
  
  document.getElementById('tryAgainBtn').addEventListener('click', function() {
    localStorage.removeItem('selectedEmojis');
    window.location.href = 'index.html'; // Updated to match your HTML
  });
  




//Share button
document.getElementById('share').addEventListener('click', function(event) {
  event.preventDefault();

  // Function to check if the device is mobile
  function isMobileDevice() {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  // If it's a mobile device, use the native share modal
  if (isMobileDevice() && navigator.share) {
      navigator.share({
          title: document.title,
          url: window.location.href
      }).then(() => {
          console.log('Thanks for sharing!');
      }).catch(console.error);
  } else {
      // For non-mobile devices, use the existing clipboard functionality
      navigator.clipboard.writeText(window.location.href).then(function() {
          var linkCopied = document.getElementById('linkCopied');
          linkCopied.classList.add('active');
          setTimeout(function() {
              linkCopied.classList.remove('active');
          }, 1000); // Duration for the message display
      }, function(err) {
          console.error('Could not copy text:', err);
      });
  }
});