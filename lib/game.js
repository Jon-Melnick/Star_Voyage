var Asteroid = require("./asteroid");
var Bullet = require("./bullet");
var Ship = require("./ship");
const StarSystem = require('./star_system')
var Game = function (height, width) {
  this.asteroids = [];
  this.bullets = [];
  this.ships = [];
  this.gameHeight = height;
  this.gameWidth = width;
  this.starSystemTop = new StarSystem();
  this.starSystemBottom = new StarSystem();
  this.location = {system: [0,0], grid: 5, sector: 10000}
  this.speed = 0;
  this.i = 0;
  this.mouse = [0,0]
  this.direction = [0, 1]
  this.thrusters = [];
};

Game.prototype.holder = function () {
  let holder = [{h: height/2, w: width/2 - 17.5, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())}, {h: height/2, w: width/2 - 38.5, o: 1, s: 1, c: (Math.random() - Math.random())}, {h: height/2, w: width/2 - 17.5, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())}, {h: height/2, w: width/2 - 38.5, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())}, {h: height/2, w: width/2 - 17.5, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())}, {h: height/2, w: width/2 - 38.5, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())}]
};


Game.BG_COLOR = "#000000";
Game.FPS = 32;
Game.NUM_ASTEROIDS = 10;

Game.prototype.updateSpeed = function (mX, mY) {
  let divisor = this.gameHeight/this.gameWidth
  let dW = (this.gameWidth/(6/divisor));
  let dH = (this.gameHeight/6 * divisor)
  let w = Math.abs(mX - (this.gameWidth/2));
  let h = Math.abs(mY - (this.gameHeight/2));
  this.direction = [-(mX - (this.gameWidth/2))/dW, -(mY - (this.gameHeight/2))/dH]
  this.mouse = [mX, mY];
  this.speed = Math.floor(Math.max(w/dW, h/dH));
}

Game.prototype.add = function (object) {
  if (object.type === "Asteroid") {
    this.asteroids.push(object);
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ships.push(object);
  } else {
    throw "wtf?";
  }
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
    this.add(new Asteroid({ game: this }));
  }
};

Game.prototype.addShip = function () {
  var ship = new Ship({
    pos: this.randomPosition(),
    game: this
  });

  this.add(ship);

  return ship;
};

Game.prototype.allObjects = function () {
  return [].concat(this.ships, this.asteroids, this.bullets);
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 == obj2) {
        // don't allow self-collision
        return;
      }

      if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  });
};

Game.prototype.glow = function(star){
    if (star.grow) {
      star.glowing += star.glow;
      if (star.glowing >= 5) {
        star.grow = !star.grow
      }
    } else {
      star.glowing -= star.glow;
      if (star.glowing <= 0) {
        star.glowing = 0;
        star.grow = !star.grow
      }
    }
};



