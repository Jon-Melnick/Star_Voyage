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
      grid[i] = Math.random() > chanceForStar ? {type: '#', rad: Math.random() * 3, color: COLOR[Math.floor(Math.random() * 4) % 4]} : {type: '.'}
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
