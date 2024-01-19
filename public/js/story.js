let confirmedTypeSelection = "";

// Main story script
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
  });
  


  
function displayEmojis(selectedEmojisData, metadata) {
  const selectedEmojisContainer = document.getElementById('selectedEmojisPlaceholder');
  selectedEmojisContainer.innerHTML = selectedEmojisData
      .map(emoji => {
          const emojiData = metadata[emoji.key];
          return emojiData ? `<img src="${emojiData.styles['3D']}" alt="${emoji.key}" />` : '';
      })
      .join(' ');
}
  
// story.js
function createPromptFromEmojis(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection) {
  let storyTypes = {
      "Fairy Story": "Create a fairy tale story.",
      "Horror": "Create a horror movie story.",
      "Dad Joke": "Create a funny dad joke.",
      "Breaking News": "Create a breaking news story.",
      "Sci-Fi": "Create a sci-fi story."
  };

  let lengthMapping = {
      "1 sentence": "in 1 sentence.",
      "2 sentences": "in 2 sentences.",
      "3 sentences": "in 3 sentences."
  };

  let promptIntro = storyTypes[confirmedTypeSelection] || "Create a story.";
  // Check if confirmedLengthSelection is correctly passed
  console.log("Confirmed Length Selection:", confirmedLengthSelection); // Debugging line
  let promptLength = lengthMapping[confirmedLengthSelection] || "in 1 sentence.";
  let prompt = `${promptIntro} ${promptLength} The story involves `;

  selectedEmojisData.forEach((emoji, index) => {
      prompt += emoji.key + (index < selectedEmojisData.length - 1 ? ', ' : '.');
  });

  // Log the final prompt for debugging
  console.log("Generated Prompt:", prompt); // Debugging line
  return prompt;
}


// Function to load content and generate story
async function loadContent() {
  try {
      // Show loading animation
      document.getElementById('loadingAnimation').style.display = 'flex'; // Show the loading container

      // Retrieve the selections from local storage
      const confirmedLengthSelection = localStorage.getItem('confirmedLengthSelection') || "1 sentence";
      const confirmedTypeSelection = localStorage.getItem('confirmedTypeSelection') || "Default Type"; // Add this line if you're using story types

      // Retrieve the selected emojis data
      const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis'));

      if (selectedEmojisData && selectedEmojisData.length > 0) {
          // Generate the prompt
          const prompt = createPromptFromEmojis(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection);
          console.log("Generated Prompt:", prompt); // Debugging line

          // Call generateStory or similar function
          await generateStory(prompt); // Make sure this function is defined and properly sends the prompt to your backend

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
  }
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
  // Split the story into sentences, keeping the punctuation with the sentence
  const sentences = story.match(/[^.!?]+[.!?]\s*/g);

  // Wrap each sentence in <p> tags
  const formattedStory = sentences.map(sentence => `<p>${sentence.trim()}</p>`).join("");

  // Set the innerHTML of the output element to the formattedStory
  const output = document.getElementById('fairyTaleOutput');
  output.innerHTML = formattedStory;
}





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