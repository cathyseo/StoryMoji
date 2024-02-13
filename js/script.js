let activeEmojis = new Set(); // To keep track of activated emojis
let confirmedLengthSelection = null; // Initialize with null
let confirmedTypeSelection = null; // Initialize with null

//Logo link
document.getElementById('logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});


// Function to log the current state of options
function logCurrentState() {
    console.log({
        Emojis: activeEmojis.size > 0 ? [...activeEmojis] : 'null',
        Type: confirmedTypeSelection === null ? 'null' : confirmedTypeSelection,
        Length: confirmedLengthSelection === null ? 'null' : confirmedLengthSelection
    });
}

// Function to check and log the initial state of selection variables
function checkInitialState() {
    console.log('Initial State: ', {
        emojis: activeEmojis.size > 0 ? 'Not null' : 'null',
        length: confirmedLengthSelection,
        type: confirmedTypeSelection
    });
}

// Attach the checking function to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    checkInitialState(); // Check and log the initial state

    // ... (rest of your existing code) ...
});

// Event listeners for the Story Type Modal
document.getElementById("typeButton").addEventListener("click", function() {
    document.getElementById("typeModal").style.display = "block";
    updateActiveTypeState(); // Update the active state based on the confirmed selection
});

document.getElementById("closeTypeModal").addEventListener("click", function() {
    document.getElementById("typeModal").style.display = "none";
});

document.getElementById("saveTypeModal").addEventListener("click", function() {
    const activeTypeOption = document.querySelector('.typeOption.active');
    if (activeTypeOption) {
        // If a type is selected, proceed to save the selection
        confirmedTypeSelection = activeTypeOption.textContent;
        // Save the type selection in local storage
        localStorage.setItem('confirmedTypeSelection', confirmedTypeSelection);

        const selectedTypeDiv = document.getElementById('selectedType');
        
        // Remove existing text node if it exists
        if (selectedTypeDiv.childNodes[0].nodeType === Node.TEXT_NODE) {
            selectedTypeDiv.removeChild(selectedTypeDiv.childNodes[0]);
        }

        // Insert new text content before the delete image
        selectedTypeDiv.insertBefore(document.createTextNode(confirmedTypeSelection), selectedTypeDiv.firstChild);

        // Display the selectedType div with flex style after saving
        selectedTypeDiv.style.display = 'flex';

        // Close the type modal after saving
        document.getElementById("typeModal").style.display = "none";

        // Hide the type error message if it was previously visible
        document.getElementById('typeErrorMessage').style.display = 'none';
    } else {
        // If no type is selected, display the type error message
        document.getElementById('typeErrorMessage').style.display = 'flex';
    }
    logCurrentState(); // Log the current state after saving type

    updateGenerateButtonState(); // Update Generate button state after saving

    updateErrorMessage(); // Update error message state after saving

});




function updateActiveTypeState() {
    const typeOptions = document.querySelectorAll('.typeOption');
    typeOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.textContent === confirmedTypeSelection) {
            opt.classList.add('active');
        }
    });
}








