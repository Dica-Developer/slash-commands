var Url = require('url');
var http = require('http');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/wetter', function(request, response) {
  var url = Url.parse(request.url, true);
  if (null !== url.query && undefined !== url.query && url.query.hasOwnProperty('text')) {
    http.get('http://api.openweathermap.org/data/2.5/weather?APPID=' + process.env.OWM_APPID + '&lang=de&q=' + url.query.text, function(weatherResponse) {
      var body = '';
      weatherResponse.on('data', function(chunk) {
        body = body + chunk;
      });
      weatherResponse.on('end', function(chunk) {
        var resBody = '';
        for (var i = 0; i < JSON.parse(body).weather.length; i++) {
          resBody = resBody + JSON.parse(body).weather[i].description + ' ' +
            ((JSON.parse(body).main.temp - 273.15)).toFixed() + '°C ';
        }
        response.send(resBody);
      });
    }).on('error', function() {
      response.send('No weather for you today.');
    });
  } else {
    response.send('Help me please! Weather is a local phenomenon so specify a city!!!');
  }
});

app.get('/weather', function(request, response) {
  var url = Url.parse(request.url, true);
  if (null !== url.query && undefined !== url.query && url.query.hasOwnProperty('text')) {
    http.get('http://api.openweathermap.org/data/2.5/weather?APPID=' + process.env.OWM_APPID + '&q=' + url.query.text, function(weatherResponse) {
      var body = '';
      weatherResponse.on('data', function(chunk) {
        body = body + chunk;
      });
      weatherResponse.on('end', function(chunk) {
        var resBody = '';
        for (var i = 0; i < JSON.parse(body).weather.length; i++) {
          resBody = resBody + JSON.parse(body).weather[i].description + ' ' +
            (((JSON.parse(body).main.temp - 273.15) * 1.8000) + 32).toFixed() + '°F ';
        }
        response.send(resBody);
      });
    }).on('error', function() {
      response.send('No weather for you today.');
    });
  } else {
    response.send('Help me please! Weather is a local phenomenon so specify a city!!!');
  }
});

app.get('/willItBeRain', function(request, response) {
  var url = Url.parse(request.url, true);
  if (null !== url.query && undefined !== url.query && url.query.hasOwnProperty('text')) {
    http.get('http://api.openweathermap.org/data/2.5/forecast/hourly?APPID=' + process.env.OWM_APPID + '&q=' + url.query.text, function(weatherResponse) {
      var body = '';
      weatherResponse.on('data', function(chunk) {
        body = body + chunk;
      });
      weatherResponse.on('end', function(chunk) {
        var forecastResult = 'no rain ... I hope';
        var forecast = JSON.parse(body).list;
        for (var i = 0; i < forecast.length; i++) {
          var description = forecast[i].weather[0].description.toLowerCase();
          if (description.includes('rain') || description.includes('snow')) {
            forecastResult = 'it could rain in the next 3 hours';
          }
        }
        response.send(forecastResult);
      });
    }).on('error', function() {
      response.send('No weather for you today.');
    });
  } else {
    response.send('Help me please! Weather is a local phenomenon so specify a city!!!');
  }
});

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
