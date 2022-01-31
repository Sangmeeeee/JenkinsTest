var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended:false}));

var mainRouter = require('./routes/main.js');
app.use(mainRouter);

//start server
var port = (process.env.PORT || 8081);
//console.log('port:' + port);
app.listen(port, () => {
    console.log('Listen: ' + port);
});