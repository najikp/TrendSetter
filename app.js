const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs=require('express-handlebars');
require('mongoose');
var users = require('./routes/users');
const admin = require('./routes/admin');
const session =require('express-session');
const helpers = require('handlebars-helpers')();




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials',
helpers:{
  eq:(v1,v2)=>{
    return v1===v2;
  },
  gt:(v1,v2)=>{
    return v1>v2;
  },
  ne:(v1,v2)=>{
    return v1!==v2;
  },
  lt:(v1,v2)=>{
    return v1<v2;
  },
  lte:(v1,v2)=>{
    return v1<=v2;
  },
  gte:(v1,v2)=>{
    return v1>=v2;
  },
  and:(v1,v2)=>{
    return v1&&v2;
  },
  or:(v1,v2)=>{
    return v1||v2;
  },
  dec:(v1,v2)=>{
    return v1-v2;
  },
  format:(date)=>{
    newdate=date.toUTCString()
    return newdate.slice(0,16)
  },

  subTotal:(price,quantity)=>{
    return price*quantity
  }

}
}))


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"secret_key", resave:true, saveUninitialized:true,cookie:{maxAge:60000} }));

app.use((req, res, next)=>{
  if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});

app.use((req, res, next)=>{
  if (!req.admin) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});

app.use('/', users);
app.use('/admin', admin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
