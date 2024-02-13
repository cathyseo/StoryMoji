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
    "공포 영화": "현대 도시 환경에서 벌어지는 소름 끼치고 으스스한 공포 영화 스토리를 만듭니다. 귀신과 기이한 현상을 소재로 할 수 있습니다.",
    "공상과학 소설": "미래적인 우주 공상 과학 소설의 짧은 스토리를 만듭니다. 내러티브 보다는 글을 짧게 완성하는것에 집중합니다.",
    "연속극 드라마": "대기업 후계자 남성과 평범한 여성을 주인공으로 한 한국의 전형적이며 자극적인 연속극 드라마 속 연인의 대화입니다. 이들은 서로를 ~씨 등의 이름으로 부를 수 있습나다. '철수:' 또는 '영희:' 등의 indicator는 필요 없습니다. 억지로 영어를 번역하는 단어 보다는 한글을 사용하고 공식적이고 문어적 표현 보다는 구어체를 사용합니다. 대화는 그들의 사랑에 대한 가족의 반대에 관한 것입니다. 이들은 서로 존댓말로 대화합니다. 이야기의 자연스러움 보다는 전체 내용을 짧게 완결하는데 집중합니다.",
    "케이팝 가사": "BTS와 블랙핑크에서 영감을 받은 (하지만 가사에 그들을 언급하지 않고) 사랑, 자기 긍정에 초점을 맞춘 캐치한 가사의 짧은 부분을 만듭니다. 사람들이 춤추게 만드는 긍정적인 분위기를 목표로 하며, 'Verse', 'Chorus', 또는 숫자를 사용하지 않고 매끄럽게 작성합니다. 어떤 설명 문구 없이 가사만 만듭니다. 영어 말고 한글을 사용하고 존댓말은 사용하지 않습니다",
    "홈쇼핑 광고": "홈쇼핑 광고의 한 부분을 구어체로 작성합니다. 제품의 특징, 장점, 어떤 분들에게 좋은지 등을 강조하는 방식으로 구성되어야 합니다. 제품을 매력적으로 보이게 하고 구매 욕구를 자극해야 합니다. 예를 들어 '이번에 소개할 제품은 ~ 입니다!'로 시작할 수 있습니다."

  };
  const lengthMapping = {
    "2 문장 이내": "2 문장 이내의 완전히 완성된 글입니다.",
    "3 문장 이내": "3 문장 이내의 완전히 완성된 글입니다."
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
  const promptLength = lengthMapping[confirmedLengthSelection] || "기본 프롬프트 길이";
  let prompt = `${promptIntro} 이 스토리는 ${promptLength} 이 스토리는 다음에 관한 것입니다.`;

  selectedEmojisData.forEach((emoji, index) => {
      if (emoji && emoji.key) {
          prompt += ` ${emoji.key}${index < selectedEmojisData.length - 1 ? ',' : '.'}`;
      }
  });
  
// GA4 Custom Event Tracking
gtag('event', 'Option-select', {
  'event_category': 'Selected options',
  'event_label': 'Selected options for story',
  'Selected_type': confirmedTypeSelection,
  'Selected_length': confirmedLengthSelection, // Corrected from confirmedLengthLengthSelection
});

console.log("Final prompt:", prompt);

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

        // Track each emoji selection individually
        selectedEmojisData.forEach(emoji => {
          gtag('event', 'Option-select', {
              'event_category': 'Selected options',
              'event_label': 'Selected emojis for story',
              'Selected_emoji': emoji.key // Track each emoji key individually
          });
      });

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
  // Set the innerHTML of the output element directly to the story
  const output = document.getElementById('fairyTaleOutput');
  output.innerHTML = story.trim();
}







//Share button
document.getElementById('share').addEventListener('click', function(event) {
  event.preventDefault();

  // The main domain to be shared
  const mainDomain = 'https://www.kr.storymoji.online';

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
  const appLink = "https://www.kr.storymoji.online"; // Replace with your actual app link

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