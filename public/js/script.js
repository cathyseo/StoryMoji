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
            img.addEventListener('click', () => selectEmoji(key));
            container.appendChild(img);
        }
    });
}

function selectEmoji(emojiKey) {
    selectedEmojis.push(emojiKey);
    updateSelectedEmojisDisplay();
}

function updateSelectedEmojisDisplay() {
    const emojisDisplay = document.getElementById('selectedEmojis');
    emojisDisplay.innerHTML = '';

    selectedEmojis.forEach((emojiKey, index) => {
        const emojiData = emojiMetadata[emojiKey];
        if (emojiData && emojiData.styles["3D"]) {
            const img = document.createElement('img');
            img.src = emojiData.styles["3D"];
            img.alt = emojiKey;
            img.classList.add('emoji');
            img.addEventListener('click', function() {
                // Remove the clicked emoji from selectedEmojis
                selectedEmojis.splice(index, 1);
                updateSelectedEmojisDisplay(); // Update display
            });
            emojisDisplay.appendChild(img);
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
