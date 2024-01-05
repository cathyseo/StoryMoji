let selectedEmojis = [];
let emojiMetadata = {};

document.addEventListener('DOMContentLoaded', function() {
    fetch('/metadata.json')
        .then(response => response.json())
        .then(data => {
            emojiMetadata = data;
            createEmojiTabs();
        })
        .catch(error => console.error('Error loading emoji metadata:', error));
    
        // Hide the selectedEmojisContainer initially
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
        }
        document.getElementById("typeModal").style.display = "none";
    });
    // Event listeners for story type options
    const typeOptions = document.querySelectorAll('.typeOption');
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            typeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
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
    if (!selectedEmojis.includes(emojiKey)) {
        selectedEmojis.push(emojiKey);
        updateSelectedEmojisDisplay();
    }
}

function deselectEmoji(emojiKey) {
    const index = selectedEmojis.indexOf(emojiKey);
    if (index > -1) {
        selectedEmojis.splice(index, 1);
        updateSelectedEmojisDisplay();
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
    document.getElementById("emojiModal").style.display = "block";
});
    // Closing the Emoji Modal using the Save button
    document.getElementById("saveEmojiModal").addEventListener("click", function() {
        document.getElementById("emojiModal").style.display = "none";
    });
    // Closing the Emoji Modal using the Close button
    document.getElementById("closeEmojiModal").addEventListener("click", function() {
        // Hide the modal
        document.getElementById("emojiModal").style.display = "none";

        // Reset the selectedEmojis array
        selectedEmojis = [];

        // Update the display to reflect the reset
        updateSelectedEmojisDisplay();

        // Optionally, reset the active status of images in the emojiContainer
        const images = document.querySelectorAll('#emojiContainer img');
        images.forEach(img => img.classList.remove('activeImage'));
    });




//Active status of emoji tabs
const tabs = document.querySelectorAll('.emojiTab');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});


//Story type modal
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

    // ... (rest of your existing code) ...
});

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

//Save active type and show in browser
document.getElementById("saveTypeModal").addEventListener("click", function() {
    // Find the active type option
    const activeTypeOption = document.querySelector('.typeOption.active');

    // Check if an active type option exists
    if (activeTypeOption) {
        // Get the text of the active type option
        const selectedTypeText = activeTypeOption.textContent;

        // Update the selectedType div with this text
        const selectedTypeDiv = document.getElementById('selectedType');
        selectedTypeDiv.textContent = selectedTypeText; // Replace the existing content
        selectedTypeDiv.style.display = 'block'; // Make sure the div is visible
    }

    // Hide the type modal
    document.getElementById("typeModal").style.display = "none";
});




