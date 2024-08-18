document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const playButton = document.getElementById('play-button');
  const canvas = document.getElementById('canvas');

  const finalScore = document.getElementById('final-score');
  
  playButton.addEventListener('click', () => {
    splashScreen.style.display = 'none';
    canvas.style.display = 'block';
    startGame(); // Function to start the game
  });
  
  // Initialize canvas and game elements
  canvas.style.display = 'none'; // Hide canvas initially
  initGame(); // Function to initialize game elements (if any)
});





var c = document.getElementById('canvas');
var ctx = c.getContext("2d");




var perm = [];
while (perm.length < 255){
  while(perm.includes(val = Math.floor(Math.random()*255)));
  perm.push(val);
}

var lerp = (a,b,t) => a + (b-a) * (1-Math.cos(t*Math.PI))/2;
var noise = x=>{
  x = x * 0.01 % 254;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var Player = function(){
  this.x = c.width/2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.rSpeed = 0;


  this.img = new Image();
  this.img.src = "img/moto.png";
  this.draw = function(){
    var p1 =  c.height - noise(t + this.x) * 0.25;
    var p2 =  c.height - noise(t+5 + this.x) * 0.25;

    var grounded = 0;
    if(p1-12 > this.y){
      this.ySpeed += 0.1;
    }else{
      this.ySpeed -= this.y - (p1-12);
      this.y = p1 - 12;
      grounded = 1;
    }

    var angle = Math.atan2((p2-12) - this.y, (this.x+5) - this.x);
    this.y += this.ySpeed;

    if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
      playing = false;
      this.rSpeed = 5;
      k.ArrowUp = 1;
      this.x -= speed * 5;
    }


    if(grounded && playing){
      this.rot -= (this.rot - angle) * 0.65;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }
    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
    this.rot -= this.rSpeed * 0.1;
    if(this.rot > Math.PI) this.rot = -Math.PI;
    if(this.rot < -Math.PI) this.rot = Math.PI;
    ctx.save();
    ctx.translate(this.x, this.y - 3);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -15, -15, 30, 30);
    ctx.restore();
  }
}



var player = new Player();
var sceneOffset = 0;
var score = 0;
var highestScore = 0; 
var lastX = player.x;
var t = 0;
var speed = 0;
var playing = true;
var k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
function loop(){
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
  t += 10 * speed;
  sceneOffset += speed; 
  ctx.fillStyle = "#19f";
  ctx.fillRect(0,0,c.width, c.height);

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.moveTo(0, c.height);
  for (let i = 0; i < c.width; i++)
  ctx.lineTo(i, c.height*0.8 - noise(t + i*5) * 0.25);
  ctx.lineTo(c.width, c.height);
  ctx.fill();

  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(0, c.height);
  for (let i = 0; i < c.width; i++)
  ctx.lineTo(i, c.height - noise(t + i) * 0.25);
  ctx.lineTo(c.width, c.height);
  ctx.fill();

  player.draw();

  // Debug: Log player.x and lastX
  // console.log(`Player X: ${player.x}, Last X: ${lastX}`);

  // Update score based on sceneOffset
  score = Math.floor(sceneOffset / 10); // Change the divisor to adjust scoring rate
  
  console.log(`Score: ${score}`); // For debugging

  // Update highest score
  if (score > highestScore) {
    highestScore = score;
  }


  drawScore();



  if(player.x < 0){

  document.getElementById('score').innerText = 'Your Score: ' + score;
  document.getElementById('highest-score').innerText = 'Highest Score: ' + highestScore;

  // Show the splash screen
  document.getElementById('play-button').style.display = 'block';
  document.getElementById('score').style.display = 'block';
  document.getElementById('splash-screen').style.display = 'block';


  // Hide the game screen
  canvas.style.display = 'none';
  restart();
}
  requestAnimationFrame(loop);
}

onkeydown = d=> k[d.key] = 1;
onkeyup = d=> k[d.key] = 0;

function restart(){

  player = new Player();
  t = 0;
  speed = 0;
  playing = true;

  // Reset the scene offset and score
  sceneOffset = 0;
  score = 0;
  k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};

}


function drawScore() {
  ctx.save();
  ctx.font = "24px Arial";
  ctx.fillStyle = "#fff"; // White color for text
  ctx.textBaseline = "top";

  // Draw current score
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 10);

  // Calculate the width of the highest score text
  const highestScoreText = "Highest Score: " + highestScore;
  const highestScoreWidth = ctx.measureText(highestScoreText).width;

  // Draw highest score aligned to the right
  ctx.textAlign = "right";
  ctx.fillText(highestScoreText, c.width - 10, 10); // 10px padding from the right edge

  ctx.restore();
}


// Add touch control after initializing the canvas
c.addEventListener('touchstart', function() {
  k.ArrowUp = 1;
});

c.addEventListener('touchend', function() {
  k.ArrowUp = 0;
});

loop();

// control settings
document.addEventListener("keydown", button_down);
document.addEventListener("keyup", button_up);

