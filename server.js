var Url = require('url');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/wetter', function(request, response) {
  var url = Url.parse(request.url);
  console.log(url.query);
  response.send(url.query);
  // http://api.openweathermap.org/data/2.5/weather?q=
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
