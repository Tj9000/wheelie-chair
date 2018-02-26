var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();
var index = require('./routes/index');
var users = require('./routes/users');
var simulation = require('./routes/simulation');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var db = new sqlite3.Database(':memory:');
app.set('db',db);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/sim',simulation);
app.use('/users', users);

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

app.set('DBinit',function(){
  	db.serialize(function () {
	  db.run('CREATE TABLE vehicles (uid INTEGER PRIMARY KEY, type TEXT, location TEXT, status TEXT, position TEXT,'+
	  	'IP TEXT, MAC TEXT,commId TEXT, commType TEXT)');
	  var stmt = db.prepare('INSERT INTO vehicles(uid,type,position,status,location) VALUES(?,?,?,?,?)');

	    stmt.run(10001	,'CART'		,'0'	,'CHARGING'		,'BAY'		);
	    stmt.run(10002	,'CART'		,'a'	,'BUSY'			,'FLOOR1'	);
	    stmt.run(10003	,'CART'		,'b'	,'AVAIL'			,'FLOOR1'	);
	    stmt.run(10004	,'CART'		,'0'	,'CHARGING'		,'BAY'		);
	    stmt.run(10005	,'CART'		,'0'	,'CHARGING'		,'BAY'		);
	  stmt.finalize();
	  db.each('SELECT uid,type,position,status,location FROM vehicles', function (err, row) {
	    	console.log(row.uid,row.type,row.position,row.status,row.location);
	  	});

	});
});


module.exports = app;
