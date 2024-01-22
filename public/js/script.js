let activeEmojis = new Set(); // To keep track of activated emojis
// Initialize confirmedLengthSelection with null or an empty string
let confirmedLengthSelection = "";
let confirmedTypeSelection = "";



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
    });
    



// Event listeners for length options
const lengthOptions = document.querySelectorAll('.lengthOption');
lengthOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove 'active' class from all length options
        lengthOptions.forEach(opt => opt.classList.remove('active'));

        // Add 'active' class to the clicked length option
        this.classList.add('active');

        // Call the function to check all selections and update error message visibility
        checkAllSelectionsAndUpdateError();
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

        // Call the function to check all selections and update error message visibility
        checkAllSelectionsAndUpdateError();
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
    // Function to toggle between animated and non-animated images
    function toggleImage(event) {
        // Get the clicked image element
        var img = event.target;
        // Check if the image is non-animated
        if (img.src.includes('-NA.png')) {
            // Change to the animated image
            img.src = img.src.replace('-NA.png', '.png');
        } else {
            // Change back to the non-animated image
            img.src = img.src.replace('.png', '-NA.png');
        }
    }

    // Get all elements with the class 'heroIMG'
    var images = document.querySelectorAll('.heroIMG');

    // Add click event listener to each image
    images.forEach(function(img) {
        img.addEventListener('click', toggleImage);
    });
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

// Event listener for the 'deleteEmojiTag' button
document.getElementById('deleteEmojiTag').addEventListener('click', function() {
    const selectedEmojisPlaceholder = document.getElementById('selectedEmojisPlaceholder');
    const selectedEmojisContainer = document.getElementById('selectedEmojisContainer');

    // Clear the emojis from the placeholder
    selectedEmojisPlaceholder.innerHTML = '';

    // Hide the entire container
    selectedEmojisContainer.style.display = 'none';

    // Optionally, clear the set of activated emojis if you want to reset the selection
    activeEmojis.clear();
});



document.getElementById('deleteTypeTag').addEventListener('click', function() {
    // Clear the selected type and update the display
    confirmedTypeSelection = '';
    document.getElementById('selectedType').style.display = 'none';
    // Additional logic to update the type selection in the modal, if necessary
});

document.getElementById('deleteLengthTag').addEventListener('click', function() {
    // Clear the selected length and update the display
    confirmedLengthSelection = '';
    document.getElementById('selectedLength').style.display = 'none';
    // Additional logic to update the length selection in the modal, if necessary
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
                if (group !== 'People & Body') {
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
                const firstTab = emojiTabsContainer.children[0];
                firstTab.classList.add('active');
                updateEmojiContainer([...uniqueGroups][0], emojiMetadata);
            }
        })
        .catch(error => console.error('Error loading emoji metadata:', error));
});

function updateEmojiContainer(group, metadata) {
    const emojiContainer = document.getElementById('emojiContainer');
    emojiContainer.innerHTML = '';

    for (const emoji in metadata) {
        if (metadata[emoji].group === group) {
            const img = document.createElement('img');
            img.src = metadata[emoji].styles['3D'];
            img.alt = metadata[emoji].cldr;
            img.className = 'emojiImage';
            img.dataset.emojiName = emoji;

            // Add 'activeImage' class if the emoji is in the activeEmojis set
            if (activeEmojis.has(emoji)) {
                img.classList.add('activeImage');
            }

            // Attach click event listener to each emoji
            img.addEventListener('click', function() {
                const emojiName = this.dataset.emojiName;
    
                if (activeEmojis.has(emojiName)) {
                    activeEmojis.delete(emojiName);
                    this.classList.remove('activeImage');
                } else {
                    if (activeEmojis.size < 5) {
                        activeEmojis.add(emojiName);
                        this.classList.add('activeImage');
                    } else {
                        document.getElementById('errorMessage').style.display = 'flex';
                    }
                }
    
                // Call the function to check all selections and update error message visibility
                checkAllSelectionsAndUpdateError();
            });

            // Append the emoji image to the container
            emojiContainer.appendChild(img);
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


// Event listener for the 'Get a Story' button
document.getElementById('generateBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default action or form submission

    const hasEmojis = activeEmojis.size > 0;
    const hasType = document.querySelector('.typeOption.active') !== null;
    const hasLength = document.querySelector('.lengthOption.active') !== null;

    if (!hasEmojis || !hasType || !hasLength) {
        // If any of the selections are missing, show the error message
        document.getElementById('generateErrorMessage').style.display = 'flex';
        let missingItems = [];
        if (!hasEmojis) missingItems.push('emojis');
        if (!hasType) missingItems.push('story type');
        if (!hasLength) missingItems.push('length');
        document.getElementById('generateErrorText').textContent = `You have to select ${missingItems.join(', ')} to make a story.`;
    } else {
        // Prepare the data to be saved
        const emojisToSave = Array.from(activeEmojis).map(emojiName => ({
            key: emojiName,
            src: emojiMetadata[emojiName].styles['3D']
        }));
        
        // Save the selected emojis to local storage
        localStorage.setItem('selectedEmojis', JSON.stringify(emojisToSave));

        // Redirect to the story page only if all selections are made
        window.location.href = 'story.html';
    }
});

//Delete Generate BNT Error when user select all
function checkAllSelectionsAndUpdateError() {
    const hasEmojis = activeEmojis.size > 0;
    const hasType = document.querySelector('.typeOption.active') !== null;
    const hasLength = document.querySelector('.lengthOption.active') !== null;

    if (hasEmojis && hasType && hasLength) {
        // If all selections are made, hide the error message
        document.getElementById('generateErrorMessage').style.display = 'none';
    }
}




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