function button_down(event){
  let key = event.keyCode;

  if(key == 38){
    console.log("up");
    document.getElementsByTagName("kbd")[0].style.cssText = "border:1px solid var(--lg-); color: #ffa502;"
    document.querySelectorAll(".table p")[0].style.cssText = "box-shadow: 0 0 15px #d35400; text-shadow: 0 0 15px #d35400;"
  }else if(key == 37){
    console.log("left");
    document.getElementsByTagName("kbd")[1].style.cssText = "border:1px solid var(--lg-); color: #ffa502;"
    document.querySelectorAll(".table p")[1].style.cssText = "box-shadow: 0 0 15px #d35400; text-shadow: 0 0 15px #d35400;"
  }else if(key == 40){
    console.log("down");
    document.getElementsByTagName("kbd")[2].style.cssText = "border:1px solid var(--lg-); color: #ffa502;"
    document.querySelectorAll(".table p")[2].style.cssText = "box-shadow: 0 0 15px #d35400; text-shadow: 0 0 15px #d35400;"
  }else if(key == 39){
    console.log("right");
    document.getElementsByTagName("kbd")[3].style.cssText = "border:1px solid var(--lg-); color: #ffa502;"
    document.querySelectorAll(".table p")[3].style.cssText = "box-shadow: 0 0 15px #d35400; text-shadow: 0 0 15px #d35400;"
  }
}

function button_up(event){
  let key = event.keyCode;

  if(key == 38){
    console.log("up_back");
    document.getElementsByTagName("kbd")[0].style.cssText = "border:1px solid grey; color: var(--gr-);"
    document.querySelectorAll(".table p")[0].style.cssText = "box-shadow: none; text-shadow: none;"
  }else if(key == 37){
    console.log("left_back");
    document.getElementsByTagName("kbd")[1].style.cssText = "border:1px solid grey; color: var(--gr-);"
    document.querySelectorAll(".table p")[1].style.cssText = "box-shadow: none; text-shadow: none;"
  }else if(key == 40){
    console.log("down_back");
    document.getElementsByTagName("kbd")[2].style.cssText = "border:1px solid grey; color: var(--gr-);"
    document.querySelectorAll(".table p")[2].style.cssText = "box-shadow: none; text-shadow: none;"
  }else if(key == 39){
    console.log("right_back");
    document.getElementsByTagName("kbd")[3].style.cssText = "border:1px solid grey; color: var(--gr-);"
    document.querySelectorAll(".table p")[3].style.cssText = "box-shadow: none; text-shadow: none;"
  }
}


if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', handleOrientation);
} else {
  alert('DeviceOrientationEvent is not supported by your browser.');
}

function handleOrientation(event) {
  let tiltLR = event.gamma;

  // Dead zone of 5 degrees
  if (Math.abs(tiltLR) > 5) {
    let normalizedTilt = tiltLR / 90;

    k.ArrowRight = normalizedTilt > 0 ? Math.abs(normalizedTilt) : 0;
    k.ArrowLeft = normalizedTilt < 0 ? Math.abs(normalizedTilt) : 0;
  } else {
    k.ArrowRight = 0;
    k.ArrowLeft = 0;
  }
}


document.getElementById('gearButton').addEventListener('touchstart', function(event) {
  event.preventDefault();  // Prevent default long press behavior
  k.ArrowUp = 1;  // Simulate pressing the up arrow
});

document.getElementById('gearButton').addEventListener('touchend', function(event) {
  event.preventDefault();  // Prevent default long press behavior
  k.ArrowUp = 0;  // Simulate releasing the up arrow
});

// Add event listeners for desktop mouse interaction
document.getElementById('gearButton').addEventListener('mousedown', function() {
  k.ArrowUp = 1;  // Simulate pressing the up arrow
});

document.getElementById('gearButton').addEventListener('mouseup', function() {
  k.ArrowUp = 0;  // Simulate releasing the up arrow
});



let buttonPressInterval;

const gearButton = document.getElementById('gearButton');

// Function to simulate the "up" action
function triggerUpAction() {
  // console.log("Gear button pressed - simulating up action");
  // Add the logic that should occur when the "up" action is triggered
}

// When the button is pressed down (either mouse or touch)
gearButton.addEventListener('mousedown', () => {
  gearButton.classList.add('pressed'); // Add the pressed class
  triggerUpAction(); // Trigger once immediately
  buttonPressInterval = setInterval(triggerUpAction, 100); // Continue triggering while held
});

gearButton.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent long press menu on mobile
  gearButton.classList.add('pressed'); // Add the pressed class
  triggerUpAction(); // Trigger once immediately
  buttonPressInterval = setInterval(triggerUpAction, 100); // Continue triggering while held
});

// When the button is released (either mouse or touch)
gearButton.addEventListener('mouseup', () => {
  gearButton.classList.remove('pressed'); // Remove the pressed class
  clearInterval(buttonPressInterval); // Stop triggering
});

gearButton.addEventListener('touchend', () => {
  gearButton.classList.remove('pressed'); // Remove the pressed class
  clearInterval(buttonPressInterval); // Stop triggering
});



document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});



