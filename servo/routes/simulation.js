var express = require('express');
var router = express.Router();
var mapHelper =require('../helpers/mapHelper');


/* GET home page. */
router.get('/', function(req, res,next) {
	  res.render('simulation/status', { title: 'Devices Connected'});
});
router.get('/req', function(req, res,next) {
	  res.render('simulation/command', { title: 'Request services'});
});
router.get('/getAllInfo', function(req, res, next) {
	req.app.get('db').all('SELECT uid,type,position,status,location FROM vehicles', function(err,rows){
		res.send(JSON.stringify(rows));
		res.end;
	});
});
router.get('/getUIDs', function(req, res, next) {
	req.app.get('db').all('SELECT uid FROM vehicles', function(err,rows){
		var x=[];
		for (var i = 0; i < rows.length; i++) {
			x.push(rows[i].uid)
		}
		res.send(JSON.stringify(x));
		res.end;
	});
});

router.get('/requestVehi', function(req, res, next) {
	var user=req.query.user,
		vehiType=req.query.type,
		loc=req.query.loc,
		pos=req.query.pos;
		// posDest=req.query.posDest;
	var dbStmt = 'SELECT uid,location,status,position,type FROM vehicles where '+ (vehiType=='*'?'':'type=? and ') + '(location=? or location="BAY" or location="PARKING") ORDER BY location DESC, position ASC';
	var inserts = vehiType=='*'?[loc]:[vehiType,loc];
	// console.log(dbStmt,inserts)
	req.app.get('db').all(dbStmt,inserts, function(err,rows){
		if(err){
				console.log(err);
				res.status(400);
				res.end();
		}
		else{
			let r = rows.sort(function(a, b) {
		        var x = a.position; var y = b.position;
		        distA=mapHelper.getPathCost('floor1',x,pos)
		        distB=mapHelper.getPathCost('floor1',y,pos)
		        // console.log(x,y,pos,distA,distB);
		        return ((distA < distB) ? -1 : ((distA > distB) ? 1 : 0));
		    });
			var sendText=JSON.stringify(rows);
			res.status(200).send(sendText);
			res.end()
	}
		var vid=null;
	});
});

router.get('/bringToLocation', function(req, res, next) {
	console.log(req.query)
	req.app.get('db').all('SELECT uid,location,status,position FROM vehicles where uid=?',[req.query.uid], function(err,rows){
		if(err){
				console.log(err);
				res.status(400);
				res.end();
		}
		else{
			if(rows[0].position=='X' && rows[0].status!='BUSY'){
				req.app.get('db').run("UPDATE vehicles SET status='AVAIL', position=?, location=? WHERE uid=?",[req.query.to,req.query.loc,req.query.uid],function(err){
			          if(!err){
						res.status(200);
						res.end();
			          }
			          else{
			          	console.log("at simulation: /bringToLocation :",err)
			          	res.status(400);
			          	res.end()
			          }
			    });
			}
			else{
				res.status(200)
				res.end()
			}	
		}
	});
});


router.get('/command', function(req, res, next) {
	console.log(req.query);
	// console.log(req.query);
	if(req.query.uid && req.query.command && req.query.from && req.query.to){
		console.log("applying command")
		req.app.get('db').all('SELECT uid,position,status FROM vehicles where uid=?',[req.query.uid], function(err,rows){
			// console.log(rows);
			if(!err){
				if(rows[0].status!="BUSY"){
					if(rows[0].position==req.query.from){
						req.app.get('db').run("UPDATE vehicles SET status='BUSY', nextPos=? WHERE uid=?",[req.query.to,req.query.uid],function(err){
					          if(!err){
					            // console.log("updateMessages/"+req.query.uid+": from "+req.query.from + ' to '+req.query.to);
								
								req.app.get('sendMQTTcommand')(req.query.uid,req.query.command);
								res.status(200);
								res.end();
					          }
					          else{
					          	console.log("at simulation: /command :",err)
					          	res.status(400);
					          	res.end()
					          }
					    });
					}
				}
			}
		});
	}
});

router.get('/direction',function(req,res,next){
	// console.log(req.query);
	console.log(mapHelper.getPath('floor1',req.query.from,req.query.to));
	console.log(mapHelper.getDirections('floor1',req.query.from,req.query.to));
	res.status(200).send(mapHelper.getDirections('floor1',req.query.from,req.query.to));
	res.end();
});

router.get('/directionFar',function(req,res,next){

	console.log(req.query);
	const https = require('https');
	try{

	https.get('https://maps.googleapis.com/maps/api/directions/json?origin='+req.query.from+'&destination='+req.query.to+'&key=AIzaSyB5wD6SPA5TWtYD2L1014S_FnA09Vxw4q4', (resp) => {
		  let body = "";
		  resp.on('data', (d) => {
		    body += d;
		  });
		  resp.on('end',()=>{
		    res.end(body);
		  })

		}).on('error', (e) => {
		  console.error(e);
		});
	}
	catch(e){
		res.end(404);
	}

	// https://maps.googleapis.com/maps/api/directions/json?origin=NIE,Mysore&destination=SJCE,Mysore&key=AIzaSyB5wD6SPA5TWtYD2L1014S_FnA09Vxw4q4
	// console.log(mapHelper.getDirections('floor1',req.query.from,req.query.to));
	// res.status(200);
	// res.end(mapHelper.getDirections('floor1',req.query.from,req.query.to));
});

module.exports = router;
