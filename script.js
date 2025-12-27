// GANTI ID DI BAWAH INI dengan ID Spreadsheet Bapak
const SHEET_ID = '1aVEYGgiIwDGO3MhMHZKHS80NbHxg16Iww19zogqJNls'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let questions = [];
let playerPos = 0;
let botPos = 0;
let timer;
let seconds = 0;

async function fetchQuestions() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        questions = json.table.rows.map(row => ({
            q: row.c[0].v, // Kolom A
            options: [row.c[1].v, row.c[2].v, row.c[3].v], // Kolom B, C, D
            correct: row.c[4].v // Kolom E
        }));
    } catch (e) {
        console.error("Gagal ambil soal:", e);
    }
}

function startGame() {
    document.getElementById('instruction-modal').style.display = 'none';
    startTimer();
    moveBot();
    loadNewQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        seconds += 0.1;
        document.getElementById('timer').innerText = `Time: ${seconds.toFixed(1)}s`;
    }, 100);
}

function loadNewQuestion() {
    if (questions.length === 0) return;
    const qData = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById('question-text').innerText = qData.q;
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    
    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, qData.correct);
        grid.appendChild(btn);
    });
}

function checkAnswer(ans, correct) {
    if (ans === correct) {
        playerPos += 15;
        document.getElementById('robot-player').style.left = playerPos + '%';
        if (playerPos >= 90) endGame("WIN");
        else loadNewQuestion();
    } else {
        // Hukuman jika salah (opsional)
        playerPos = Math.max(0, playerPos - 5);
        document.getElementById('robot-player').style.left = playerPos + '%';
    }
}

function moveBot() {
    const botMove = setInterval(() => {
        botPos += Math.random() * 2; // Kecepatan bot acak
        document.getElementById('robot-bot').style.left = botPos + '%';
        if (botPos >= 90) {
            clearInterval(botMove);
            endGame("LOSE");
        }
    }, 1000);
}

function endGame(status) {
    clearInterval(timer);
    if (status === "WIN") {
        alert(`CONGRATULATIONS! You reached the finish in ${seconds.toFixed(1)}s`);
        saveHighScore(seconds.toFixed(1));
    } else {
        alert("GAME OVER! The Bot won the race. Try again!");
    }
    location.reload();
}

function saveHighScore(time) {
    const best = localStorage.getItem('bestTimeWiradesa');
    if (!best || parseFloat(time) < parseFloat(best)) {
        localStorage.setItem('bestTimeWiradesa', time);
    }
}

// Jalankan pengambilan soal saat halaman dimuat
fetchQuestions();