var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	req.app.get('db').each('SELECT uid,type,position,status,location FROM vehicles', function (err, row) {
	    	console.log(row.uid,row.type,row.position,row.status,row.location);
	  	});
  res.render('index', { title: 'Express' });
});


module.exports = router;