//Story type, Length modal
document.addEventListener('DOMContentLoaded', function() {

    // Event listener for opening the Story Type Modal
    document.getElementById("typeButton").addEventListener("click", function() {
        document.getElementById("typeModal").style.display = "block";
    });

    // Event listener for closing the Story Type Modal using the Close button
    // Note: Ensure you have unique IDs for each modal's Close and Save buttons
    document.getElementById("closeTypeModal").addEventListener("click", function() {
        document.getElementById("typeModal").style.display = "none";
    });

    
    // Event listener for the Length Modal
    document.getElementById("lengthButton").addEventListener("click", function() {
        document.getElementById("lengthModal").style.display = "block";
        updateActiveLengthState(); // Update active state when the modal is opened
    });

    document.getElementById("closelengthModal").addEventListener("click", function() {
        document.getElementById("lengthModal").style.display = "none";
    });

    document.getElementById("savelengthModal").addEventListener("click", function() {
        const activeLengthOption = document.querySelector('.lengthOption.active');
        if (activeLengthOption) {
            // If a length option is selected, proceed to save the selection
            confirmedLengthSelection = activeLengthOption.textContent;
            // Save the length selection in local storage
            localStorage.setItem('confirmedLengthSelection', confirmedLengthSelection);
    
            const selectedLengthDiv = document.getElementById('selectedLength');
            if (selectedLengthDiv) {
                // Remove existing text node if it exists
                if (selectedLengthDiv.childNodes.length > 0 && selectedLengthDiv.childNodes[0].nodeType === Node.TEXT_NODE) {
                    selectedLengthDiv.removeChild(selectedLengthDiv.childNodes[0]);
                }
    
                // Insert new text content before the delete image
                selectedLengthDiv.insertBefore(document.createTextNode(confirmedLengthSelection), selectedLengthDiv.firstChild);
    
                // Display the selectedLength div with flex style after saving
                selectedLengthDiv.style.display = 'flex';
            }
            // Close the length modal after saving
            document.getElementById("lengthModal").style.display = "none";
            
            // Hide the length error message if it was previously visible
            document.getElementById('lengthErrorMessage').style.display = 'none';
        } else {
            // If no length option is selected, display the length error message
            document.getElementById('lengthErrorMessage').style.display = 'flex';
        }
        logCurrentState(); // Log the current state after saving length

        updateGenerateButtonState(); // Update Generate button state after saving

        updateErrorMessage(); // Update error message state after saving

    });
    



    // Event listeners for length options
    const lengthOptions = document.querySelectorAll('.lengthOption');
    lengthOptions.forEach(option => {
        option.addEventListener('click', function() {
            lengthOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });



    // ... (rest of your existing code) ...
    
});


function updateActiveLengthState() {
    const lengthOptions = document.querySelectorAll('.lengthOption');
    lengthOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.textContent === confirmedLengthSelection) {
            opt.classList.add('active');
        }
    });
}

// Active status of story type options
const typeOptions = document.querySelectorAll('.typeOption');

typeOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove 'active' class from all type options
        typeOptions.forEach(opt => opt.classList.remove('active'));

        // Add 'active' class to the clicked type option
        this.classList.add('active');
    });
});

// Arrow buttons in Emoji tabs
document.addEventListener('DOMContentLoaded', function() {
    const scrollAmount = 100; // Adjust the scroll amount as needed
    const scrollLeftArrow = document.getElementById('scrollArrowLeft');
    const scrollRightArrow = document.getElementById('scrollArrowRight');
    const emojiTabs = document.getElementById('emojiTabs');

    function updateScrollButtonStates() {
        // Use a small tolerance to account for fractional differences
        const tolerance = 1;
    
        // Disable left arrow if at the start of the scroll
        scrollLeftArrow.style.opacity = emojiTabs.scrollLeft <= 0 ? '0.2' : '1';
        scrollLeftArrow.disabled = emojiTabs.scrollLeft <= 0;
    
        // Check if we can scroll more to the right
        const maxScrollLeft = emojiTabs.scrollWidth - emojiTabs.clientWidth;
        scrollRightArrow.style.opacity = (emojiTabs.scrollLeft + tolerance) >= maxScrollLeft ? '0.2' : '1';
        scrollRightArrow.disabled = (emojiTabs.scrollLeft + tolerance) >= maxScrollLeft;
    }

    // Initial state setup
    scrollLeftArrow.style.opacity = '0.2';
    scrollLeftArrow.disabled = true;
    scrollRightArrow.style.opacity = '1';
    scrollRightArrow.disabled = false;

    // Event listeners for arrows
    scrollLeftArrow.addEventListener('click', function() {
        emojiTabs.scrollLeft -= scrollAmount;
        updateScrollButtonStates();
    });

    scrollRightArrow.addEventListener('click', function() {
        emojiTabs.scrollLeft += scrollAmount;
        updateScrollButtonStates();
    });

    // Listener for scroll events
    emojiTabs.addEventListener('scroll', updateScrollButtonStates);
});

