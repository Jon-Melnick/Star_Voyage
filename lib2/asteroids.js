var Game = require("./game");
var GameView = require("./gameView");
const StarSystem = require('./star_system')

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = screen.width;
  canvasEl.height = screen.width;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();
  new GameView(game, ctx).start();
});
