const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerHeight;

while (canvas.width > window.innerWidth || canvas.height > window.innerHeight) {
    canvas.width--;
    canvas.height--;
}

const scale = canvas.height / 30;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let gameInterval;

console.log("hi");

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 1;
    this.ySpeed = 0;
    this.length = 4;
    this.parts = [[this.x, this.y]];

    this.draw = function() {
        for (let i = 0; i < this.parts.length; i++) {
            ctx.fillStyle = (i === 0) ? "#8934eb" : "#FFFFFF";  // Head is purple, body is white
            ctx.fillRect(this.parts[i][0] * scale, this.parts[i][1] * scale, scale, scale);
        }
    };

    this.update = function() {
        let headX = this.parts[0][0] + this.xSpeed;
        let headY = this.parts[0][1] + this.ySpeed;

        // Check if the snake runs into the walls
        if (headX < 0 || headY < 0 || headX >= columns || headY >= rows) {
            console.log("Gameover");
            clearInterval(gameInterval);
            setup();
            return;
        }

        this.parts.unshift([headX, headY]);

        // Remove the last part of the snake unless it has just eaten
        if (this.parts.length > this.length) {
            this.parts.pop();
        }

        // Check if the snake runs into itself
        for (let i = 1; i < this.parts.length; i++) {
            if (headX === this.parts[i][0] && headY === this.parts[i][1]) {
                console.log("Gameover");
                clearInterval(gameInterval);
                setup();
                return;
            }
        }

        this.x = headX;
        this.y = headY;
    };

    this.grow = function() {
        this.length++;
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function() {
        ctx.fillStyle = "#4287f5";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };

    this.update = function() {
        if (snake.x === this.x && snake.y === this.y) {
            food = new Food();
            snake.grow();
        }
    };
}

function setup() {
    snake = new Snake();
    food = new Food();

    gameInterval = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.update();
        snake.draw();
        food.draw();
        food.update();
    }, 250);
}

setup();

window.addEventListener("keydown", (e) => {
    let key = e.key;

    // Prevent the snake from reversing into itself
    if (key === "w" && snake.ySpeed === 0) {
        if (snake.parts[0][1] - 1 !== snake.parts[1][1]) {
            snake.xSpeed = 0;
            snake.ySpeed = -1;
        }
    } else if (key === "s" && snake.ySpeed === 0) {
        if (snake.parts[0][1] + 1 !== snake.parts[1][1]) {
            snake.xSpeed = 0;
            snake.ySpeed = 1;
        }
    } else if (key === "d" && snake.xSpeed === 0) {
        if (snake.parts[0][0] + 1 !== snake.parts[1][0]) {
            snake.xSpeed = 1;
            snake.ySpeed = 0;
        }
    } else if (key === "a" && snake.xSpeed === 0) {
        if (snake.parts[0][0] - 1 !== snake.parts[1][0]) {
            snake.xSpeed = -1;
            snake.ySpeed = 0;
        }
    }
});