//Animate images
document.addEventListener('DOMContentLoaded', function() {

    function toggleImage(event) {
        var img = event.target; 
        
        if (img.src.includes('-NA.png')) {
            img.src = img.src.replace('-NA.png', '.png'); 
        } else {
            img.src = img.src.replace('.png', '-NA.png'); 
        }
    }

    var images = document.querySelectorAll('.heroIMG'); 


    images.forEach(function(img) {
        img.addEventListener('click', toggleImage);
    });


    var cowImage = document.getElementById('imgCow');
    if (cowImage.src.includes('-NA.png')) {
        cowImage.src = cowImage.src.replace('-NA.png', '.png');
    }
});


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
  

// Event listener for the 'deleteEmojiTag' button
document.getElementById('deleteEmojiTag').addEventListener('click', function() {
    const selectedEmojisPlaceholder = document.getElementById('selectedEmojisPlaceholder');
    const selectedEmojisContainer = document.getElementById('selectedEmojisContainer');

    // Clear the emojis from the placeholder
    selectedEmojisPlaceholder.innerHTML = '';

    // Hide the entire container
    selectedEmojisContainer.style.display = 'none';

    // Clear the set of activated emojis if you want to reset the selection
    activeEmojis.clear();
    localStorage.removeItem('selectedEmojis');

    // Update the active status of emoji images in the modal
    updateEmojiActiveStatus();

    // Console log to confirm deletion
    console.log("Emojis deleted, current state:", activeEmojis.size === 0 ? 'null' : 'not null');

    // Check selections and toggle the Generate button
    checkSelectionsAndToggleGenerateButton();
    
    logCurrentState(); // Log the current state after deletion

    updateGenerateButtonState(); // Update Generate button state after saving

    updateErrorMessage(); // Update error message state after saving
});

function updateEmojiActiveStatus() {
    const emojiImages = document.querySelectorAll('.emojiImage');
    emojiImages.forEach(img => {
        const emojiName = img.dataset.emojiName;
        if (activeEmojis.has(emojiName)) {
            img.classList.add('activeImage');
        } else {
            img.classList.remove('activeImage');
        }
    });
}


document.getElementById('deleteTypeTag').addEventListener('click', function() {
    // Clear the selected type and update the display
    confirmedTypeSelection = null; // Set to null instead of an empty string
    document.getElementById('selectedType').style.display = 'none';
    localStorage.removeItem('confirmedTypeSelection');

    // Console log to confirm deletion
    console.log("Type deleted, current state:", confirmedTypeSelection === null ? 'null' : 'not null');

    // Check selections and toggle the Generate button
    checkSelectionsAndToggleGenerateButton();

    logCurrentState(); // Log the current state after deletion

    updateGenerateButtonState(); // Update Generate button state after saving

    updateErrorMessage(); // Update error message state after saving

});

document.getElementById('deleteLengthTag').addEventListener('click', function() {
    // Clear the selected length and update the display
    confirmedLengthSelection = null; // Set to null instead of an empty string
    document.getElementById('selectedLength').style.display = 'none';
    localStorage.removeItem('confirmedLengthSelection');

    // Console log to confirm deletion
    console.log("Length deleted, current state:", confirmedLengthSelection === null ? 'null' : 'not null');

    // Check selections and toggle the Generate button
    checkSelectionsAndToggleGenerateButton();

    logCurrentState(); // Log the current state after deletion

    updateGenerateButtonState(); // Update Generate button state after saving

    updateErrorMessage(); // Update error message state after saving

});




// ***** All about emoji modal related code *****

// Event listener for opening the Emoji Modal
document.getElementById("emojisButton").addEventListener("click", function() {
    document.getElementById("emojiModal").style.display = "block";
});


