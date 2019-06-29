const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('connect-flash');

module.exports = (app,db)=>{
  app.use(flash());
  
  const ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
      console.log("USER IS AUTHENTICATED")
      res.render(path.resolve(process.cwd(),'dist/profile.pug'),{
        name: req.user.name
      })
    }else{
      res.render(path.resolve(process.cwd(),'dist/login.pug'),{
        errorMessage: req.flash('error')
      });
    }
    
  }
  
  app.route('/').get(ensureAuthenticated)
  
  app.route('/login').post(
    passport.authenticate('local',{
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true
    })
  )
  
  app.route('/register').get((req,res)=>{
    res.render(path.resolve(process.cwd(),'dist/register.pug'))
  })
  
  app.route('/register').post((req,res,next)=>{
    console.log(JSON.stringify(req.body));
    db.collection('users').findOne({username: req.body.username},(err,doc)=>{
      if(err){
        next(err);
      }else if(doc){
        console.log("Username already exists.");
        res.render(path.resolve(process.cwd(),'dist/register.pug'),{
          errorMessage: 'Username already exist'
        })
      }else{
        const hash = bcrypt.hashSync(req.body.password ,12);
        db.collection('users').insertOne({
          name: req.body.rName,
          surname: req.body.rSurname,
          username: req.body.username,
          password: hash,
          secretQuestion: req.body.rSecret,
          secretAnswer: req.body.rDigits
        },(err,registeredDoc)=>{
          if(err){
            next(err);
          }else{
            next(null,doc)
          }
        })
      }
    })
  },
    passport.authenticate('local',{failureRedirect: '/'}),
    (req,res)=>{
      console.log("Registration Successful!")
      res.redirect('/profile')
    }
  )
  
  app.route('/profile').get(ensureAuthenticated)
  
  app.route('/logout').get((req,res)=>{
    req.logout();
    res.redirect('/');
  })
  
  app.route('/error').get((req,res)=>{
    res.send('Something went wrong, please try again.')
  })
  
  app.use((req,res,next)=>{
		res.status(404).type('text').send("Opps! The page you are requesting for doesn't exist.. :(");
	})
}