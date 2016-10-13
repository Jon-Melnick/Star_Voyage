var Game = require("./game");
var GameView = require("./gameView");
const StarSystem = require('./star_system')

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
