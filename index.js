const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

window.onresize = (evt) => {
  canvas.width = $("#canvas").width();
  canvas.height = $("#canvas").height();
  ctx.strokeStyle = "white";
};
window.onresize();

ctx.fillStyle = "black";
ctx.strokeStyle = "white";

function run() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Animation code

  requestAnimationFrame(run);
}

run();
