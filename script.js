// Array of question objects, each with a question text, 4 choices, and the index of the correct answer
const QUESTIONS = [
    { q: "What is the capital of Turkey?", choices: ["Istanbul", "Ankara", "Izmir", "Bursa"], a: 1 },
    { q: "What does HTML stand for?", choices: ["HyperText Markup Language", "HighText Machine Language", "HyperTools Makeup Language", "Home Tool Markup Line"], a: 0 },
    { q: "What is JavaScript mainly used for?", choices: ["Server management", "Web page interactivity", "Database storage", "Visual design"], a: 1 },
    { q: "Which continent is Istanbul in?", choices: ["Europe only", "Asia only", "Europe and Asia", "Africa"], a: 2 },
    { q: "Which is the largest ocean in the world?", choices: ["Indian Ocean", "Atlantic Ocean", "Pacific Ocean", "Arctic Ocean"], a: 2 },
    { q: "Approximate speed of light?", choices: ["300,000 km/s", "3,000 km/s", "30,000 km/s", "300 km/s"], a: 0 },
    { q: "Largest planet in the Solar System?", choices: ["Earth", "Mars", "Jupiter", "Venus"], a: 2 },
    { q: "Approximate value of Pi?", choices: ["3.14", "2.71", "1.62", "4.13"], a: 0 },
    { q: "Charge of an electron?", choices: ["Positive", "Negative", "Neutral", "Unstable"], a: 1 },
    { q: "What does 'debug' mean in programming?", choices: ["Write new code", "Fix errors", "Speed up program", "Compress code"], a: 1 }
];

// Array of prize amounts corresponding to each question
const PRIZES = ["$100", "$200", "$300", "$500", "$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"];
const SAFE_INDEX = 4; // Index of guaranteed safe prize

// State object to track game progress
let state = {
    index: 0,                // Current question index
    completed: false,        // Whether the game is over
    used: { fifty: false, phone: false, audience: false }, // Lifeline usage tracking
    timer: 30,               // Countdown timer for each question
    intervalId: null,        // Timer interval reference
    locked: false            // Prevents multiple clicks on answers
};

// DOM elements for UI updates
const qIndex = document.getElementById('qIndex');
const questionText = document.getElementById('questionText');
const answersDiv = document.getElementById('answers');
const timerSpan = document.getElementById('timer');
const lifeline5050 = document.getElementById('lifeline5050');
const lifelinePhone = document.getElementById('lifelinePhone');
const lifelineAudience = document.getElementById('lifelineAudience');
const lifelinesDiv = document.getElementById('lifelinesDiv');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const walkAwayBtn = document.getElementById('walkAway');
const ladderDiv = document.getElementById('ladder');
const currentPrize = document.getElementById('currentPrize');
const hintDiv = document.getElementById('hint');

// Function to build the prize ladder in the UI
function buildLadder() {
    ladderDiv.innerHTML = "";
    for (let i = PRIZES.length - 1; i >= 0; i--) {
        const lvl = document.createElement('div');
        lvl.className = "level" + (i === state.index ? " active" : "") + (i === SAFE_INDEX ? " safe" : "");
        lvl.id = 'lvl-' + i;
        lvl.innerHTML = `<div>#${i + 1}</div><div>${PRIZES[i]}</div>`;
        ladderDiv.appendChild(lvl);
    }
}

// Update ladder highlighting and current prize display
function updateLadder() {
    for (let i = 0; i < PRIZES.length; i++) {
        const el = document.getElementById('lvl-' + i);
        if (!el) continue;
        el.className = "level" + (i === state.index ? " active" : "") + (i === SAFE_INDEX ? " safe" : "");
    }
    currentPrize.textContent = state.index > 0 ? PRIZES[state.index - 1] : "$0";
}

// Display the current question and answers
function showQuestion() {
    clearInterval(state.intervalId);       // Stop any existing timer
    state.timer = 30;
    timerSpan.textContent = state.timer;
    qIndex.textContent = state.index + 1;
    const data = QUESTIONS[state.index];
    questionText.textContent = data.q;
    hintDiv.textContent = "";
    answersDiv.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('div');
        btn.className = 'answer';
        btn.textContent = String.fromCharCode(65 + i) + ". " + data.choices[i]; // A-D labels
        btn.dataset.index = i;
        btn.addEventListener('click', onAnswer);
        answersDiv.appendChild(btn);
    }
    updateLadder();
    startTimer();
    // Update lifeline buttons based on usage
    lifeline5050.classList.toggle('used', state.used.fifty);
    lifelinePhone.classList.toggle('used', state.used.phone);
    lifelineAudience.classList.toggle('used', state.used.audience);
    lifelinesDiv.style.display = 'flex';
    walkAwayBtn.style.display = 'inline-block';
    nextBtn.style.display = "none";
    startBtn.style.display = "none";
}

// Start countdown timer for each question
function startTimer() {
    timerSpan.textContent = state.timer;
    state.intervalId = setInterval(() => {
        state.timer--;
        timerSpan.textContent = state.timer;
        if (state.timer <= 0) {
            clearInterval(state.intervalId);
            onTimeout();
        }
    }, 1000);
}

// Called when timer runs out
function onTimeout() { hintDiv.textContent = "Time's up!"; revealAnswer(null, true); }

