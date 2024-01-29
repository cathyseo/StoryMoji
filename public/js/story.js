let confirmedTypeSelection = "";
let currentHeight = 20; // Y position for drawing
let currentWidth = 20; // X position for drawing emojis
const emojiSize = 32; // Size of each emoji glyph


//Logo link
document.getElementById('logo').addEventListener('click', function() {
  window.location.href = 'index.html';
});


// Define the generateNewStory function here, outside of the DOMContentLoaded listener
function generateNewStory() {
  const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis')) || [];
  const confirmedTypeSelection = localStorage.getItem('confirmedTypeSelection') || "Fairy Story";
  const confirmedLengthSelection = localStorage.getItem('confirmedLengthSelection') || "1 sentence";

  const prompt = createPromptFromEmojis(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection);
  console.log("Generated Prompt for new story:", prompt);

  // Make sure generateStory is defined and can be called here
  generateStory(prompt);
}

// Main story script
document.addEventListener('DOMContentLoaded', function() {
  loadContent();

  // Add the event listener for the 'Generate New Story' button here
  document.getElementById('generateNewStoryBtn').addEventListener('click', generateNewStory);
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
  // Story Types and Length Mapping
  const storyTypes = {
      "Fairy Story": "Create a Disney-style gender-neutral fairy tale story.",
      "Horror": "Craft a modern horror story set in a contemporary urban environment. The plot should revolve around eerie, unexplained phenomena, causing escalating tension among the characters. Incorporate elements of suspense, unexpected twists, and psychological depth to create an atmosphere of dread. Technology or modern societal themes may play a role in the storyline, contributing to the contemporary setting and the characters' interactions.",
      "Dad Joke": "Tell an extremely short, pun-based dad joke.",
      "Breaking News": "This is strictly a factual news report. Absolutely no storytelling, fictional narratives, or descriptive journeys...",
      "Sci-Fi": "Create a sci-fi story."
  };
  // Update lengthMapping to reflect the character count choices
  const lengthMapping = {
    "Under 100 characters": "with a maximum of 100 characters.",
    "Under 200 characters": "with a maximum of 200 characters.",
    "Under 300 characters": "with a maximum of 300 characters."
};


  // Debugging: Log the keys of storyTypes and the confirmed selections
  console.log("Available story types:", Object.keys(storyTypes));
  console.log("User's confirmed type selection:", confirmedTypeSelection);
  console.log("User's confirmed length selection:", confirmedLengthSelection);

  // Validating the confirmedTypeSelection against storyTypes
  if (!(confirmedTypeSelection in storyTypes)) {
      console.log("Error: Selected type does not exist in storyTypes:", confirmedTypeSelection);
      // Handle the invalid selection appropriately
      // For now, returning an error message.
      return "Error: Invalid story type selected.";
  } else {
      console.log("Selected type is valid, proceeding with generation.");
  }

  // Constructing the prompt
  const promptIntro = storyTypes[confirmedTypeSelection];
  const promptLength = lengthMapping[confirmedLengthSelection] || "with a default maximum character count.";
  let prompt = `${promptIntro}. Story ${promptLength}. And the story involves`;

  selectedEmojisData.forEach((emoji, index) => {
      if (emoji && emoji.key) {
          prompt += ` ${emoji.key}${index < selectedEmojisData.length - 1 ? ',' : '.'}`;
      }
  });

  // Debugging: Log the final prompt for validation
  console.log("Generated Prompt:", prompt);

  // Return the generated prompt
  return prompt;
}



// Function to load content and generate story
async function loadContent() {
  try {
      // Show loading animation
      document.getElementById('loadingAnimation').style.display = 'flex'; // Show the loading container

        // Retrieve the selections from local storage
        const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis')) || [];
        const confirmedTypeSelection = localStorage.getItem('confirmedTypeSelection') || "Fairy Story";
        const confirmedLengthSelection = localStorage.getItem('confirmedLengthSelection') || "1 sentence";
        
        // Display selected emojis, type, and length
        await displaySelectedOptions(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection);

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

// Display output selected options
async function displaySelectedOptions(selectedEmojisData, type, length) {
  // Fetch emoji metadata
  const metadataResponse = await fetch('metadata.json');
  if (!metadataResponse.ok) throw new Error('Failed to load emoji metadata');
  const metadata = await metadataResponse.json();

  // Display selected emojis as 3D images
  const selectedEmojisContainer = document.getElementById('outputSelectedEmojis');
  selectedEmojisContainer.innerHTML = selectedEmojisData
      .map(emoji => {
          const emojiData = metadata[emoji.key]; // Adjusted to match the structure used in displayEmojis
          return emojiData ? `<img src="${emojiData.styles['3D']}" alt="${emoji.key}" style="width:32px;height:32px;" />` : '';
      })
      .join(' ');

  // Display selected story type and length without labels
  document.getElementById('outputSelectedType').textContent = type;
  document.getElementById('outputSelectedLength').textContent = length;
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
  // Directly set the innerHTML of the output element to the story wrapped in a single <p> tag
  const output = document.getElementById('fairyTaleOutput');
  output.innerHTML = `<p>${story}</p>`; // Display the story in a single paragraph.
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

document.getElementById('copyBtn').addEventListener('click', function() {
  // Fetch the metadata.json
  fetch('metadata.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse JSON data from the response
      })
      .then(metadata => {
          // Now we have the metadata, proceed with the rest of the code
          
          // Get the story text
          const storyText = document.getElementById('fairyTaleOutput').innerText;

          // Get the selected emojis data
          const selectedEmojisData = JSON.parse(localStorage.getItem('selectedEmojis'));
          console.log('Selected Emojis Data:', selectedEmojisData);

          // Extract glyph data from metadata and concatenate with the story text
          const emojiGlyphs = selectedEmojisData.map(emoji => {
              const emojiData = metadata[emoji.key];
              return emojiData ? emojiData.glyph : ''; // Use the glyph field from the metadata
          }).join(' '); // Join the glyphs with a space
          console.log('Emoji Glyphs:', emojiGlyphs);

          // Add a line break after emojis if there are any
          const fullTextToCopy = emojiGlyphs.length > 0 ? `${emojiGlyphs}\n\n${storyText}` : storyText;
          console.log('Full Text to Copy:', fullTextToCopy);

          // Copy the full text (with emojis) to the clipboard
          navigator.clipboard.writeText(fullTextToCopy)
              .then(() => {
                  console.log('Story with emojis copied to clipboard successfully.');
                  var storyCopied = document.getElementById('storyCopied');
                  storyCopied.classList.add('active');
                  setTimeout(function() {
                      storyCopied.classList.remove('active');
                  }, 1000); // Duration for the message display
              })
              .catch(err => {
                  console.error('Failed to copy story with emojis: ', err);
              });
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });
});

//Share this app button
document.getElementById("shareThisApp").addEventListener("click", function() {
  
  // Define your app link here
  const appLink = "https://your-app-link.com"; // Replace with your actual app link



  // Show the "App link copied." message
  var appLinkCopied = document.getElementById('appLinkCopied');
  appLinkCopied.classList.add('active');

  // Optionally, hide the message after a few seconds
  setTimeout(function() {
      appLinkCopied.classList.remove('active');
  }, 1000); // Adjust time as needed, matches the time for storyCopied
});
