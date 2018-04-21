const dirResolver={
	"N": {
		"N":"F",
		"S":"B",
		"E":"R",
		"W":"L"
	},
	"S": {
		"N":"B",
		"S":"F",
		"E":"L",
		"W":"R"
	},
	"E": {
		"N":"L",
		"S":"R",
		"E":"F",
		"W":"B"		
	},
	"W": {
		"N":"R",
		"S":"L",
		"E":"B",
		"W":"F"
	}
} 

function getPath(floor,from,to){
	var Graph = require('node-dijkstra')
	var route = new Graph(require('../maps/'+floor+'_map'))
	// console.log(route.path(from,to))
	return route.path(from,to)
}

function getDirections(floor,from,to){
	// var Graph = require('node-dijkstra')
	var p = getPath(floor,from,to)
	const plan=require('../maps/'+floor+'_plan')
	const map=require('../maps/'+floor+'_map')
	L=[]
	for (var i = 0; i < p.length-1; i++) {
		// console.log(plan[p[i]][p[i+1]])
		// console.log(map[p[i]][p[i+1]])
		L.push([
			plan[p[i]][p[i+1]],
			map[p[i]][p[i+1]]
		]);

	}
	console.log(L);
	let prev= L[0][0];
	L[0][0]='F'
	for (var i = 1; i < L.length; i++) {
		// console.log(plan[p[i]][p[i+1]])
		// console.log(map[p[i]][p[i+1]])
		let next = dirResolver[prev][L[i][0]];
		prev = L[i][0]
		L[i][0]=next;

	}
	console.log(L);
	var op='';
	for (var i = 0; i < L.length; i++) {
		if(L[i][0]=='F'){
			op+= L[i][0] +L[i][1] + ' ';
		}
		else if(L[i][0]=='L' || L[i][0]=='R'){
			op+= L[i][0] + ' ' + 'F' +L[i][1] + ' ';
		}
		else if(L[i][0]=='B'){
			op+=  'R R' + ' ';
		}
	}
	return op;
}

module.exports={
	getPath,
	getDirections
}