// Fetch emoji metadata and handle tab functionalities
document.addEventListener('DOMContentLoaded', function() {
    fetch('metadata.json')
        .then(response => response.json())
        .then(fetchedMetadata => {
            emojiMetadata = fetchedMetadata;

            const uniqueGroups = new Set();
            for (const emoji in emojiMetadata) {
                uniqueGroups.add(emojiMetadata[emoji].group);
            }

            const emojiTabsContainer = document.getElementById('emojiTabs');
            uniqueGroups.forEach(group => {
                // Skip creating tabs for 'People & Body', 'Symbols', and 'Flags'
                if (group !== 'People & Body' && group !== 'Symbols' && group !== 'Flags') {
                    const tab = document.createElement('div');
                    tab.className = 'emojiTab';
                    tab.textContent = group;
                    emojiTabsContainer.appendChild(tab);
                }
            });

            const tabs = document.querySelectorAll('.emojiTab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    updateEmojiContainer(this.textContent, emojiMetadata);
                });
            });

            if (uniqueGroups.size > 0) {
                // Ensure the first visible tab is activated
                const visibleTabs = Array.from(emojiTabsContainer.children).filter(tab => tab.style.display !== 'none');
                if (visibleTabs.length > 0) {
                    visibleTabs[0].classList.add('active');
                    updateEmojiContainer(visibleTabs[0].textContent, emojiMetadata);
                }
            }
        })
        .catch(error => console.error('Error loading emoji metadata:', error));
});

function updateEmojiContainer(group, metadata) {
    const emojiContainer = document.getElementById('emojiContainer');
    emojiContainer.innerHTML = '';

    // List of emoji names to exclude
    const excludedEmojiNames = [
        'Church',
        'Mosque',
        'Hindu temple',
        'Synagogue',
        'Shinto shrine',
        'Kaaba',
        'Map of japan'
    ];

    for (const emojiName in metadata) {
        if (metadata[emojiName].group === group) {
            // Check if the emoji's name is in the list of names to exclude
            if (!excludedEmojiNames.includes(emojiName)) {
                const img = document.createElement('img');
                img.src = metadata[emojiName].styles['3D'];
                img.alt = metadata[emojiName].cldr;
                img.className = 'emojiImage';
                img.dataset.emojiName = emojiName;

                // Add 'activeImage' class if the emoji is in the activeEmojis set
                if (activeEmojis && activeEmojis.has(emojiName)) {
                    img.classList.add('activeImage');
                }

                // Attach click event listener to each emoji
                img.addEventListener('click', function() {
                    // Retrieve the emoji name from the data-attribute
                    const emojiName = this.dataset.emojiName;

                    // Toggle selection status and update UI accordingly
                    if (activeEmojis) {
                        if (activeEmojis.has(emojiName)) {
                            activeEmojis.delete(emojiName);
                            this.classList.remove('activeImage');
                        } else if (activeEmojis.size < 3) {
                            activeEmojis.add(emojiName);
                            this.classList.add('activeImage');
                        } else {
                            document.getElementById('errorMessage').style.display = 'flex';
                        }
                    }
                });

                // Append the emoji image to the container
                emojiContainer.appendChild(img);
            }
        }
    }
}



// Event listener for the Save button
document.getElementById('saveEmojiModal').addEventListener('click', function() {
    const selectedEmojisPlaceholder = document.getElementById('selectedEmojisPlaceholder');
    const selectedEmojisContainer = document.getElementById('selectedEmojisContainer');

    selectedEmojisPlaceholder.innerHTML = ''; // Clear existing content

    if (activeEmojis.size > 0) {
        activeEmojis.forEach(emojiName => {
            const emoji = emojiMetadata[emojiName];
            if (emoji) {
                const img = document.createElement('img');
                img.src = emoji.styles['3D'];
                img.alt = emoji.cldr;
                img.className = 'selectedEmojiImage';
                selectedEmojisPlaceholder.appendChild(img);
            }
        });

        // Make the container visible with flex display
        selectedEmojisContainer.style.display = 'flex';
    } else {
        // Hide the container
        selectedEmojisContainer.style.display = 'none';
    }

    // Close the emoji modal
    document.getElementById("emojiModal").style.display = "none";
    

    logCurrentState(); // Log the current state after saving

    updateGenerateButtonState(); // Update Generate button state after saving

    updateErrorMessage(); // Update error message state after saving

});



// Event listener for the Close button
document.getElementById('closeEmojiModal').addEventListener('click', function() {
    // Close the emoji modal
    document.getElementById("emojiModal").style.display = "none";

    // Reset the active state of emojis in the modal
    document.querySelectorAll('#emojiContainer .emojiImage').forEach(img => {
        img.classList.remove('activeImage');
    });

    // Clear the set of activated emojis
    activeEmojis.clear();
});


