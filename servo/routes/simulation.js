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
	// req.app.get('db').all('SELECT uid,location,status,position FROM vehicles where type=? and (location=? or location="BAY") ORDER BY location DESC, position ASC',[vehiType,loc], function(err,rows){
	console.log(dbStmt,inserts)
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
		        return ((distA < distB) ? -1 : ((distA > distB) ? 1 : 0));
		    });
			var sendText=JSON.stringify(rows);
			res.status(200).send(sendText);
	}
		var vid=null;
		// for (var i = 0; i < rows.length; i++) {
		// 	if(rows[i].location == 'BAY'){
		// 		if(!vid)
		// 			vid=i;
		// 		break;
		// 	}
		// 	else if(rows[i].location == loc && rows[i].position == pos && rows[i].status == 'AVAIL'){
		// 		vid=i;
		// 		break;
		// 	}
		// 	else if(rows[i].location == loc && rows[i].position < pos && rows[i].status == 'AVAIL'){
		// 		vid=i;
		// 		if(rows[i+1].location == 'BAY')
		// 			break;
		// 		if(rows[i+1].location == loc && rows[i+1].position > pos && rows[i].status == 'AVAIL'){
		// 			if(pos.charCodeAt(0)-rows[i].position.charCodeAt(0)>rows[i+1].position.charCodeAt(0)-pos.charCodeAt(0)){
		// 				vid=i+1;
		// 			}
		// 			break;
		// 		}
				
		// 	}
		// 	else if(rows[i].location == loc && rows[i].position > pos && rows[i].status == 'AVAIL'){
		// 		vid=i;
		// 		break;	
		// 	}
		// }

		// var sendText=JSON.stringify(rows)+"<br><br>"+JSON.stringify(rows[vid]);
		// res.status(200).send(sendText);
		
		// req.app.get('db').run('UPDATE vehicles SET location = ?, position = ?, status = "BUSY" where uid = ?',[loc,pos,rows[vid].uid],function(err){
		// 	if(err){
		// 		console.log(err);
		// 		res.status(400);
		// 		res.end();
		// 	}

		// }).get('SELECT uid,location,status,position FROM vehicles where uid=?',[rows[vid].uid], function(err,row){
		// 		console.log(vid);
		// 		if(err){
		// 			console.log(err);
		// 			res.status(400);
		// 			res.end();
		// 		}
		// 		else{
		// 			var sendText=JSON.stringify({'before':rows[vid],'after':row});
		// 			res.status(200).send(sendText);
		// 		}
		// 	});
	});
});


router.get('/command', function(req, res, next) {
	console.log(req.query.uid);
	console.log(req.query.command);
	req.app.get('sendMQTTcommand')(req.query.uid,req.query.command);
	res.status(200);
	res.end();
});

router.get('/direction',function(req,res,next){
	console.log(req.query);
	console.log(mapHelper.getPath('floor1',req.query.from,req.query.to));
	console.log(mapHelper.getDirections('floor1',req.query.from,req.query.to));
	res.status(200);
	res.end(mapHelper.getDirections('floor1',req.query.from,req.query.to));
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
