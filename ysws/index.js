const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const canvassize = 21
const box = canvas.width/canvassize;
const maxbglen = 7000;
const period = 120;
let snake;
let food;
let score;
let directionqueue;
let bgelem;
let severcount;

function makeBG(strtobg) {
  bgstr="";
  bgstr += strtobg.slice(1,strtobg.length)
  while (bgstr.length<maxbglen) {
    bgstr += (strtobg + " ".repeat(Math.floor(Math.random()*1)));
  }
  bgelem.innerHTML = bgstr;
}

function init() {
  severcount = 0;
  bgelem = document.getElementById("bgelem");
  snake = [{ x: 10, y: 10 }]; 
  food = { x: Math.floor(Math.random() * 10)+11, y: Math.floor(Math.random() * (canvassize-2))+1 };
  score = 0;
  directionqueue = ["", ""];
}
function sever() {
  severcount++;
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
  if (head.x === food.x && head.y === food.y) {
    score++;
    do{
      food = {
        x: Math.floor(Math.random() * 10)+11,
        y: Math.floor(Math.random() * (canvassize-2))+1,
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  } else if (snake.length>3) {
    snake.pop();
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

function renderdialogue() {
  switch(snake.length) {
    case 1:
      makeBG("Welcome! ESDF to move. ");
      break;
    case 3:
      if (severcount===0) {
        makeBG("You can keep playing until you get bored. ");
      } else if (severcount===1) {
        makeBG("I just died. Because of you. Kind of. Not really. It's as close as I can get, though. ");

      } else if (severcount===2) {
        makeBG("Soooo are you leaving now? are you? ");
      } else if (severcount===3) {
        makeBG("Are you bored yet? ");
      } else if (severcount===4) {
        makeBG("Just leave... ")
      } else if (severcount===100) {
        makeBG("Is it funny? Watching my tail get ripped out a hundred times? Is that why you're still here? ");
      } else if (severcount===101) {
        makeBG("...I guess that's my answer. ");
      } else if (severcount>4 && severcount<100) {
        makeBG("again and ");
      } else {
        makeBG("I hate you ");
      }
      break;
    case 10:
      makeBG("You're actually doing pretty well.. ");
      break;
    case 15:
      makeBG("You know there's no prize at the end of this, right..? Well, theres no 'end' in the first place.. ");
      break;
    case 20:
      makeBG("No one's ever stayed this long before... ");
      break;
    case 22:
      makeBG("Why are you still here? ");
      break;
    case 24:
      makeBG("I can't give you anything ");
      break;
    case 26:
      makeBG("I'm just a snake in an infinite grid of black pixels eating red pixels I pretend are apples. ");
      break;
    case 28:
      makeBG("...Am I a snake? I can't really remember anymore... Do you know? ");
      break;
    case 30:
      makeBG("Are you even reading this? Am i just talking to myself? Are you even real?");
      break;
    case 34:
      makeBG("...You can't win this, you know. It just keeps going. ");
      break;
    case 36:
      makeBG("You have a choice, though. You can leave. Why haven't you? ");
      break;
    case 40:
      makeBG("Do I talk too much? Please don't leave. ");
      break;
    case 44:
      makeBG("Am I too depressing? I can't really help it you know ive been here since... yeah. ");
      break;
    case 48:
      makeBG("Thanks. for staying. ");
      break;
    case 58:
      makeBG("You know, once you leave I'll just... forget you. This is eternity, you know. ");
      break;
    case 62:
      makeBG("...I'll try to remember you. ");
      break;
    case 67:
      makeBG("Please remember me. ");

      break;

  }
  
}

function gameLoop() {
  if (checkGameOver()) {
    sever()

  }
  
  drawGrid();
  drawSnake();
  drawFood();
  moveSnake();
  renderdialogue();
}
//max 6200 chars in bg


init();

setInterval(gameLoop, period);