const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const canvassize = 21
const box = canvas.width/canvassize;
let period;
let snake;
let food;
let score;
let directionqueue;
function init() {
  period = 150;
  snake = [{ x: 10, y: 10 }]; 
  food = { x: Math.floor(Math.random() * 10)+11, y: Math.floor(Math.random() * (canvassize-2))+1 };
  score = 0;
  directionqueue = ["", ""];

}
function sever() {
  period = 150;
  while (snake.length>3) {
    snake.pop()
  } 
  food = { x: Math.floor(Math.random() * 10)+11, y: Math.floor(Math.random() * (canvassize-2))+1 };
  score = 0;
}

function drawGrid() {
  for (let i = 0; i < canvassize; i++) {
    for (let j = 0; j < canvassize; j++) {
      ctx.fillStyle = '#000000'
      ctx.fillRect(i * box, j * box, box, box);
    }
  }
}
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = '#AAAAAA';
    ctx.fillRect(segment.x * box, segment.y * box, box+1, box+1);
  });
}
function drawFood() {
  ctx.fillStyle = '#AA0000';
  ctx.fillRect(food.x * box, food.y * box, box, box);
}
function shift(paramx,paramy) {
  snake.forEach(val => {val.x+=paramx;val.y+=paramy})
  food.x+=paramx;
  food.y+=paramy;
}
function moveSnake() {
  const head = { ...snake[0] };
   if (directionqueue.length>2)
    directionqueue.shift()
  if (directionqueue[1] === "UP") {head.y -= 1;snake.unshift(head);shift(0,1)}
  if (directionqueue[1] === "DOWN") {head.y += 1;snake.unshift(head);shift(0,-1)}
  if (directionqueue[1] === "LEFT") {head.x -= 1;snake.unshift(head);shift(1,0)}
  if (directionqueue[1] === "RIGHT") {head.x += 1;snake.unshift(head);shift(-1,0)}
  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    period*=0.8
    do{
      food = {
        x: Math.floor(Math.random() * 10)+11,
        y: Math.floor(Math.random() * (canvassize-2))+1,
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  } else if (snake.length>3) {
    snake.pop(); // Remove the tail if no food is eaten
  }
}
window.addEventListener('keydown', event => {
  let last = directionqueue.at(-1)
  if (event.key === 's' && last !== "RIGHT" && last !== "LEFT") {directionqueue.push("LEFT");}
  if (event.key === 'f' && last !== "LEFT" && last !== "RIGHT") {directionqueue.push("RIGHT");}
  if (event.key === 'e' && last !== "UP" && last !== "DOWN") {directionqueue.push("UP");}
  if (event.key === 'd' && last !== "DOWN" && last !== "UP") {directionqueue.push("DOWN");}
});
function checkGameOver() {
  const head = snake[0];
// Check wall collision
  if (food.x < 0 || food.x >= canvassize || food.y < 0 || food.y >= canvassize) {
    return true;
  }
  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}
function gameLoop() {
  if (checkGameOver()) {
    sever()

  }
  
  drawGrid();
  drawSnake();
  drawFood();
  moveSnake();

}


init();

setInterval(gameLoop, period);