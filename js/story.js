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
      "Fairy Story": "Create a short Disney-style gender-neutral fairy tale story.",
      "Horror": "Craft a short modern eerie horror story set in a contemporary urban environment.",
      "Dad Joke": "Tell an extremely short, pun-based dad joke.",
      "Breaking News": "This is strictly a short factual news report. Absolutely no storytelling, fictional narratives, or descriptive journeys.",
      "Sci-Fi": "Create a futuristic sci-fi story."
  };
  const lengthMapping = {
      "In 100 characters": "in strictly 100 characters.",
      "In 200 characters": "in strictly 200 characters.",
      "In 300 characters": "in strictly 300 characters."
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

  // Constructing the prompt without including emojis
  const promptIntro = storyTypes[confirmedTypeSelection];
  const promptLength = lengthMapping[confirmedLengthSelection] || "Default Prompt Length";
  let prompt = `${promptIntro}. Story ${promptLength}. The story is about`;

  selectedEmojisData.forEach((emoji, index) => {
      if (emoji && emoji.key) {
          prompt += ` ${emoji.key}${index < selectedEmojisData.length - 1 ? ',' : '.'}`;
      }
  });
  
    // GA4 Custom Event Tracking
    gtag('event', 'option-select', {
      'event_category': 'Selected options',
      'event_label': 'Selected options for story',
      'Selected_type': confirmedTypeSelection,
      'Selected_length': confirmedLengthLengthSelection,
      'Selected_emojis': selectedEmojisData.map(emoji => emoji.key).join(', ')
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
        const confirmedLengthSelection = localStorage.getItem('confirmedLengthSelection') || "In 100 characters";
        
        // Display selected emojis, type, and length
        await displaySelectedOptions(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection);

      if (selectedEmojisData && selectedEmojisData.length > 0) {
          // Generate the prompt
          const prompt = createPromptFromEmojis(selectedEmojisData, confirmedTypeSelection, confirmedLengthSelection);

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
    const response = await fetch('/api/server', { // URL 수정됨
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
  // Remove any starting and ending quotation marks
  story = story.replace(/^"|"$/g, '');

  // Split the story into sentences, keeping the punctuation with the sentence
  const sentences = story.match(/[^.!?]+[.!?]\s*/g);

  // Handle null if no sentences are found
  if (!sentences) {
    console.error('No sentences found in the story.');
    return;
  }

  // Join sentences with a space instead of wrapping in <p> tags
  const formattedStory = sentences.map(sentence => sentence.trim()).join(" ");

  // Set the innerHTML of the output element to the formattedStory
  const output = document.getElementById('fairyTaleOutput');
  output.innerHTML = formattedStory;
}







//Share button
document.getElementById('share').addEventListener('click', function(event) {
  event.preventDefault();

  // The main domain to be shared
  const mainDomain = 'https://www.storymoji.online';

  // Track the event with GA4 before the share functionality
  gtag('event', 'Header Share Click', {
    'event_category': 'Button Clicks',
    'event_label': 'Header Share Click'
  });

  // Function to check if the device is mobile
  function isMobileDevice() {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  // If it's a mobile device and the share API is supported, use the native share modal
  if (isMobileDevice() && navigator.share) {
      navigator.share({
          title: document.title,
          url: mainDomain // Share the main domain
      }).then(() => {
          console.log('Thanks for sharing!');
      }).catch(console.error);
  } else {
      // For non-mobile devices, use the existing clipboard functionality
      navigator.clipboard.writeText(mainDomain).then(function() { // Copy the main domain
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
document.getElementById("shareThisApp").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent any default action triggered by the button

  // Track the event with GA4
  gtag('event', 'Share This App Click', {
    'event_category': 'Button Clicks',
    'event_label': 'Share this app button on output page'
  });

  // Define your app link here
  const appLink = "https://www.storymoji.online"; // Replace with your actual app link

  // Copy the appLink to the clipboard
  navigator.clipboard.writeText(appLink).then(function() {
    // Show the "App link copied." message
    var appLinkCopied = document.getElementById('appLinkCopied');
    appLinkCopied.classList.add('active');

    // Optionally, hide the message after a few seconds
    setTimeout(function() {
        appLinkCopied.classList.remove('active');
    }, 2000); // Adjust time as needed

  }).catch(function(error) {
    // Handle any errors that occur during copy
    console.error('Could not copy text: ', error);
  });
});


//Try again button
function trackTryAgainEvent() {
  // Check if gtag is a function to avoid errors
  if (typeof gtag === 'function') {
    gtag('event', 'Try Again Click', {
      'event_category': 'Button Clicks', 
      'event_label': 'Try again'
    });
  }
  
  // Redirect after a delay
  setTimeout(function() {
    location.href = 'index.html';
  }, 500); // Increased delay to 500ms
}