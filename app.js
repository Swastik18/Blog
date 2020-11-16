if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}


const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate');
const app = express()
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL || 'mongodb://localhost/Articles';



const blogRouter = require('./routes/blog')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/users')



mongoose.connect(dbUrl, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false, useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('DB Connected');
})


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const secret = process.env.SECRET || 'swastik'

const store = new MongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
})


store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:  1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())    //Storing a user in a session
passport.deserializeUser(User.deserializeUser()) //getting a user out of the session




app.use((req, res, next) =>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
})

app.use('/', userRouter)
app.use('/blogs', blogRouter)
app.use('/blogs/:id/reviews', reviewRouter);



app.get('/', (req, res) =>{
  res.render('home');
})



app.all('*', (req, res, next) =>{
  next(new ExpressError('Page not found', 404));
})


app.use((err, req, res, next) =>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'oh no, something went wrong';
  res.status(statusCode).render('error', {err});
});




const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
})



