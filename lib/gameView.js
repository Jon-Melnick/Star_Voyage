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
