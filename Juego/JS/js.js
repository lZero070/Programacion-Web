let magicNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let previousAttempts = [];
let timerInterval; // Variable para almacenar el intervalo del temporizador
let startTime; // Variable para almacenar el tiempo de inicio
const winSound = new Audio ('../Audio/Victoria.mp3');
const loseSound = new Audio ('../Audio/Derrota.mp3');

// Llamar a loadScores para cargar los puntajes al iniciar la página
//document.addEventListener('DOMContentLoaded', loadScores);
//document.getElementById('submit').addEventListener('click', checkGuess);
//document.getElementById('play-again').addEventListener('click', playAgain);
//document.getElementById('show-records').addEventListener('click', displayScores);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('show-records').addEventListener('click', displayScores);
    document.getElementById('clear-records').addEventListener('click', clearRecords);
    document.getElementById('submit').addEventListener('click', checkGuess);
    document.getElementById('play-again').addEventListener('click', playAgain);
    
    // Show records button initially
    document.getElementById('show-records').style.display = 'block';
    document.getElementById('clear-records').style.display = 'block';
    document.getElementById('records-list').style.display = 'none';
});

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000); // Actualiza el temporizador cada segundo
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}


function checkGuess(event) {
    event.preventDefault();
    
    if (attempts === 0) {
        startTimer();
        document.getElementById('show-records').style.display = 'none';
        document.getElementById('records-list').style.display = 'none';
        document.getElementById('clear-records').style.display = 'none';
    }

    let guess = parseInt(document.getElementById('guess').value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        showResult('Número no permitido. Por favor, ingresa un número entre 1 y 100.');
        document.getElementById('guess').value = '';
        return; // Salir de la función si el número es inválido
    }


    attempts++;

    document.getElementById('guess').value = '';

    if (guess === magicNumber) {
        showResult(`¡Felicidades! El número mágico era ${magicNumber}.`);
        winSound.play();
        stopTimer();
        let userName = prompt("¡Felicidades! Ingresa tu nombre para registrar tu puntuación:");
        if (userName) {
            saveScore(userName, attempts, getElapsedTime());
        }
        disableInput();
        showPlayAgainButton();
    } else if (attempts < 10) {
        if (guess < magicNumber) {
            showResult(`Tu numero elegido es más bajo. Intenta de nuevo.`);
        } else {
            showResult(`Tu numero elegido es más alto. Intenta de nuevo.`);
        }
        previousAttempts.push(guess);
        showAttempts();
    } else {
        showResult(`Lo siento, no has adivinado el número mágico. Era ${magicNumber}.`);
        loseSound.play();
        stopTimer();
        disableInput();
        showPlayAgainButton();
    }
}

function showResult(message) {
    document.getElementById('result').innerHTML = message;
}

function showAttempts() {
    let attemptsList = '';
    previousAttempts.forEach((attempt, index) => {
        attemptsList += `<li>Intento ${index + 1}: ${attempt}</li>`;
    });
    document.getElementById('attempts').innerHTML = `<ul>${attemptsList}</ul>`;
}

function disableInput() {
    document.getElementById('guess').disabled = true;
    document.getElementById('submit').disabled = true;
}

function showPlayAgainButton() {
    document.getElementById('play-again').style.display = 'block';
    document.getElementById('show-records').style.display = 'block';
    document.getElementById('clear-records').style.display = 'block';
}

function playAgain() {
    magicNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    previousAttempts = [];
    document.getElementById('result').innerHTML = '';
    document.getElementById('attempts').innerHTML = '';
    document.getElementById('guess').disabled = false;
    document.getElementById('submit').disabled = false;
    document.getElementById('play-again').style.display = 'none';
    document.getElementById('guess').value = '';
    document.getElementById('timer').textContent = '00:00'; // Reinicia el cronómetro
    document.getElementById('records-list').style.display = 'none';
    document.getElementById('show-records').style.display = 'block';
    document.getElementById('clear-records').style.display = 'block';
}


function getElapsedTime() {
    return Math.floor((Date.now() - startTime) / 1000); // Tiempo en segundos
}

function saveScore(name, attempts, time) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];

    scores.push({ name, attempts, time });

    scores.sort((a, b) => {
        if (a.attempts !== b.attempts) {
            return a.attempts - b.attempts;
        }
        return a.time - b.time;
    });

    scores = scores.slice(0, 10);

    localStorage.setItem('scores', JSON.stringify(scores));
    alert('¡Puntuación guardada!');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minuto${minutes !== 1 ? 's' : ''} con ${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
}

function displayScores() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    const recordsList = document.getElementById('records-list');
    
    recordsList.innerHTML = '<h2>Récords</h2>';

    if (scores.length === 0) {
        recordsList.innerHTML += '<p>No hay récords guardados.</p>';
        return;
    }

    let scoresList = '<ol>';
    scores.forEach(score => {
        const formattedTime = formatTime(score.time);
        scoresList += `<li>${score.name}: ${score.attempts} intentos, ${formattedTime}</li>`;
    });
    scoresList += '</ol>';
    recordsList.innerHTML += scoresList;
    recordsList.style.display = 'block';
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    // Mostrar los puntajes en la interfaz si es necesario
    console.log('Puntajes cargados:', scores);
}

function clearRecords() {
    if (confirm("¿Estás seguro de que deseas eliminar todos los récords?")) {
        localStorage.removeItem('scores');
        document.getElementById('records-list').innerHTML = '<p>No hay récords guardados.</p>';
        alert('Récords eliminados.');
    }
}
