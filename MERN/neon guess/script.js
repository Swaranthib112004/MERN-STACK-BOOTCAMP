// ==========================
// NEON GUESS GAME SCRIPT.JS
// ==========================

const gameState = {
    secretNumber: 0,
    attempts: 0,
    score: 1000,
    hintsRemaining: 3,
    minRange: 1,
    maxRange: 50,
    difficulty: 'easy',
    gameActive: false,
    startTime: null,
    timerInterval: null,
    logs: [],
    streak: 0,
    bestScore: 0,
    achievements: {
        'first-win': false,
        'perfect': false,
        'speed': false,
        'streak': false,
        'master': false
    }
};

const difficulties = {
    easy: { range: 50, hints: 3, scoreDeduction: 10 },
    medium: { range: 100, hints: 2, scoreDeduction: 15 },
    hard: { range: 200, hints: 1, scoreDeduction: 20 }
};

function initGame() {
    loadGameData();
    setupEventListeners();
    startNewGame();
}

function loadGameData() {
    gameState.bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    gameState.streak = parseInt(localStorage.getItem('streak') || '0');
    const saved = JSON.parse(localStorage.getItem('achievements') || '{}');
    gameState.achievements = { ...gameState.achievements, ...saved };
    updateDisplay();
    updateAchievements();
}

function saveGameData() {
    localStorage.setItem('bestScore', gameState.bestScore.toString());
    localStorage.setItem('streak', gameState.streak.toString());
    localStorage.setItem('achievements', JSON.stringify(gameState.achievements));
}

function startNewGame() {
    const diff = difficulties[gameState.difficulty];

    gameState.secretNumber = Math.floor(Math.random() * diff.range) + 1;
    gameState.attempts = 0;
    gameState.score = 1000;
    gameState.hintsRemaining = diff.hints;
    gameState.minRange = 1;
    gameState.maxRange = diff.range;
    gameState.gameActive = true;
    gameState.startTime = new Date();
    gameState.logs = [];

    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(updateTimer, 1000);

    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessInput').max = diff.range;
    document.getElementById('guessBtn').disabled = false;
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('resultDisplay').innerHTML = '';
    document.getElementById('hintDisplay').textContent = 'Use hints wisely! Each costs 50 points.';
    document.getElementById('logTableBody').innerHTML = '<tr><td colspan="6" class="log-empty">🎮 Start guessing to see logs!</td></tr>';

    updateDisplay();
}

function setupEventListeners() {
    document.getElementById('guessBtn').addEventListener('click', makeGuess);
    document.getElementById('guessInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') makeGuess();
    });
    document.getElementById('hintBtn').addEventListener('click', getHint);
    document.getElementById('restartBtn').addEventListener('click', startNewGame);

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.difficulty = e.target.dataset.difficulty;
            startNewGame();
        });
    });

    document.getElementById('logFilter').addEventListener('change', filterLogs);
    document.getElementById('exportBtn').addEventListener('click', exportLogs);
}

function makeGuess() {
    if (!gameState.gameActive) return;

    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);

    if (!guess || guess < gameState.minRange || guess > gameState.maxRange) return;

    gameState.attempts++;
    const timestamp = new Date();
    let result, resultClass, hint, scoreChange;

    if (guess === gameState.secretNumber) {
        result = 'Correct 🎉';
        resultClass = 'result-correct';
        hint = 'Perfect!';
        scoreChange = 0;
        endGame(true);
    } else if (guess > gameState.secretNumber) {
        result = 'Too High ❌';
        resultClass = 'result-high';
        hint = getDynamicHint(guess, 'high');
        gameState.maxRange = Math.min(gameState.maxRange, guess - 1);
        scoreChange = -difficulties[gameState.difficulty].scoreDeduction;
        gameState.score += scoreChange;
    } else {
        result = 'Too Low ❌';
        resultClass = 'result-low';
        hint = getDynamicHint(guess, 'low');
        gameState.minRange = Math.max(gameState.minRange, guess + 1);
        scoreChange = -difficulties[gameState.difficulty].scoreDeduction;
        gameState.score += scoreChange;
    }

    addLog(gameState.attempts, guess, result, hint, timestamp, scoreChange);
    displayResult(result, resultClass);
    updateProgress();
    updateDisplay();

    input.value = '';
    input.focus();
}

function getDynamicHint(guess, type) {
    const diff = Math.abs(guess - gameState.secretNumber);
    if (diff <= 5) return 'Very close!';
    if (diff <= 10) return 'Getting warm!';
    if (diff <= 20) return 'Not too far';
    return 'Way off';
}

