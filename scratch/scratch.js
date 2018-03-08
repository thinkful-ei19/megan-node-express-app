'use strict';

function coinFlip (delay){
  return new Promise((resolve, reject) => {
    const rand = Boolean(Math.round(Math.random()));
    setTimeout(function () {
      if(rand){
        resolve('Heads!');}
      else{
        reject('Tails');
      }
    }, delay);
  });}
  
const coin1 = coinFlip(500).catch(err=> err);
const coin2 = coinFlip(500).catch(err=> err);
const coin3 = coinFlip(500).catch(err=> err);

Promise.all([coin1, coin2, coin3])
  .then(allResultsPutInAnArray => {
    console.log(allResultsPutInAnArray);
  })
  .catch(err=> console.log(err));



// coinFlip(500)
//   .then(msg => {
//     console.log(1, msg);
//     return coinFlip(300);
//   })
//   .then(msg => {
//     console.log(2, msg);
//     return coinFlip(300);
//   })
//   .then(msg => {
//     console.log(3, msg);
//     return coinFlip(300);
//   })
//   .then(msg => {
//     console.log(4, msg);
//     console.log('You Win!');
//   })
//   .catch(err=>{
//     console.error(err);
//   });