Game.prototype.draw = function (ctxTop, ctxBottom, ctxShip) {

  ctxBottom.clearRect(0, 0, this.gameWidth, this.gameHeight);
  let x = 0;
  let y = 0;
  Object.keys(this.starSystemBottom.system[[0,0]].region[5]).map(key => {
    let star = this.starSystemBottom.system[[0,0]].region[5][key]
    if (star.type === '#') {
      ctxBottom.fillStyle = star.color;

      this.glow(star);

      ctxBottom.globalAlpha = 0.5;
      ctxBottom.beginPath();
      ctxBottom.arc(
        x + star.posX, y + star.posY, star.glowing + 1 , 0, 2 * Math.PI, true
      );
      ctxBottom.fill();



      ctxBottom.globalAlpha = 1;
      ctxBottom.beginPath();
      ctxBottom.arc(
        x + star.posX, y + star.posY, star.rad, 0, 2 * Math.PI, true
      );
      ctxBottom.fill();
      // star.posY += (this.speed / 2) + .5
      star.posY += (this.direction[1] / 2)
      star.posX += (this.direction[0] / 2)
      if (star.posY + y > this.gameHeight) {
        star.posY = star.posY - this.gameHeight
      }
      if (star.posY + y < 0) {
        star.posY = this.gameHeight + star.posY
      }
      if (star.posX + x > 20000) {
        star.posX = star.posX - 20000
      }
      if (star.posX + x < 0) {
        star.posX = star.posX + 20000
      }
    }
    x += 100;
    if (x / 20000 === 1) {
      x = 0;
      y += 100;
    }
  })

  ctxTop.clearRect(0, 0, this.gameWidth, this.gameHeight);
  x = 20;
  y = 20;
  Object.keys(this.starSystemTop.system[[0,0]].region[5]).map(key => {
    let star = this.starSystemTop.system[[0,0]].region[5][key]
    if (star.type === '#') {
      ctxTop.fillStyle = star.color;

      this.glow(star);

      ctxTop.globalAlpha = 0.2;
      ctxTop.beginPath();
      ctxTop.arc(
        x + star.posX, y + star.posY, star.glowing + 1 , 0, 2 * Math.PI, true
      );
      ctxTop.fill();

      ctxTop.globalAlpha = 1;

      ctxTop.beginPath();
      ctxTop.arc(
        x + star.posX, y + star.posY, star.rad, 0, 2 * Math.PI, true
      );
      ctxTop.fill();
      // star.posY += this.speed + 1;
      star.posY += (this.direction[1])
      star.posX += (this.direction[0])
      if (star.posY + y > this.gameHeight) {
        star.posY = star.posY - this.gameHeight
      }
      if (star.posY + y < 0) {
        star.posY = star.posY + this.gameHeight
      }
      if (star.posX + x > 20020) {
        star.posX = star.posX - 20020
      }
      if (star.posX + x < 0) {
        star.posX = star.posX + 20020
      }
    }
    x += 100;
    if (x / 20020 === 1) {
      x = 20;
      y += 100;
    }
  })

  let imageObj = new Image();
  imageObj.src = 'http://res.cloudinary.com/arkean/image/upload/v1475350191/ship_w9t73b.gif';

  let rumble = ((Math.random() - Math.random()) * (this.speed / 4));

  let posX = (this.gameWidth / 2) - (imageObj.width / 2) + rumble;

  let posY = (this.gameHeight / 2) - (imageObj.height / 2) + rumble;

  let angle = Math.atan2(this.mouse[0]- (this.gameWidth/2),- (this.mouse[1]- (this.gameHeight/2)) )*(180/Math.PI);


  let hyp = Math.sqrt((30*30) + (11*11));
  let degree = (Math.asin(11/hyp) * 180 / Math.PI);

  let radLeft = ((angle + 180 + degree)%360) * Math.PI / 180;
  let radRight = ((angle + 180 - degree)%360) * Math.PI / 180;


  lx = 0 + hyp * Math.cos(radLeft);
  ly = 0 + hyp * Math.sin(radLeft);
  rx = 0 + hyp * Math.cos(radRight);
  ry = 0 + hyp * Math.sin(radRight);





  this.thrusters.forEach((particle, idx) =>{
    if (particle.o <= 0) {
      this.thrusters = [...this.thrusters.slice(0, idx), ...this.thrusters.slice(idx+1)]
    }
    ctxTop.fillStyle = 'white'
    ctxTop.globalAlpha = particle.o
    ctxTop.beginPath();
    ctxTop.arc(
     particle.w, particle.h, 3, 0, 2 * Math.PI, true
    );

    if (particle.h === this.gameHeight / 2){
      ctxTop.fillStyle = 'red'
    }

    particle.h += (particle.cH + this.direction[1] + ((Math.random() - Math.random()) * this.direction[1]));

    particle.w += particle.cW + this.direction[0];
    if (particle.o > 0) {
      particle.o -= Math.random() * .07;
      if (particle.o < 0){
        particle.o = 0;
      }
    }
    ctxTop.fill()
  })

  for (var i = 0; i < this.speed + 1; i++) {
    this.thrusters.push({h: this.gameHeight/2 - lx, w: this.gameWidth/2 + ly, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())});
    this.thrusters.push({h: this.gameHeight/2 - rx, w: this.gameWidth/2 + ry, o: 1, s: 1, cH: (Math.random() - Math.random()), cW: (Math.random() - Math.random())});
  }


  ctxTop.save();
  ctxTop.translate(posX + (imageObj.width / 2), posY + (imageObj.height / 2));
  ctxTop.rotate(angle*Math.PI/180);

  ctxTop.drawImage(imageObj, (-1 * (imageObj.width / 2)), (-1 * (imageObj.height / 2)));
  ctxTop.restore();

};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > this.gameWidth) || (pos[1] > this.gameHeight);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.randomPosition = function () {
  return [
    this.gameWidth * Math.random(),
    this.gameHeight * Math.random()
  ];
};

Game.prototype.remove = function (object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Asteroid) {
    var idx = this.asteroids.indexOf(object);
    this.asteroids[idx] = new Asteroid({ game: this });
  } else if (object instanceof Ship) {
    this.ships.splice(this.ships.indexOf(object), 1);
  } else {
    throw "wtf?";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.wrap = function (pos) {
  return [
    wrap(pos[0], this.gameWidth), wrap(pos[1], this.gameHeight)
  ];

  function wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Game;
