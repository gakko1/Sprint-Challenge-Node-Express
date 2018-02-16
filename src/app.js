const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const config = require('../config');
const data = require('../data');

const PORT = config.port;

const app = express();

app.use(bodyParser.json());

// tried to bring out functions to put in anonymous functions for async variable storing

// todayVal = () => {
//   let todayRate = data.todayRate;
//   fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
//   .then(res => res.json())
//   .then(val => {
//     todayRate = val.bpi.USD.rate_float;
//     console.log(todayRate);
//     res.send(todayRate);
//   })
//   .catch(err => console.log(err))
// }

// yesterdayVal = () => {
//   let yesterdayRate = data.yesterdayRate;
//   fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday')
//   .then(res => res.json())
//   .then(val => {
//    yesterdayRate = Object.values(val.bpi)[0];
//    console.log("YESTERDAY = ", yesterdayRate);
//    res.send(yesterdayRate);
//   })
//   .catch(err => console.log(err))
// }


// MUST RUN THIS FIRST BEFORE '/compare'
app.get('/values', (req, res) => {
fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(res => res.json())
  .then(val => {
    // console.log(val.bpi.USD);
    data.todayRate = val.bpi.USD.rate_float;
    // res.send(`Today's rate is ${data.todayRate} USD`);
  })
  .then(
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday')
    .then(res => res.json())
    .then(val => {
     data.yesterdayRate = Object.values(val.bpi)[0]
     // console.log("YESTERDAY = ", data.yesterdayRate);
     res.send(`
     Today's rate is ${data.todayRate} USD &
     Yesterday's rate was ${data.yesterdayRate} USD`);
    }))
  .catch(err => console.log(err))
});

app.get('/compare', (req, res) => {
  // trying to combine into one GET
  // (today) => {
  //   todayVal();
  // };
  // (yesterday) => {
  //   yesterdayVal();
  // };

  const difference = data.todayRate - data.yesterdayRate;
  // console.log(difference);   
  
  if (difference < 0) {
    res.send(`
    Yesterday's rate was ${data.yesterdayRate} USD,
    Today's rate is ${data.todayRate} USD,
    Bitcoin's value decreased by ${-1 * difference} USD since yesterday`);
  } else {
    res.send(`
    Yesterday's rate was ${data.yesterdayRate},
    Today's rate is ${data.todayRate},
    Bitcoin's value increased by ${difference} USD since yesterday`);
  }
});

app.listen(PORT, err => {
  if (err) {
    console.log(`There was an error: ${err}`);
  } else {
    console.log(`Server listening on port: ${PORT}`);
  }
})