function getHint() {
    if (!gameState.gameActive || gameState.hintsRemaining <= 0) return;

    gameState.hintsRemaining--;
    gameState.score -= 50;

    const hints = [
        `The number is ${gameState.secretNumber % 2 === 0 ? 'even' : 'odd'}`,
        `The number is ${gameState.secretNumber > (gameState.maxRange / 2) ? 'in the upper half' : 'in the lower half'}`,
        `Range: ${gameState.minRange} - ${gameState.maxRange}`
    ];

    const hintIndex = 3 - gameState.hintsRemaining - 1;
    const hint = hints[hintIndex] || `Range: ${gameState.minRange} - ${gameState.maxRange}`;

    document.getElementById('hintDisplay').textContent = hint;
    updateDisplay();

    if (gameState.hintsRemaining === 0) {
        document.getElementById('hintBtn').disabled = true;
    }
}

function addLog(attempt, guess, result, hint, timestamp, scoreChange) {
    const log = { attempt, guess, result, hint, timestamp: formatTime(timestamp), scoreChange };
    gameState.logs.unshift(log);

    const tbody = document.getElementById('logTableBody');
    if (gameState.logs.length === 1) tbody.innerHTML = '';

    const row = tbody.insertRow(0);
    row.innerHTML = `
        <td><strong>#${attempt}</strong></td>
        <td><strong>${guess}</strong></td>
        <td>${result}</td>
        <td>${hint}</td>
        <td>${log.timestamp}</td>
        <td style="color: ${scoreChange >= 0 ? '#00ff88' : '#ff006e'}">${scoreChange >= 0 ? '+' : ''}${scoreChange}</td>
    `;

    document.getElementById('logCount').textContent = `${gameState.attempts} attempts`;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function displayResult(text, cls) {
    const display = document.getElementById('resultDisplay');
    display.textContent = text;
    display.className = cls;
}

function updateDisplay() {
    document.getElementById('timer').textContent = formatTimeElapsed();
    document.getElementById('attempts').textContent = gameState.attempts;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('bestScore').textContent = gameState.bestScore;
    document.getElementById('hintsCount').textContent = `${gameState.hintsRemaining} remaining`;
    document.getElementById('rangeInfo').textContent = `${gameState.minRange} - ${gameState.maxRange}`;
}

function formatTimeElapsed() {
    if (!gameState.startTime) return "00:00";
    const diff = Math.floor((new Date() - gameState.startTime) / 1000);
    const mins = String(Math.floor(diff / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

function updateTimer() {
    document.getElementById('timer').textContent = formatTimeElapsed();
}

function updateProgress() {
    const totalRange = difficulties[gameState.difficulty].range;
    const filled = ((gameState.maxRange - gameState.minRange + 1) / totalRange) * 100;
    document.getElementById('progressFill').style.width = `${filled}%`;
}

function endGame(won) {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    document.getElementById('guessInput').disabled = true;
    document.getElementById('guessBtn').disabled = true;
    document.getElementById('hintBtn').disabled = true;
    document.getElementById('restartBtn').style.display = 'inline-block';

    if (won) {
        gameState.streak++;
        if (gameState.score > gameState.bestScore) gameState.bestScore = gameState.score;
        unlockAchievement('first-win');
        if (gameState.streak >= 3) unlockAchievement('streak');
        saveGameData();
        updateAchievements();
    }
}

function unlockAchievement(name) {
    if (!gameState.achievements[name]) {
        gameState.achievements[name] = true;
    }
}

function updateAchievements() {
    document.querySelectorAll('.achievement-badge').forEach(badge => {
        const ach = badge.dataset.achievement;
        if (gameState.achievements[ach]) badge.classList.add('unlocked');
        else badge.classList.remove('unlocked');
    });
}

// Log filter
function filterLogs() {
    const filter = document.getElementById('logFilter').value;
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = '';
    const filtered = gameState.logs.filter(l => filter === 'all' || l.result.toLowerCase().includes(filter));
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="log-empty">No logs found for this filter.</td></tr>';
        return;
    }
    filtered.forEach(l => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>#${l.attempt}</strong></td>
            <td><strong>${l.guess}</strong></td>
            <td>${l.result}</td>
            <td>${l.hint}</td>
            <td>${l.timestamp}</td>
            <td style="color: ${l.scoreChange >= 0 ? '#00ff88' : '#ff006e'}">${l.scoreChange >= 0 ? '+' : ''}${l.scoreChange}</td>
        `;
    });
}

// Export logs as CSV
function exportLogs() {
    if (!gameState.logs.length) return alert("No logs to export!");
    let csv = 'Attempt,Guess,Result,Hint,Time,ScoreChange\n';
    gameState.logs.slice().reverse().forEach(l => {
        csv += `${l.attempt},${l.guess},${l.result},${l.hint},${l.timestamp},${l.scoreChange}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neon_guess_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize the game
initGame();
