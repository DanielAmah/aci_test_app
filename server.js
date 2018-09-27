const express = require('express')
const bodyParser = require('body-parser');
const moment  = require('moment');
const https = require('https');
const querystring = require('querystring');

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {paymentDetails: null, checkout: null, paidDetails: null});
})
var checkoutID = ''

app.post('/', function (req, res) {

  function request(callback) {
    const path='/v1/checkouts';
    const data = querystring.stringify( {
      'authentication.userId':'8a8294175d602369015d73bf00e5180c',
      'authentication.password':'dMq5MaTD5r',
      'authentication.entityId':'8a8294175d602369015d73bf009f1808',
      'amount': req.body.amount,
      'currency': req.body.currency,
      'paymentType':'DB'
    });
    const options = {
      port: 443,
      host: 'test.oppwa.com',
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };
    const postRequest = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        jsonRes = JSON.parse(chunk);
        return callback(jsonRes);
      });
    });
    postRequest.write(data);
    postRequest.end();
  }

  request(function(responseData) {
    if(req.body.amount && req.body.currency) {
      let description = responseData.result.description;
      let timestamp = responseData.timestamp;
      checkoutID = responseData.id;
      const paymentStatus = `Checkout Description: ${description}! \n Checkout Time: ${moment(timestamp).format('LLL')}`
      res.render('index', { paymentDetails: paymentStatus, checkout: checkoutID, paidDetails: null });
    }
    else {
      const paymentStatus = 'Kindly specify an amount and the currency'
      res.render('index', { paymentDetails: paymentStatus, checkout: checkoutID, paidDetails: null });
    }
  });
})

app.get('/payments', function(req, res) {
  function request(callback) {
    var path=`/v1/checkouts/${checkoutID}/payment`;
    path += '?authentication.userId=8a8294175d602369015d73bf00e5180c';
    path += '&authentication.password=dMq5MaTD5r';
    path += '&authentication.entityId=8a8294175d602369015d73bf009f1808';
    var options = {
      port: 443,
      host: 'test.oppwa.com',
      path: path,
      method: 'GET',
    };
    var postRequest = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        jsonRes = JSON.parse(chunk);
        return callback(jsonRes);
      });
    });
    postRequest.end();
  }

  request(function(responseData) {
    let description = responseData.result.description;
      let timestamp = responseData.timestamp;
      if(responseData.amount==undefined || responseData.currency==undefined ) {
        const paymentStatus = `Payment Description: ${description}! \n\n Payment Time: ${moment(timestamp).format('LLL')}`
        res.render('index', { paymentDetails: null, checkout: null, paidDetails: paymentStatus });
      }
      else {
        let amountWithCurrency = `${responseData.amount} ${responseData.currency}`
        const paymentStatus = `Payment Description: ${description}! \n\n Amount: ${amountWithCurrency} \n\n Payment Time: ${moment(timestamp).format('LLL')}`
        res.render('index', { paymentDetails: null, checkout: null, paidDetails: paymentStatus });
      }
  });

})

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
})
