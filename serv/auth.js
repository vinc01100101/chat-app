const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

module.exports = (app,db)=>{

  
  passport.serializeUser((user,done)=>{
    done(null,user._id);
  })
  
  passport.deserializeUser((id,done)=>{
    db.collection('users').findOne({_id: new ObjectID(id)},(err,doc)=>{
      done(null,doc);
    })
  })
  
  passport.use(new LocalStrategy((username,password,done)=>{
    console.log('User ' + username + ' attempted to login.')
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