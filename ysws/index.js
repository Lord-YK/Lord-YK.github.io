const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const canvassize = 20
const box = canvas.width/canvassize;
let period;
let snake;
let food;
let score;
let directionqueue;
function init() {
  period = 150;
  snake = [{ x: 0, y: 19 }]; 
  food = { x: Math.floor(Math.random() * canvassize), y: Math.floor(Math.random() * canvassize) };
  score = 0;
  directionqueue = ["RIGHT", "RIGHT"];
  tick = 0;
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
function moveSnake() {
  const head = { ...snake[0] };
   if (directionqueue.length>2)
    directionqueue.shift()
  if (directionqueue[1] === "UP") head.y -= 1;
  if (directionqueue[1] === "DOWN") head.y += 1;
  if (directionqueue[1] === "LEFT") head.x -= 1;
  if (directionqueue[1] === "RIGHT") head.x += 1;
 
  snake.unshift(head);
  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    period*=0.8
    do{
      food = {
        x: Math.floor(Math.random() * canvassize),
        y: Math.floor(Math.random() * canvassize),
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  } else {
    snake.pop(); // Remove the tail if no food is eaten
  }
}
window.addEventListener('keydown', event => {
  let last = directionqueue.at(-1)
  if (event.key === 's' && (last === "DOWN" || last === "UP")) {directionqueue.push("LEFT");}
  if (event.key === 'f' && (last === "UP" || last === "DOWN")) {directionqueue.push("RIGHT");}
  if (event.key === 'e' && (last === "RIGHT" || last === "LEFT")) {directionqueue.push("UP");}
  if (event.key === 'd' && (last === "LEFT" || last === "RIGHT")) {directionqueue.push("DOWN");}
});
function checkGameOver() {
  const head = snake[0];
// Check wall collision
  if (head.x < 0 || head.x >= canvassize || head.y < 0 || head.y >= canvassize) {
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
    init()
  }
  
  drawGrid();
  drawSnake();
  drawFood();
  moveSnake();
  console.log(directionqueue)
 
}
init()
setInterval(gameLoop, period);