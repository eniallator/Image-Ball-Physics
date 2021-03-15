const numBalls = 500;
const ballRadius = 5;
const ballSpeed = 0.1;
const friction = 0.05;
const minVelocity = 0.1;
const maxWait = 2000;
const imageURL =
  "https://images.theconversation.com/files/18232/original/dqpgdxyk-1354493195.jpg?ixlib=rb-1.1.0&rect=0%2C21%2C1440%2C700&q=45&auto=format&w=1356&h=668&fit=crop";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const oldDim = { width: canvas.width, height: canvas.height };

let imageData;
let dt;
let prevTime = new Date().getTime();

const balls = new Array(numBalls).fill().map(() => {
  return {
    vel: { x: 0, y: 0 },
    pos: { x: Math.random() * canvas.width, y: Math.random() * canvas.height },
    waitingTime: 0,
  };
});

window.onresize = (evt) => {
  canvas.width = $("#canvas").width();
  canvas.height = $("#canvas").height();
  ctx.strokeStyle = "white";

  balls.forEach((ball) => {
    ball.pos.x = (ball.pos.x / oldDim.width) * canvas.width;
    ball.pos.y = (ball.pos.y / oldDim.height) * canvas.height;
  });
  oldDim.width = canvas.width;
  oldDim.height = canvas.height;
};
window.onresize();

ctx.strokeStyle = "white";

const getBrightness = (x, y) => {
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
    return 255;
  }
  const idx = (y * imageData.width + x) * 4;
  let sum = 0;
  for (let i = idx; i < idx + 3; i++) {
    sum += imageData.data[i];
  }
  return sum / 3;
};

const img = document.querySelector("#loading-image");
function run() {
  const currTime = new Date().getTime();
  dt = currTime - prevTime;
  prevTime = currTime;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ballRadius, 0, 2 * Math.PI);
    ctx.fill();

    const imgCoords = {
      x: Math.floor((ball.pos.x / canvas.width) * img.width),
      y: Math.floor((ball.pos.y / canvas.height) * img.height),
    };

    ball.vel.x +=
      ballSpeed *
      (getBrightness(imgCoords.x, imgCoords.y) -
        getBrightness(imgCoords.x + 1, imgCoords.y));
    ball.vel.y +=
      ballSpeed *
      (getBrightness(imgCoords.x, imgCoords.y) -
        getBrightness(imgCoords.x, imgCoords.y + 1));
    ball.vel.x *= 1 - friction;
    ball.vel.y *= 1 - friction;
    if (
      Math.abs(ball.pos.x + ball.vel.x * dt * ballSpeed - canvas.width / 2) >
      canvas.width / 2 - ballRadius
    ) {
      ball.vel.x *= -1;
    }
    if (
      Math.abs(ball.pos.y + ball.vel.y * dt * ballSpeed - canvas.height / 2) >
      canvas.height / 2 - ballRadius
    ) {
      ball.vel.y *= -1;
    }

    ball.pos.x += ball.vel.x * dt * ballSpeed;
    ball.pos.y += ball.vel.y * dt * ballSpeed;

    if (Math.abs(ball.vel.x) + Math.abs(ball.vel.y) < minVelocity * 2) {
      ball.waitingTime += dt;
    } else {
      ball.waitingTime = 0;
    }

    if (ball.waitingTime > maxWait) {
      ball.waitingTime = 0;
      ball.pos = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      };
      ball.vel = { x: 0, y: 0 };
    }
  });

  requestAnimationFrame(run);
}

img.src = imageURL;
img.onload = (evt) => {
  const loadedImageCanvas = document.querySelector("#loaded-image");
  loadedImageCanvas.width = canvas.width;
  loadedImageCanvas.height = canvas.height;

  const imageCtx = loadedImageCanvas.getContext("2d");
  imageCtx.drawImage(img, 0, 0, img.width, img.height);

  imageData = imageCtx.getImageData(0, 0, img.width, img.height);
  requestAnimationFrame(run);
};
