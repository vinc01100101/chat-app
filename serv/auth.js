const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

module.exports = (app,db)=>{
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser((user,done)=>{
    console.log('SERIALIZING...')
    done(null,user._id);
  })
  
  passport.deserializeUser((id,done)=>{
    console.log('DESERIALIZING...')
    db.collection('users').findOne({_id: new ObjectID(id)},(err,doc)=>{
      done(null,doc);
    })
  })
  
  passport.use(new LocalStrategy((username,password,done)=>{
    console.log('User ' + username + 'attempted to login.')
    db.collection('users').findOne({username: username},(err,result)=>{
      
      if(err){
        return done(err);
      }else if(!result){
        console.log('WRONG USERNAME');
        return done(null,false,{message: 'Invalid username'});
      }else if(!bcrypt.compareSync(password,result.password)){
        console.log('WRONG PASSWORD');
        return done(null, false,{message: 'Incorrect password'});
      }else{
        return done(null, result);
      }
      
    })
  }))
}