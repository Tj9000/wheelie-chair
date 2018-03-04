function reqVeh(){
	var user=document.getElementById("user").value;
	var type=document.getElementById("type").value;
	var loc=document.getElementById("loc").value;
	var pos=document.getElementById("pos").value;
	var result1=document.getElementById("result1")
	var xhr = new XMLHttpRequest()
	xhr.open('GET', '/sim/requestVehi?user=' +user+'&type=' +type+'&loc=' +loc+'&pos=' +pos,true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	//Done
			if(xhr.status == 200){
				var res =xhr.responseText;	//the returned value
				console.log(JSON.parse(res));	//parse the JSON value (sent with JSON.stringify())
				//result1.innerHTML=res;
				var dj=JSON.parse(res);
				var tbl = document.getElementById("result1");
				var tblBody = document.createElement("tbody");
				var row = document.createElement("tr");
				var cell=document.createElement("td");
				user1= document.createTextNode(dj.before.uid);
				cell.appendChild(user1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				type1= document.createTextNode(dj.before.location);
				cell.appendChild(type1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				position1= document.createTextNode(dj.before.status);
				cell.appendChild(position1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				location1= document.createTextNode(dj.before.position);
				cell.appendChild(location1);
				row.appendChild(cell);
				tblBody.appendChild(row);					
				tbl.appendChild(tblBody);
				
				var tbl = document.getElementById("result2");
				var tblBody = document.createElement("tbody");
				var row = document.createElement("tr");
				var cell=document.createElement("td");
				user1= document.createTextNode(dj.after.uid);
				cell.appendChild(user1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				type1= document.createTextNode(dj.after.location);
				cell.appendChild(type1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				position1= document.createTextNode(dj.after.status);
				cell.appendChild(position1);
				row.appendChild(cell);
				tblBody.appendChild(row);
				var cell=document.createElement("td");
				location1= document.createTextNode(dj.after.position);
				cell.appendChild(location1);
				row.appendChild(cell);
				tblBody.appendChild(row);					
				tbl.appendChild(tblBody);
				}
		}
	}
}
function commandd(){
	//var uid=document.getElementById("uid").value;
	//var command=document.getElementById("command").value;
	
	var xhr = new XMLHttpRequest()
	xhr.open('GET', '/sim/getUIDs');
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	
			if(xhr.status == 200){
				var res =xhr.responseText;	
				console.log(JSON.parse(res));
				var dj=JSON.parse(res);
				var ele = document.getElementById('uid');
           
				for(var i = 0; i < dj.length; i++){
				var option = document.createElement('option');
				option.innerHTML=dj[i];
				option.value = dj[i];
				ele.appendChild(option);
				}
				return ele;
				}
			}
		}	
		
}
		
function comm2(){
				var uid=document.getElementById("uid").value;
				var command=document.getElementById("command").value;
	
				var xhre = new XMLHttpRequest()
				xhre.open('GET','/sim/command?uid='+uid+'&command=' +command,true);
				xhre.send();
				xhre.onreadystatechange=function(){
								if(xhre.readyState==4){	
										if(xhre.status == 200){
											var ress =xhre.responseText;	
											console.log(JSON.parse(ress));
				
											var dj1=JSON.parse(ress);
											var tbl = document.getElementById("resultc1");
											var tblBody = document.createElement("tbody");
											for(var i=0;i<dj1.length;i++){
													var row = document.createElement("tr");
													var cell=document.createElement("td");
													user1= document.createTextNode(dj1.before.uid );
													cell.appendChild(user1);
													row.appendChild(cell);
													
													var row = document.createElement("tr");
													var cell=document.createElement("td");
													user1= document.createTextNode(dj1.before.command);
													cell.appendChild(user1);
													row.appendChild(cell);
														}
											tblBody.appendChild(row);					
											tbl.appendChild(tblBody);
											
											var tbl = document.getElementById("resultc2");
											var tblBody = document.createElement("tbody");
											for(var i=0;i<dj1.length;i++){
													var row = document.createElement("tr");
													var cell=document.createElement("td");
													user1= document.createTextNode(dj1.after.uid );
													cell.appendChild(user1);
													row.appendChild(cell);
													
													var row = document.createElement("tr");
													var cell=document.createElement("td");
													user1= document.createTextNode(dj1.after.command);
													cell.appendChild(user1);
													row.appendChild(cell);
														}
											tblBody.appendChild(row);					
											tbl.appendChild(tblBody);
											
				
														}
												}	
											}
}	
			

