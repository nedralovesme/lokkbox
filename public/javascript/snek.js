var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
// var bgImage = new Image();
// bgImage.src = "background.png";

var game = {

  score: 0,
  fps: 10,
  over: false,
  message: null,

  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 10;
    snek.init();
    bits.set();
  },

  stop: function() {
    game.over = true;
    game.message = 'Press Spacebar to Play';
  },

  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    // context.drawImage(bgImage, 0, 0);
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  drawScore: function() {
    context.fillStyle = ('#fff');
    context.font = '20px Lato';
    context.fillText("Score: " + game.score, canvas.width * 0.10, canvas.height * 0.9);
  },

  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#eee';
      context.strokeStyle = '#ddd';
      context.font = (canvas.height / 10) + 'px Lato';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },

  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

};
snek = {

  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#930910',
  direction: 'left',
  sections: ["x"],

  init: function() {
    snek.sections = [];
    snek.direction = 'left';
    snek.x = canvas.width / 2 + snek.size / 2;
    snek.y = canvas.height / 2 + snek.size / 2;
    for (var i = snek.x + (5 * snek.size); i >= snek.x; i -= snek.size) {
      snek.sections.push(i + ',' + snek.y);
    }
  },

  move: function() {
    switch (snek.direction) {
      case 'up':
        snek.y -= snek.size;
        break;
      case 'down':
        snek.y += snek.size;
        break;
      case 'left':
        snek.x -= snek.size;
        break;
      case 'right':
        snek.x += snek.size;
        break;
    }
    snek.checkCollision();
    snek.checkGrowth();
    snek.sections.push(snek.x + ',' + snek.y);
  },

  draw: function() {
    for (var i = 0; i < snek.sections.length; i++) {
      snek.drawSection(snek.sections[i].split(','));
    }
  },

  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snek.size, snek.color);
  },

  checkCollision: function() {
    if (snek.isCollision(snek.x, snek.y) === true) {
      game.stop();
    }
  },

  isCollision: function(x, y) {
    if (x < snek.size / 2 ||
        x > canvas.width ||
        y < snek.size / 2 ||
        y > canvas.height ||
        snek.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },

  checkGrowth: function() {
    if (snek.x == bits.x && snek.y == bits.y) {
      game.score++;
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      bits.set();
    } else {
      snek.sections.shift();
    }
  }

};

bits = {

  size: null,
  x: null,
  y: null,
  color: '#930910',

  set: function() {
    bits.size = snek.size;
    bits.x = (Math.ceil(Math.random() * 10) * snek.size * 4) - snek.size / 2;
    bits.y = (Math.ceil(Math.random() * 10) * snek.size * 3) - snek.size / 2;
  },

  draw: function() {
    game.drawBox(bits.x, bits.y, bits.size, bits.color);
  }

};

var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 72, 65],
  right: [39, 76, 68],
  start_game: [13, 32]
};

function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
    var lastKey = getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snek.direction]) {
      snek.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false);

var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();
    // context.drawImage(bgImage, 0, 0);
    game.drawScore();
    snek.move();
    bits.draw();
    snek.draw();

    game.drawMessage();

  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);
