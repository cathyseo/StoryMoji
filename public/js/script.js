let selectedEmojis = [];
let emojiMetadata = {};
// Initialize confirmedLengthSelection with null or an empty string
let confirmedLengthSelection = "";

document.addEventListener('DOMContentLoaded', function() {
    fetch('/metadata.json')
        .then(response => response.json())
        .then(data => {
            emojiMetadata = data;
            createEmojiTabs();
        })
        .catch(error => console.error('Error loading emoji metadata:', error));
    
    document.getElementById('selectedEmojisContainer').style.display = 'none';
    
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
            confirmedTypeSelection = activeTypeOption.textContent;
            const selectedTypeDiv = document.getElementById('selectedType');
            
            // Remove existing text node if it exists
            if (selectedTypeDiv.childNodes[0].nodeType === Node.TEXT_NODE) {
                selectedTypeDiv.removeChild(selectedTypeDiv.childNodes[0]);
            }

            // Insert new text content before the delete image
            selectedTypeDiv.insertBefore(document.createTextNode(confirmedTypeSelection), selectedTypeDiv.firstChild);

            // Display the selectedType div with flex style after saving
            selectedTypeDiv.style.display = 'flex';
        }
        document.getElementById("typeModal").style.display = "none";
    });
        // ... (rest of your existing code for emojis and tabs) ...
});



function createEmojiTabs() {
    const tabsContainer = document.getElementById('emojiTabs');
    const emojiContainer = document.getElementById('emojiContainer');
    const categories = new Set();

    Object.keys(emojiMetadata).forEach(key => {
        categories.add(emojiMetadata[key].group);
    });

    Array.from(categories).forEach((category, index) => {
        // Exclude the 'People & Body' tab
        if (category !== "People & Body") {
            const tab = document.createElement('div');
            tab.classList.add('emojiTab');
            if (index === 0) tab.classList.add('active');
            tab.textContent = category;
            tab.addEventListener('click', () => {
                showEmojisForCategory(category, emojiContainer);
                document.querySelectorAll('.emojiTab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
            tabsContainer.appendChild(tab);

            if (index === 0) showEmojisForCategory(category, emojiContainer);
        }
    });
}



function showEmojisForCategory(category) {
    const container = document.getElementById('emojiContainer');
    container.innerHTML = '';
    Object.keys(emojiMetadata).forEach(key => {
        const emoji = emojiMetadata[key];
        if (emoji.group === category) {
            const img = document.createElement('img');
            img.src = emoji.styles["3D"];
            img.alt = emoji.cldr;
            img.title = emoji.cldr;

            // Check if the emoji is already selected and add the active class if it is
            if (selectedEmojis.includes(key)) {
                img.classList.add('activeImage');
            }

            img.addEventListener('click', function() {
                if (this.classList.contains('activeImage')) {
                    this.classList.remove('activeImage');
                    deselectEmoji(key);
                } else {
                    this.classList.add('activeImage');
                    selectEmoji(key);
                }
            });

            container.appendChild(img);
        }
    });
}





function selectEmoji(emojiKey) {
    if (!temporarySelectedEmojis.includes(emojiKey)) {
        temporarySelectedEmojis.push(emojiKey); // Add to the temporary array
    }
    // Update display without affecting the main selectedEmojis array
    updateTemporaryEmojisDisplay(); 
}

function deselectEmoji(emojiKey) {
    const index = temporarySelectedEmojis.indexOf(emojiKey);
    if (index > -1) {
        temporarySelectedEmojis.splice(index, 1); // Remove from the temporary array
        updateTemporaryEmojisDisplay(); // Update display
    }
}

function updateSelectedEmojisDisplay() {
    const emojisDisplay = document.getElementById('selectedEmojis');
    const emojisContainer = document.getElementById('selectedEmojisContainer');

    // Clear existing emojis from the display
    emojisDisplay.innerHTML = '';

    // Show or hide the emojis container based on whether emojis are selected
    if (selectedEmojis.length > 0) {
        selectedEmojis.forEach(emojiKey => {
            const emojiData = emojiMetadata[emojiKey];
            if (emojiData && emojiData.styles["3D"]) {
                const img = document.createElement('img');
                img.src = emojiData.styles["3D"];
                img.alt = emojiKey;
                img.classList.add('emoji');
                emojisDisplay.appendChild(img); // Add emoji to the display
            }
        });
        emojisContainer.style.display = 'flex'; // Show the container with flex layout
    } else {
        emojisContainer.style.display = 'none'; // Hide the container
    }
}

function updateActiveTypeState() {
    const typeOptions = document.querySelectorAll('.typeOption');
    typeOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.textContent === confirmedTypeSelection) {
            opt.classList.add('active');
        }
    });
}




// Save selected emojis to local storage or session storage
document.getElementById('generateBtn').addEventListener('click', function() {
    const emojisToSave = selectedEmojis.map(key => ({
        key: key,
        src: emojiMetadata[key].styles["3D"]
    }));
    localStorage.setItem('selectedEmojis', JSON.stringify(emojisToSave));
});




    // Opening the Emoji Modal
    document.getElementById("emojisButton").addEventListener("click", function() {
        temporarySelectedEmojis = [...selectedEmojis]; // Copy the current selections to the temporary array
        document.getElementById("emojiModal").style.display = "block";
    });
    // Closing the Emoji Modal using the Save button
    document.getElementById("saveEmojiModal").addEventListener("click", function() {
        selectedEmojis = [...temporarySelectedEmojis]; // Save the changes made in the modal
        updateSelectedEmojisDisplay(); // Update the display with the new selections
        document.getElementById("emojiModal").style.display = "none";
    });
    // Closing the Emoji Modal using the Close button
    document.getElementById("closeEmojiModal").addEventListener("click", function() {
        document.getElementById("emojiModal").style.display = "none";
        // Changes made in the modal are discarded, and the original selectedEmojis remains unchanged
    });


//Active status of emoji tabs
const tabs = document.querySelectorAll('.emojiTab');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});


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

    // Event listener for saving the length selection
    document.getElementById("savelengthModal").addEventListener("click", function() {
        const activeLengthOption = document.querySelector('.lengthOption.active');
        if (activeLengthOption) {
            confirmedLengthSelection = activeLengthOption.textContent;
            const selectedLengthDiv = document.getElementById('selectedLength');
            
            // Remove existing text node if it exists
            if (selectedLengthDiv.childNodes[0].nodeType === Node.TEXT_NODE) {
                selectedLengthDiv.removeChild(selectedLengthDiv.childNodes[0]);
            }

            // Insert new text content before the delete image
            selectedLengthDiv.insertBefore(document.createTextNode(confirmedLengthSelection), selectedLengthDiv.firstChild);

            // Display the selectedLength div with flex style after saving
            selectedLengthDiv.style.display = 'flex';
        }
        document.getElementById("lengthModal").style.display = "none";
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

//Delete button in tags
document.getElementById('deleteEmojiTag').addEventListener('click', function() {
    // Clear the selected emojis and update the display
    selectedEmojis = [];
    updateSelectedEmojisDisplay(); // Assuming this function updates the emoji tag display
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







