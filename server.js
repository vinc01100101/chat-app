const express = require('express');
const app = express();
const routes = require('./serv/routes');
const auth = require('./serv/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next)=>{
  console.log(
    req.path + ' || ' +
    req.method + ' || ' +
    (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + ' || ' +
    req.hostname
  );
  next();
})

mongoose.connect(process.env.DATABASE,{useNewUrlParser: true},(err,db)=>{
  if(err){
    console.log('DATABASE ERROR: ' + err.message);
  }else{
    console.log("DATABASE CONNECTED")
    auth(app,db);
    routes(app,db);
    const listener = app.listen(process.env.PORT, function() {
      console.log('Listening on port ' + listener.address().port);
    });
  }
  
})



