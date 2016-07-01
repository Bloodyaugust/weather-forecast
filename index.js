var compression = require('compression');
var express = require('express');
var fetch = require('node-fetch');
var bodyParser = require('body-parser');

var app = express();

var distMode = (process.argv[2] === 'dist');
var port = process.env.PORT || 8085;

var FORECAST_API_KEY = process.env.FORECAST;

app.use(bodyParser.json());
app.use(compression());
if (distMode) {
  app.use(express.static('public'));
} else {
  app.use(express.static('app'));
}
app.use('/bower_components', express.static('bower_components'));

app.get('/weather', function (req, res) {
  fetch('https://api.forecast.io/forecast/' + FORECAST_API_KEY + '/' + req.query.lat + ',' + req.query.long)
  .then(function (resp) {
    return resp.json();
  })
  .then(function (json) {
    res.json({
      code: 200,
      weather: json
    });
  })
  .catch(function (error) {
    res.status(500).json({
      code: 500,
      title: 'An Error, There Is!',
      message: 'Trouble while retrieving weather data, there was. Try again later, you will.'
    });
  });
});

app.listen(port, function () {
  console.log('Listening on port ' + port + ' in ' + (distMode ? 'dist' : 'dev') + ' mode');
});
