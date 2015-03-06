var Url = require('url');
var http = require('http');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/wetter', function(request, response) {
  var url = Url.parse(request.url, true);
  if (null !== url.query && undefined !== url.query && url.query.hasOwnProperty('text')) {
    http.get('http://api.openweathermap.org/data/2.5/weather?q=' + url.query.text, function(weatherResponse) {
      var body = '';
      weatherResponse.on('data', function(chunk) {
        body = body + chunk;
      });
      weatherResponse.on('end', function(chunk) {
        var weatherDescription = JSON.parse(body).weather[0].description;
        response.send('/giphy ' + weatherDescription);
      });
    }).on('error', function() {
      response.send('No weather for you today.');
    });
  } else {
    response.send('Help me please! Weather is a local phenomenon so specify a city!!!');
  }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
