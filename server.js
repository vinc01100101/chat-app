'use strict';

const express = require('express');
const app = express();
const routes = require('./serv/routes');
const auth = require('./serv/auth');
const emits = require('./serv/emits');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport    = require('passport');
const session = require('express-session');
const sessionStore= new session.MemoryStore();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const passportSocketIo = require('passport.socketio');
const cookieParser= require('cookie-parser');

require('dotenv').config();

app.use(express.static(__dirname + '/dist'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  console.log(
    req.path + ' || ' +
    req.method + ' || ' +
    (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + ' || ' +
    req.hostname
  );
  next();
})

app.use((req,res,next)=>{
  console.log("COOKIE: " + req.headers.cookie);
  next();
})

mongoose.connect(process.env.DATABASE,{useNewUrlParser: true},(err,db)=>{
  if(err){
    console.log('DATABASE ERROR: ' + err.message);
  }else{
    console.log("DATABASE CONNECTED")
    auth(app,db);
    routes(app,db);
    
    const port = process.env.PORT;
    http.listen(port,()=>{
      console.log("Listening to port: " + port);
    })
    
    io.use(passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'express.sid',
      secret: process.env.SESSION_SECRET,
      store: sessionStore
    }));
    emits(io);
  }
  
})