document.getElementById('generateBtn').addEventListener('click', function(event) {
    // First, update and check for any error message
    updateErrorMessage();
    if (document.getElementById('generateErrorMessage').style.display === 'flex') {
        event.preventDefault(); // Prevent navigation if there's an error
        return; // Exit the function early if there's an error
    }

    // If there are no errors, proceed with preparing and saving the data
    const emojisToSave = Array.from(activeEmojis).map(emojiName => ({
        key: emojiName,
        src: emojiMetadata[emojiName].styles['3D']
    }));
    
    // Save the selected emojis to local storage
    localStorage.setItem('selectedEmojis', JSON.stringify(emojisToSave));

    // Optionally, redirect to the story page here if it's not done by the button's default behavior
    // window.location.href = '/story.html';
});



function checkSelectionsAndToggleGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    const isEmojisSelected = activeEmojis.size > 0;
    const isTypeSelected = confirmedTypeSelection !== null;
    const isLengthSelected = confirmedLengthSelection !== null;

    // Disable the button if any selection is null
    generateBtn.disabled = !(isEmojisSelected && isTypeSelected && isLengthSelected);

    // Optionally, add visual feedback for disabled state
    generateBtn.classList.toggle('disabled', generateBtn.disabled);
}

// Function to check the state of options and update the Generate button's disabled property
function updateGenerateButtonState() {
    const generateBtn = document.getElementById('generateBtn');
    const isEmojisSet = activeEmojis.size > 0;
    const isTypeSet = confirmedTypeSelection !== null;
    const isLengthSet = confirmedLengthSelection !== null;

    // If any of the options is null, disable the Generate button, otherwise enable it
    generateBtn.disabled = !(isEmojisSet && isTypeSet && isLengthSet);
}

// Function to construct and display error message based on the state of options
function updateErrorMessage() {
    const generateErrorMessageDiv = document.getElementById('generateErrorMessage');
    const isEmojisSet = activeEmojis.size > 0;
    const isTypeSet = confirmedTypeSelection !== null;
    const isLengthSet = confirmedLengthSelection !== null;

    let errorMessage = '';
    if (!isEmojisSet) {
        errorMessage += 'emojis';
    }
    if (!isTypeSet) {
        errorMessage += (errorMessage ? ', ' : '') + 'story type';
    }
    if (!isLengthSet) {
        errorMessage += (errorMessage ? ', ' : '') + 'length';
    }

    if (errorMessage) {
        errorMessage = 'You have to select ' + errorMessage + ' to make a story.';
        generateErrorMessageDiv.style.display = 'flex'; // Show the error message div
        generateErrorMessageDiv.querySelector('span').textContent = errorMessage; // Update the text
    } else {
        generateErrorMessageDiv.style.display = 'none'; // Hide the error message div if there are no errors
    }
}


// Call this function on page load to set the initial state of the Generate button
document.addEventListener('DOMContentLoaded', function() {
    updateGenerateButtonState();
    updateErrorMessage();

    // ... (rest of your existing code) ...
});

// Add event listeners to all elements with the class 'closeErrorBtn'
document.querySelectorAll('.closeErrorBtn').forEach(function(button) {
    button.addEventListener('click', function() {
        // Hide error messages for both emoji and type modals
        // It's okay if the element doesn't exist in one of the modals; it just won't do anything
        if (document.getElementById('errorMessage')) {
            document.getElementById('errorMessage').style.display = 'none';
        }
        if (document.getElementById('typeErrorMessage')) {
            document.getElementById('typeErrorMessage').style.display = 'none';
        }
    });
});

//Generate button event tracking code and re-direct user to story page
function trackGenerateStoryEvent() {
    // Track the event with GA4
    gtag('event', 'Generate Story Click', {
      'event_category': 'Button Clicks',
      'event_label': 'Generate story click'
    });

    // Redirect to story.html after a short delay to allow the event to be sent
    setTimeout(function() {
      location.href = 'story.html';
    }, 200); // A delay of 200 milliseconds
  }