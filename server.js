var Url = require('url');
var express = require('express');
var http = require('http');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/wetter', function(request, response) {
  var url = Url.parse(request.url);
  if (url.query) {
    var query = url.query;
    if (query.hasOwnProperty('text')) {
      http.get('http://api.openweathermap.org/data/2.5/weather?q=' + query.text, function(response) {
        response.send(response);
      }).on('error', function() {
        response.send('No weather for you today!!!');
      });

    }
  }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
