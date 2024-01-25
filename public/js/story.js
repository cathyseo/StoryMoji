let confirmedTypeSelection = "";
let currentHeight = 20; // Y position for drawing
let currentWidth = 20; // X position for drawing emojis
const emojiSize = 32; // Size of each emoji glyph

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
      "Fairy Story": "Create a Disney-style gender-neutral fairy tale story.",
      "Horror": "Craft a modern horror story set in a contemporary urban environment. The plot should revolve around eerie, unexplained phenomena, causing escalating tension among the characters. Incorporate elements of suspense, unexpected twists, and psychological depth to create an atmosphere of dread. Technology or modern societal themes may play a role in the storyline, contributing to the contemporary setting and the characters' interactions.",
      "Dad Joke": "Tell an extremely short, pun-based dad joke.",
      "Breaking News": "This is strictly a factual news report. Absolutely no storytelling, fictional narratives, or descriptive journeys...",
      "Sci-Fi": "Create a sci-fi story."
  };
  const lengthMapping = {
      "1 sentence": "in 1 sentence.",
      "2 sentences": "in 2 sentences.",
      "3 sentences": "in 3 sentences."
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
  const promptLength = lengthMapping[confirmedLengthSelection] || "Default Prompt Length";
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
      const confirmedLengthSelection = localStorage.getItem('confirmedLengthSelection') || "1 sentence";
      // Ensure the default type is a valid key from `storyTypes`, for example, "Fairy Story"
      const confirmedTypeSelection = localStorage.getItem('confirmedTypeSelection') || "Fairy Story"; 

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


//Save as an image
document.getElementById('saveAsImage').addEventListener('click', function() {
  const buttonContainer = document.getElementById('outputButtonContainer');
  buttonContainer.style.display = 'none';

  fetch('metadata.json')
      .then(response => response.json())
      .then(metadata => {
          const selectedEmojiData = JSON.parse(localStorage.getItem('selectedEmojis')) || [];
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 600;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const storyText = document.getElementById('fairyTaleOutput').innerText;
          const emojiSize = 60;
          const textFontSize = 24;
          const maxWidth = 720;
          const lineHeight = 40;
          const spaceBetweenEmojisAndText = 40;

          // Calculate the number of lines the text will wrap into and the total height of the text block
          const textHeightApprox = getTextHeight(ctx, storyText, maxWidth, textFontSize, lineHeight);

          // Calculate the total content height
          const totalContentHeight = emojiSize + textHeightApprox + spaceBetweenEmojisAndText;

          // Center the content vertically
          let currentHeight = (canvas.height - totalContentHeight) / 2;
          if (currentHeight < emojiSize / 2) currentHeight = emojiSize / 2;

          let currentWidth = 20;

          // Draw the selected emojis
          ctx.font = `${emojiSize}px Poppins`;
          selectedEmojiData.forEach(emojiData => {
              const emoji = metadata[emojiData.key];
              if (emoji && emoji.glyph) {
                  ctx.fillText(emoji.glyph, currentWidth, currentHeight + emojiSize);
                  currentWidth += emojiSize + 10;
              }
          });

          // Draw the story text after the emojis
          ctx.font = `${textFontSize}px Poppins`;
          const textX = 20;
          let textY = currentHeight + emojiSize + spaceBetweenEmojisAndText;

          wrapText(ctx, storyText, textX, textY, maxWidth, lineHeight);

          const dataURL = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = 'generated_story.png';
          link.href = dataURL;
          link.click();

          buttonContainer.style.display = 'flex';
      })
      .catch(error => {
          console.error('Error fetching metadata:', error);
          buttonContainer.style.display = 'flex';
      });
});

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  context.fillText(line, x, y);
}

function getTextHeight(ctx, text, maxWidth, fontSize, lineHeight) {
  ctx.font = `${fontSize}px Poppins`; // Set the font to get accurate measurement
  const textLines = getTextLines(ctx, text, maxWidth);
  return textLines * lineHeight; // Total height of the text block
}

function getTextLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;

  for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          line = words[n] + ' ';
          lineCount++;
      } else {
          line = testLine;
      }
  }
  lineCount++; // Add the last line
  return lineCount;
}


function getUserSelectedEmojis() {
  // Implement this function to return an array of keys of the selected emojis
  // For example: ['Grinning face with smiling eyes', 'Grinning face with sweat']
  // The exact implementation will depend on how your app tracks user selections
}
