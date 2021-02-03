
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var fPS = 60;
var ballX = 30;
var ballY = 100;
var ballSpeedX = 8;
var ballSpeedY = 3;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 20;

var showingWinScreen = false;

// mouse move event 
canvas.addEventListener("mousemove", function (evt) {
  var mousePos = calculateMousePos(evt);
  paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
});

// mouse move event 
canvas.addEventListener("mousedown", function (evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
});

// Functions of Game

setInterval(function () {
  drawEverything();
  moveEverything();
}, 1000 / fPS);

function drawEverything() {
    ctx.font = "30px sans-serif";  // fontsize and font family
  // Canvas bgc black
  colorRect("black", 0, 0, canvas.width, canvas.height);

  if (showingWinScreen) {
    ctx.fillStyle = "white";
    ctx.fillText("click to continue...", 280, 400);

    if (player1Score >= WINNING_SCORE && player2Score >= WINNING_SCORE) {
      ctx.fillText("!!! Match Draw !!!", 330, 200);

    } else if (player1Score >= WINNING_SCORE) {
      ctx.fillText("You Won !", 330, 200);

    } else if (player2Score >= WINNING_SCORE) {
      ctx.fillText("You Lost !", 330, 200);

    }
    return;
  }
  drawNet();
  // Left pad for player
  colorRect("white", 0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Right pad for computer
  colorRect(
    "white",
    canvas.width - PADDLE_WIDTH,
    paddle2Y,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // draws a ball
  colorCircle("white", ballX, ballY, 10);

  // Player Scores
  ctx.fillText(player1Score, 100, 100);
  ctx.fillText(player2Score, canvas.width - 100, 100);
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  paddleAIMove();
  var deltaY;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be before ballReset()
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y &&
      ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT / 2));
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be before ballReset()
      ballReset();
    }
  }

  if (ballY >= (canvas.height - 10) || ballY <= 10) {
    ballSpeedY = -ballSpeedY;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;
}
//////////////////  Core Functions Start  ////////////////////

//  AI MOVEMENT FOR PADDLE 2
function paddleAIMove() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 8;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 8;
  }
}

//Ball Reset
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

// calculates position of mouse on canvas
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var MouseX = evt.clientX - rect.left - root.scrollLeft;
  var MouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: MouseX,
    y: MouseY,
  };
}
//////////////////  Core Functions End  ////////////////////

///////////////////////// Draw functions Start    ///////////////////
//  draws rectangle
function colorRect(color, left, top, axisX, axisY) {
  ctx.fillStyle = color;
  ctx.fillRect(left, top, axisX, axisY);
}

//  draws circle
function colorCircle(color, centerX, centerY, radius) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

// Draws net based on canvas height
function drawNet() {
  for (i = 0; i < canvas.height; i += 40) {
    colorRect("white", (canvas.width / 2) - 1, i, 2, 20);
  }
}
///////////////////////// Draw functions End    ///////////////////
