'use strict'

// let thing = [];
let a = new Date().getTime();
// for (let i = 0; i < 100; i++) {
//   let row = [];
//   for (let j = 0; j < 100; j++) {
//     if (Math.random() < 0.3) {
//       row.push('#')
//     } else {
//       row.push('.')
//     }
//   }
//   thing.push(row)
// }

let systemA = {}
let systemB = {}
let x = 1
while (x < 10) {
  let map = {}
  for (var i = 0; i < 40000; i++) {
    map[i] = Math.random() > 0.3 ? '#' : '.'
  }
  systemA[x] = map;
  x += 1;
}
let y = 1
while (y < 10) {
  let map = {}
  for (var i = 0; i < 40000; i++) {
    map[i] = Math.random() > 0.3 ? '#' : '.'
  }
  systemB[y] = map;
  y += 1;
}



let b = new Date().getTime();

console.log(b - a);
