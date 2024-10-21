$(document).ready(function () {
    let rows, cols;
    let timerInterval;
    let seconds = 0;
    let points = 0; // Inicializa puntos
    let totalPoints = 0; // Total de puntos a recolectar

    function startTimer() {
        seconds = 0; // Reinicia el temporizador
        $("#timer").text("Tiempo: 0s"); // Resetea el texto del temporizador
        timerInterval = setInterval(() => {
            seconds++;
            $("#timer").text(`Tiempo: ${seconds}s`); // Actualiza el temporizador
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval); // Detiene el temporizador
    }

    function updatePointsDisplay() {
        $("#points").text(`Puntos: ${points}`); // Actualiza la visualización de puntos
    }

    function setTotalPoints() {
        totalPoints = rows === 9 ? 3 : rows === 19 ? 6 : 10; // Asigna puntos según dificultad
    }

    function placePoints(maze) {
        let placedPoints = 0;
        while (placedPoints < totalPoints) {
            const x = Math.floor(Math.random() * (rows - 2)) + 1;
            const y = Math.floor(Math.random() * (cols - 2)) + 1;
            if (maze[x][y] === "path") {
                maze[x][y] = "point"; // Coloca un punto en el laberinto
                placedPoints++;
            }
        }
    }

    function createPath(x, y, maze) {
        maze[x][y] = "path";

        const directions = [
            [0, 1],  // derecha
            [1, 0],  // abajo
            [0, -1], // izquierda
            [-1, 0]  // arriba
        ];

        directions.sort(() => Math.random() - 0.5);

        for (let [dx, dy] of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;

            if (newX >= 1 && newX < rows - 1 && newY >= 1 && newY < cols - 1) {
                if (maze[newX][newY] === "wall") {
                    maze[x + dx][y + dy] = "path";
                    createPath(newX, newY, maze);
                }
            }
        }
    }

    function generateMaze() {
        $("#maze").empty();
        $("#maze").css({
            "grid-template-columns": `repeat(${cols}, 15px)`,
            "grid-template-rows": `repeat(${rows}, 15px)`
        });

        let maze = Array.from({ length: rows }, () => Array(cols).fill("wall"));
        createPath(1, 1, maze);

        maze[1][1] = "start";
        maze[rows - 2][cols - 2] = "end";

        setTotalPoints(); // Establece el total de puntos a recolectar
        points = 0; // Reinicia los puntos al generar un nuevo laberinto
        updatePointsDisplay(); // Actualiza la visualización de puntos
        placePoints(maze); // Coloca los puntos en el laberinto

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = $("<div>").addClass("cell");
                if (maze[i][j] === "start") {
                    cell.addClass("start active");
                } else if (maze[i][j] === "end") {
                    cell.addClass("end");
                } else if (maze[i][j] === "wall") {
                    cell.addClass("wall");
                } else if (maze[i][j] === "point") {
                    cell.addClass("point"); // Añade la clase point
                } else {
                    cell.addClass("path");
                }
                $("#maze").append(cell);
            }
        }

        $("#actionButtons").show(); // Mostrar los botones de acción
        updateDifficultyButtons(); // Actualizar botones de dificultad
        startTimer(); // Iniciar el temporizador
    }

    function movePlayer(newPosition) {
        if (!newPosition.hasClass("wall")) {
            if (newPosition.hasClass("point")) {
                points++; // Incrementa los puntos si se recolecta uno
                newPosition.removeClass("point"); // Elimina el punto del laberinto
                updatePointsDisplay(); // Actualiza la visualización de puntos
            }
            $(".active").removeClass("active");
            newPosition.addClass("active");

            if (newPosition.hasClass("end")) {
                $("#successSound")[0].play(); // Reproducir el sonido
                alert(`¡Felicidades! Has llegado a la salida con ${points} puntos.`);
                stopTimer(); // Detener el temporizador
                $("#userInput").show(); // Mostrar la entrada de nombre
                $("#actionButtons").hide(); // Ocultar botones de acción
                $("#maze").empty(); // Limpiar el laberinto
            }
        }
    }

    function updateDifficultyButtons() {
        $("#lowerDifficulty").toggle(rows > 9); // Mostrar si hay dificultad más baja
        $("#higherDifficulty").toggle(rows < 31); // Mostrar si hay dificultad más alta
    }

    $(document).keydown(function (e) {
        const currentPosition = $(".active");
        const currentIndex = currentPosition.index();
        let newPosition;

        switch (e.which) {
            case 37: // Izquierda
                newPosition = currentPosition.prev();
                break;
            case 38: // Arriba
                newPosition = $("#maze .cell").eq(currentIndex - cols);
                break;
            case 39: // Derecha
                newPosition = currentPosition.next();
                break;
            case 40: // Abajo
                newPosition = $("#maze .cell").eq(currentIndex + cols);
                break;
            default:
                return;
        }

        if (newPosition && newPosition.length) {
            movePlayer(newPosition);
        }

        e.preventDefault(); // Prevenir desplazamiento de página
    });

    $("#startGame").click(function () {
        $("#difficultySelection").show(); // Mostrar opciones de dificultad
    });

    $(".difficulty").click(function () {
        const size = $(this).data("size");
        rows = size;
        cols = size;
        generateMaze();
        $("#difficultySelection").hide(); // Ocultar opciones de dificultad
        $("#userInput").hide(); // Ocultar la entrada de usuario y el botón
    });

    $("#giveUp").click(function () {
        $("#actionButtons").hide(); // Ocultar botones de acción
        $("#maze").empty(); // Limpiar el laberinto
        stopTimer(); // Detener el temporizador
        $("#userInput").show(); // Mostrar la entrada de nombre
        points = 0; // Reinicia los puntos al rendirse
        updatePointsDisplay(); // Actualiza la visualización de puntos
    });

    $("#newMaze").click(function () {
        generateMaze(); // Generar un nuevo laberinto con la misma dificultad
    });

    $("#lowerDifficulty").click(function () {
        if (rows > 9) {
            rows -= 10;
            cols -= 10;
            generateMaze(); // Generar nuevo laberinto de menor dificultad
        }
    });

    $("#higherDifficulty").click(function () {
        if (rows < 31) {
            rows += 10;
            cols += 10;
            generateMaze(); // Generar nuevo laberinto de mayor dificultad
        }
    });
});