// Handle user answer selection
function onAnswer(e) { if (state.locked) return; revealAnswer(Number(e.currentTarget.dataset.index), false); }

// Reveal correct/incorrect answers and handle result
function revealAnswer(selectedIndex, timedOut) {
    state.locked = true;
    clearInterval(state.intervalId);
    const correct = QUESTIONS[state.index].a;
    const buttons = Array.from(answersDiv.children);
    buttons.forEach(b => {
        b.classList.add('disabled');
        const idx = Number(b.dataset.index);
        if (idx === correct) b.classList.add('correct');
        if (selectedIndex !== null && idx === selectedIndex && idx !== correct) b.classList.add('wrong');
    });
    if (timedOut) { endGame(false); return; }
    if (selectedIndex === correct) {
        hintDiv.textContent = "Correct!";
        state.index++;
        if (state.index >= QUESTIONS.length) { endGame(true); return; }
        nextBtn.style.display = "inline-block";
    } else {
        hintDiv.textContent = "Wrong answer.";
        endGame(false);
    }
}

// Move to next question
nextBtn.addEventListener('click', () => {
    if (state.index < QUESTIONS.length) {
        state.locked = false;
        showQuestion();
    }
});

// Start or restart the game
startBtn.addEventListener('click', () => { resetGame(); showQuestion(); });

// Walk away with current prize
walkAwayBtn.addEventListener('click', () => {
    if (state.index === 0) { alert("You haven't won any money yet."); return; }
    const won = PRIZES[state.index - 1];
    finalize(won, false);
});

// 50-50 lifeline: remove 2 wrong answers
lifeline5050.addEventListener('click', () => {
    if (state.used.fifty || state.locked) return; state.used.fifty = true; lifeline5050.classList.add('used');
    const correct = QUESTIONS[state.index].a;
    const btns = Array.from(answersDiv.children);
    const wrongs = btns.filter(b => Number(b.dataset.index) !== correct);
    shuffleArray(wrongs);
    wrongs.slice(0, 2).forEach(b => { b.classList.add('disabled'); b.style.visibility = 'hidden'; });
});

// Phone a friend lifeline: suggest correct answer with probability
lifelinePhone.addEventListener('click', () => {
    if (state.used.phone || state.locked) return; state.used.phone = true; lifelinePhone.classList.add('used');
    const correct = QUESTIONS[state.index].a;
    const prob = Math.random();
    let suggestion;
    if (prob <= 0.7) { suggestion = correct; } else { const wrongChoices = [0, 1, 2, 3].filter(i => i !== correct); suggestion = wrongChoices[Math.floor(Math.random() * wrongChoices.length)]; }
    hintDiv.textContent = `Phone: "I think option ${String.fromCharCode(65 + suggestion)} seems correct."`;
});

// Audience lifeline: generate random votes with higher chance for correct answer
lifelineAudience.addEventListener('click', () => {
    if (state.used.audience || state.locked) return; state.used.audience = true; lifelineAudience.classList.add('used');
    const correct = QUESTIONS[state.index].a;
    const base = [5, 5, 5, 5]; // Base votes
    let remaining = 100 - 20;
    const correctShare = 50 + Math.floor(Math.random() * 21);
    base[correct] += correctShare;
    remaining -= correctShare;
    const others = [0, 1, 2, 3].filter(i => i !== correct);
    for (let i = 0; i < others.length; i++) { const share = Math.floor(remaining / (others.length - i)); base[others[i]] += share; remaining -= share; }
    hintDiv.innerHTML = "Audience votes: " + base.map((v, i) => `${String.fromCharCode(65 + i)}:${v}%`).join('  ');
});

// End the game, calculate prize
function endGame(wonAll) {
    state.locked = true;
    if (wonAll) {
        const prize = PRIZES[PRIZES.length - 1];
        hintDiv.textContent = `Congratulations! You answered all correctly. Prize: ${prize}`;
        finalize(prize);
        return;
    }
    let guaranteed = state.index > SAFE_INDEX ? PRIZES[SAFE_INDEX] : "$0";
    hintDiv.textContent += ` Your prize: ${guaranteed}`;
    finalize(guaranteed);
}

// Finalize the game, show alert and reset buttons
function finalize(prize, showDefaultAlert = true) {
    clearInterval(state.intervalId);
    state.completed = true;
    nextBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';
    walkAwayBtn.style.display = 'none';
    startBtn.textContent = "Restart Game";
    alert("Game over. Your prize: " + prize);
}

// Reset game state and UI
function resetGame() {
    state.index = 0;
    state.completed = false;
    state.used = { fifty: false, phone: false, audience: false };
    state.locked = false;
    clearInterval(state.intervalId);
    state.timer = 30;
    timerSpan.textContent = 30;
    startBtn.textContent = "Start Game";
    buildLadder();
    updateLadder();
    lifelinesDiv.style.display = 'none';
    walkAwayBtn.style.display = 'none';
    questionText.textContent = "Press 'Start Game' to begin.";
    qIndex.textContent = "—";
    hintDiv.textContent = "";
    answersDiv.innerHTML = "";
}

// Utility function: Fisher-Yates shuffle for randomizing array
function shuffleArray(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }

// Initialize game
resetGame();
