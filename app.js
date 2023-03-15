
const express = require ("express");
const app = express();
require('dotenv').config();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT;
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const db = require('./config/db');   //this is for db connecting not need here just to see in console

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport")



const adminRoute = require('./routes/adminRoutes');
const authRoute = require('./routes/authRoutes');
const homeRoute = require('./routes/homeRoutes');
const homeListRoute = require('./routes/homeListRoutes');
const iqRoute = require('./routes/iqRoutes');

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.dbURL,
      collectionName: "sessions",
    }),
    // cookie: { secure: true },
  })
);



app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
  if (req.isAuthenticated()) {
    console.log(req.user)
  }
console.log(req.session)

next();
});

app.use(function(req, res, next) {
  res.locals.req = req;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  
  next();
});





// app.get('/protected-route', (req, res, next) => {
    
//   // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
//   if (req.isAuthenticated()) {
//       res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
//   } else {
//       res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
//   }
// });

// // Visiting this route logs the user out
app.use('/auth', authRoute);
app.use('/', homeRoute);
app.use('/issb', homeListRoute);
app.use('/admin', adminRoute);
app.use('/iq', iqRoute);

// app.get('/login-success', (req, res, next) => {
//   res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
// });

// app.get('/login-failure', (req, res, next) => {
//   res.send('You entered the wrong password.');
// });










app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});