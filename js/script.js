document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const pauseButton = document.getElementById("pauseButton");
    const restartButton = document.getElementById("restartButton");

    const canvasSize = 480;
    const blockSize = 20;
    let snake;
    let direction;
    let food;
    let score;
    let isPaused;
    let gameLoop;

    // Inicializar variáveis do jogo
    function initGame() {
        snake = [{ x: blockSize * 2, y: 0 }, { x: blockSize, y: 0 }, { x: 0, y: 0 }];
        direction = "RIGHT";
        food = generateFood();
        score = 0;
        isPaused = false;
        scoreElement.textContent = score;
        pauseButton.textContent = "Pausar";
        restartButton.classList.add("d-none");
        clearInterval(gameLoop);
        gameLoop = setInterval(gameTick, 100);
    }

    // Generate random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Generate food at a random position
    function generateFood() {
        const foodX = Math.floor(Math.random() * (canvasSize / blockSize)) * blockSize;
        const foodY = Math.floor(Math.random() * (canvasSize / blockSize)) * blockSize;
        return { x: foodX, y: foodY };
    }

    // Draw the game elements
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = getRandomColor();
            ctx.fillRect(segment.x, segment.y, blockSize, blockSize);
            ctx.strokeRect(segment.x, segment.y, blockSize, blockSize);
        });

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, blockSize, blockSize);
    }

    // Update the snake's position
    function update() {
        if (isPaused) return;

        const head = { ...snake[0] };

        switch (direction) {
            case "RIGHT":
                head.x += blockSize;
                break;
            case "LEFT":
                head.x -= blockSize;
                break;
            case "UP":
                head.y -= blockSize;
                break;
            case "DOWN":
                head.y += blockSize;
                break;
        }

        snake.unshift(head);

        // Check if the snake has eaten the food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = generateFood();
            scoreElement.textContent = score;
        } else {
            snake.pop();
        }

        // Check for collisions
        if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || isCollision(head)) {
            clearInterval(gameLoop);
            restartButton.classList.remove("d-none");
            alert("Game Over! Your score: " + score);
        }
    }

    // Check if the snake collides with itself
    function isCollision(head) {
        return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    // Handle keyboard input
    document.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "DOWN") direction = "UP";
                break;
            case "ArrowDown":
                if (direction !== "UP") direction = "DOWN";
                break;
            case "ArrowLeft":
                if (direction !== "RIGHT") direction = "LEFT";
                break;
            case "ArrowRight":
                if (direction !== "LEFT") direction = "RIGHT";
                break;
            case " ":
                togglePause();
                break;
        }
    });

    // Toggle the pause state
    function togglePause() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? "Continuar" : "Pausar";
    }

    pauseButton.addEventListener("click", togglePause);
    restartButton.addEventListener("click", initGame);

    // Run game tick (draw and update)
    function gameTick() {
        draw();
        update();
    }

    // Start the game
    initGame();
});
