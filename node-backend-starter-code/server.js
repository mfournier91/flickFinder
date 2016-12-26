var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var path = require('path');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', function(req, res){ //get favorite movies
  var data = fs.readFileSync('./data.json'); // read data from the file
  res.setHeader('Content-Type', 'application/json');
  res.send(data); //respond with the data
});

app.post('/favorites', function(req, res){ //post a movie to favorites
  if(!req.body.name || !req.body.oid){
    res.send("Error"); //respond with error if request is missing name or oid
    return;
  }

  var data = JSON.parse(fs.readFileSync('./data.json')); //get all the data from file and set to a variable
  data.push(req.body); //add body of request to variable
  fs.writeFile('./data.json', JSON.stringify(data)); // save the variables new data to the file
  res.setHeader('Content-Type', 'application/json');
  res.send(data); //send back the new data as a response
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
