function getAllInfo(){
	var user1=document.getElementById("user");
	var type1=document.getElementById("type");
	var loc1=document.getElementById("loc");
	var pos1=document.getElementById("pos");
	var status1=document.getElementById("status");
	var xhr = new XMLHttpRequest()
	xhr.open('GET','/sim/getAllInfo',true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	//Done
			if(xhr.status == 200){
				var res =xhr.responseText;	//the returned value
				console.log(JSON.parse(res));	//parse the JSON value (sent with JSON.stringify())
				var dataJ=JSON.parse(res);
				var tbl = document.getElementById("resTbl");
				var tblBody = document.createElement("tbody");
				for(var i=0;i<dataJ.length;i++){
		
					var row = document.createElement("tr");
					var cell=document.createElement("td");
					user1= document.createTextNode(dataJ[i].uid );
					cell.appendChild(user1);
					row.appendChild(cell);
					var cell=document.createElement("td");
					type1= document.createTextNode(dataJ[i].type);
					cell.appendChild(type1);
					row.appendChild(cell);
					var cell=document.createElement("td");
					position1= document.createTextNode(dataJ[i].position);
					cell.appendChild(position1);
					row.appendChild(cell);
					var cell=document.createElement("td");
					status1= document.createTextNode(dataJ[i].status);
					cell.appendChild(status1);
					row.appendChild(cell);
					var cell=document.createElement("td");
					location1= document.createTextNode(dataJ[i].location);
					cell.appendChild(location1);
					row.appendChild(cell);
			
					
					tblBody.appendChild(row);
					
					}
					
				tbl.appendChild(tblBody);
			}
			else{
				console.log("Some Error");
			}
		}
	}
}

window.onload=getAllInfo;




