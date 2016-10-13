/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(2);
	const StarSystem = __webpack_require__(3)
	
	document.addEventListener("DOMContentLoaded", function(){
	  var body = document.getElementsByTagName("body")[0]
	  var width = body.offsetWidth;
	  var height = body.offsetHeight;
	
	  var canvasEl = document.getElementById("top");
	  canvasEl.width = width;
	  canvasEl.height = height;
	
	  var canvasEl2 = document.getElementById("bottom");
	  canvasEl2.width = width;
	  canvasEl2.height = height;
	
	  var canvasShip = document.getElementById("ship")
	
	  var ctxTop = canvasEl.getContext("2d");
	  var ctxBottom = canvasEl2.getContext("2d");
	  var game = new Game(height, width);
	  new GameView(game, ctxTop, ctxBottom).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(5);
	var Bullet = __webpack_require__(9);
	var Ship = __webpack_require__(8);
	const StarSystem = __webpack_require__(3)
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var GameView = function (game, ctxTop, ctxBottom) {
	  this.ctxTop = ctxTop;
	  this.ctxBottom = ctxBottom;
	  this.game = game;
	  this.ship = this.game.addShip();
	};
	
	GameView.MOVES = {
	  "w": [ 0, -1],
	  "a": [-1,  0],
	  "s": [ 0,  1],
	  "d": [ 1,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var ship = this.ship;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    var move = GameView.MOVES[k];
	    key(k, function () { ship.power(move); });
	  });
	
	  key("space", function () { ship.fireBullet() });
	};
	
	GameView.prototype.mouseMoveHandler = function(){
	  let that = this;
	  window.addEventListener("mousemove", function(e){
	    let mX = e.clientX;
	    let mY = e.clientY;
	    that.game.updateSpeed(mX, mY)
	  })
	};
	
	GameView.prototype.mouseClickHandler = function(){
	  let that = this;
	  window.addEventListener("click", function(e){
	    
	  })
	}
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.mouseMoveHandler();
	  this.mouseClickHandler();
	  this.lastTime = 0;
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  let timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctxTop, this.ctxBottom);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const StarRegion = __webpack_require__(4)
	
	const StarSystem = function(){
	  this.system = {};
	  this.generateSystem([0,0]);
	}
	
	StarSystem.prototype.generateSystem = function(region){
	  this.system[region] = new StarRegion();
	}
	
	
	new StarSystem();
	
	module.exports = StarSystem;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'
	
	
	const StarRegion = function(){
	  this.region = {};
	  this.generateRegion();
	}
	
	const chanceForStar = 0.55;
	const COLOR = {
	  0: 'yellow',
	  1: 'red',
	  2: 'blue',
	  3: 'white'
	}
	
	StarRegion.prototype.generateRegion = function () {
	  let x = 1
	  while (x < 10) {
	    let grid = {}
	    for (let i = 1; i <= 4000; i++) {
	      grid[i] = Math.random() > chanceForStar ? {type: '#', rad: Math.random() * 3, glow: Math.random() * .3, glowing: Math.random(), grow: true, color: COLOR[Math.floor(Math.random() * 4) % 4], posX: Math.random() * 100, posY: Math.random() * 100} : {type: '.'}
	    }
	    this.region[x] = grid;
	    x += 1;
	  }
	};
	
	
	
	StarRegion.prototype.displayMap= function(region){
	  let map = region
	  for (let i = 0; i < map.length; i++) {
	    let row = ''
	    for (let j = 0; j < map[i].length; j++) {
	      row += map[i][j].type;
	    }
	    console.log(row);
	  }
	}
	
	
	new StarRegion();
	
	module.exports = StarRegion


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var MovingObject = __webpack_require__(7);
	var Ship = __webpack_require__(8);
	
	var DEFAULTS = {
		COLOR: "#505050",
		RADIUS: 25,
		SPEED: 4
	};
	
	var Asteroid = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	
	  MovingObject.call(this, options);
	};
	
	
	Asteroid.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	  }
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	Asteroid.prototype.type = "Asteroid";
	
	module.exports = Asteroid;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};
	
	MovingObject.prototype.collideWith = function (otherObject) {
	  ; // default do nothing
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	MovingObject.prototype.isWrappable = true;
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(8);
	var MovingObject = __webpack_require__(7);
	var Util = __webpack_require__(6);
	var Bullet = __webpack_require__(9);
	
	function randomColor() {
	  var hexDigits = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	var Ship = function (options) {
	  options.radius = Ship.RADIUS;
	  options.vel = options.vel || [0, 0];
	  options.color = options.color || randomColor();
	
	  MovingObject.call(this, options);
	};
	
	Ship.prototype.type = "Ship";
	
	Ship.RADIUS = 15;
	
	Util.inherits(Ship, MovingObject);
	
	Ship.prototype.fireBullet = function () {
	  var norm = Util.norm(this.vel);
	
	  if (norm == 0) {
	    // Can't fire unless moving.
	    return;
	  }
	
	  var relVel = Util.scale(
	    Util.dir(this.vel),
	    Bullet.SPEED
	  );
	
	  var bulletVel = [
	    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  ];
	
	  var bullet = new Bullet({
	    pos: this.pos,
	    vel: bulletVel,
	    color: this.color,
	    game: this.game
	  });
	
	  this.game.add(bullet);
	};
	
	Ship.prototype.power = function (impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	
	Ship.prototype.relocate = function () {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};
	
	Ship.prototype.type = "Ship";
	
	module.exports = Ship;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(6);
	var MovingObject = __webpack_require__(7);
	var Asteroid = __webpack_require__(5);
	
	var Bullet = function (options) {
	  options.radius = Bullet.RADIUS;
	
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 2;
	Bullet.SPEED = 15;
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Asteroid") {
	    this.remove();
	    otherObject.remove();
	  }
	};
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	module.exports = Bullet;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map