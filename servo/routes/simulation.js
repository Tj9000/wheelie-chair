var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res,next) {
	  res.render('simulation/status', { title: 'Devices Connected'});
});
router.get('/getAllInfo', function(req, res, next) {
	req.app.get('db').all('SELECT uid,type,position,status,location FROM vehicles', function(err,rows){
		res.send(JSON.stringify(rows));
		res.end;
	});
});


module.exports = router;
