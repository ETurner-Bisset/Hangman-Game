const wordEl = document.getElementById('word');
const wrongLetterEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

// const words;

// Fetch random word
async function getRandomWord() {
    const res = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await res.json();
    let selectedWord = data.toString();
    
    return selectedWord;
};

// console.log(getRandomWord());

// async let selectedWord = await getRandomWord();
// console.log(selectedWord);

const correctLetters = [];
const wrongLetters = [];


// show hidden word
async function displayWord() {
    let selectedWord = await getRandomWord();
    console.log(selectedWord);
    wordEl.innerHTML = `
    ${selectedWord
        .split('')
        .map(letter => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `).join('')}
    `;
    // console.log(wordEl);
    const innerWord = wordEl.innerText.replace(/\n/g, '');
    console.log(innerWord);
    if (innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations! You won! 😃';
        popup.style.display = 'flex';
    }
};

// update the wrong letters
function updateWrongLettersEl() {
    // display wrong letters
    wrongLetterEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    // display parts
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // check if lost
    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'Unfortunately you lost. 😕';
        popup.style.display = 'flex';
    }
};

// show notification
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
};

// keydown letter press

window.addEventListener('keydown', async (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        let selectedWord = await getRandomWord();
        const letter = e.key;
        if (selectedWord.includes(letter)){
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl();
            } else {
                showNotification();
            }
        }
    }
});

// play again button
playAgainBtn.addEventListener('click', () => {
    // empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);

    selectedWord = getRandomWord();

    displayWord();
    updateWrongLettersEl();
    popup.style.display = 'none';
});

displayWord();