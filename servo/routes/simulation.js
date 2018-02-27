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

router.get('/requestVehi', function(req, res, next) {
	var user=req.query.user,
		vehiType=req.query.type,
		loc=req.query.loc,
		pos=req.query.pos;

	req.app.get('db').all('SELECT uid,location,status,position FROM vehicles where type=? and (location=? or location="BAY") ORDER BY location DESC, position ASC',[vehiType,loc], function(err,rows){
		if(err){
				console.log(err);
				res.status(400);
				res.end();
		}
		var vid=null;
		for (var i = 0; i < rows.length; i++) {
			if(rows[i].location == 'BAY'){
				if(!vid)
					vid=i;
				break;
			}
			else if(rows[i].location == loc && rows[i].position == pos && rows[i].status == 'AVAIL'){
				vid=i;
				break;
			}
			else if(rows[i].location == loc && rows[i].position < pos && rows[i].status == 'AVAIL'){
				vid=i;
				if(rows[i+1].location == 'BAY')
					break;
				if(rows[i+1].location == loc && rows[i+1].position > pos && rows[i].status == 'AVAIL'){
					if(pos.charCodeAt(0)-rows[i].position.charCodeAt(0)>rows[i+1].position.charCodeAt(0)-pos.charCodeAt(0)){
						vid=i+1;
					}
					break;
				}
				
			}
			else if(rows[i].location == loc && rows[i].position > pos && rows[i].status == 'AVAIL'){
				vid=i;
				break;	
			}
		}
		// var sendText=JSON.stringify(rows)+"<br><br>"+JSON.stringify(rows[vid]);
		// res.status(200).send(sendText);
		req.app.get('db').run('UPDATE vehicles SET location = ?, position = ?, status = "BUSY" where uid = ?',[loc,pos,rows[vid].uid],function(err){
			if(err){
				console.log(err);
				res.status(400);
				res.end();
			}

		}).get('SELECT uid,location,status,position FROM vehicles where uid=?',[rows[vid].uid], function(err,row){
				console.log(vid);
				if(err){
					console.log(err);
					res.status(400);
					res.end();
				}
				else{
					var sendText=JSON.stringify({'before':rows[vid],'after':row});
					res.status(200).send(sendText);
				}
			});
	});
});


router.get('/command', function(req, res, next) {
	console.log(req.query.uid);
	console.log(req.query.command);
	req.app.get('sendMQTTcommand')(req.query.uid,req.query.command);
	res.status(200);
	res.end();
});

module.exports = router;
