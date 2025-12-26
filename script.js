const questions = [
    { q: "I (study) English last night.", a: "studied", options: ["studyed", "studied", "studying"] },
    { q: "They (play) football yesterday.", a: "played", options: ["played", "plays", "play"] },
    { q: "She (walk) to school this morning.", a: "walked", options: ["walks", "walked", "walking"] }
];

let currentPos = 0;
let startTime;

window.onload = () => {
    const best = localStorage.getItem('bestTime-Wiradesa');
    if (best) document.getElementById('best-time').innerText = best;
};

function startGame() {
    document.getElementById('instruction-modal').style.display = 'none';
    startTime = Date.now();
    loadQuestion();
}

function loadQuestion() {
    const qData = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById('question-text').innerText = qData.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn-opt';
        btn.onclick = () => checkAnswer(opt, qData.a);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        currentPos += 30;
        document.getElementById('robot-player').style.left = currentPos + '%';
        if (currentPos >= 90) finishGame();
        else loadQuestion();
    } else {
        alert("Wrong! Try again.");
    }
}

function finishGame() {
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    alert(`Finish! Time: ${timeTaken}s`);
    
    const best = localStorage.getItem('bestTime-Wiradesa');
    if (!best || parseFloat(timeTaken) < parseFloat(best)) {
        localStorage.setItem('bestTime-Wiradesa', timeTaken);
        alert("New Record for SMPN 1 Wiradesa! 🎉");
    }
    location.reload();
}