'use strict'

const StarRegion = require('./star_region.js')

const StarSystem = function(){
  this.system = {};
  this.generateSystem([0,0]);
}

StarSystem.prototype.generateSystem = function(region){
  this.system[region] = new StarRegion();
}


new StarSystem();

module.exports = StarSystem;
