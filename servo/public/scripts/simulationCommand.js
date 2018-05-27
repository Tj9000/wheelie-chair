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
			if(xhr.status == 200 || xhr.status == 304){
				var res =xhr.responseText;	//the returned value
				console.log(JSON.parse(res));	//parse the JSON value (sent with JSON.stringify())
				var dataJson=JSON.parse(res);
				populateTable("result1",dataJson);

				var ele = document.getElementById('uid');
				ele.innerHTML='';
				var option = document.createElement('option');
				option.innerHTML='-- Select --';
				option.value = '';
				ele.appendChild(option);
				for(var i = 0; i < dataJson.length; i++){
					if(dataJson[i].status!='BUSY'){
						var option = document.createElement('option');
						option.innerHTML=dataJson[i].uid;
						option.value = dataJson[i].uid;
						ele.appendChild(option);
					}
				}
				document.getElementById('from').value=pos;
			}
		}
	}
}
function getUIDs(){
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
				ele.innerHTML='';
				var option = document.createElement('option');
				option.innerHTML='-- Select --';
				option.value = '';
				ele.appendChild(option);
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
		
function commandVehi(){
	var uid=document.getElementById("uid").value;
	var command=document.getElementById("command").value;
	var from=document.getElementById("from").value;
	var to=document.getElementById("to").value;

	var xhr = new XMLHttpRequest()
	xhr.open('GET','/sim/command?uid='+uid+'&command=' +command+'&from='+from+'&to='+to,true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	
			if(xhr.status == 200){
				// var ress =xhr.responseText;	

			}
		}	
	}
}	
			

function getDir(){
	var from=document.getElementById("from").value;
	var to=document.getElementById("to").value;
	
	var xhr = new XMLHttpRequest()
	xhr.open('GET', '/sim/direction?from='+from+'&to='+to);
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	
			if(xhr.status == 200){
				// var res =xhr.responseText;	
				console.log(xhr.responseText)
				document.getElementById('command').value=xhr.responseText;			
			}
			else{
				document.getElementById('command').value='undefined';			

			}
		}	
		
	}
}


function populateTable(tableID,dataJ={}){
	var loc=document.getElementById("loc").value;
	var pos=document.getElementById("pos").value;
	var tbl = document.getElementById(tableID);
	tbl.innerHTML='';
	var tblBody = document.createElement("tbody");
		
		var row = document.createElement("tr");
		uid_ele=		document.createTextNode("UID")
		VehiType_ele=	document.createTextNode("VehiType")
		location_ele=	document.createTextNode("position")
		status_ele=		document.createTextNode("status")
		floor_ele=		document.createTextNode("location")
		let uid_cell		=document.createElement("th")
		let VehiType_cell	=document.createElement("th")
		let location_cell	=document.createElement("th")
		let status_cell		=document.createElement("th")
		let floor_cell		=document.createElement("th")
		uid_cell.appendChild(uid_ele);
		VehiType_cell.appendChild(VehiType_ele);
		location_cell.appendChild(location_ele);
		status_cell.appendChild(status_ele);
		floor_cell.appendChild(floor_ele);
		row.appendChild(uid_cell);
		row.appendChild(VehiType_cell);
		row.appendChild(location_cell);
		row.appendChild(status_cell);
		row.appendChild(floor_cell);
		tblBody.appendChild(row);

	if(dataJ.length==0){
		var row = document.createElement("tr");
		let err_cell=document.createElement("td")
		err_cell.appendChild(document.createTextNode("No Connected devices"));
		let cs = document.createAttribute("colspan");
		cs.value=5
		err_cell.attributes.setNamedItem(cs);
		row.appendChild(err_cell);
		tblBody.appendChild(row);
		tbl.appendChild(tblBody);

	}
	else{
		for(var i=0;i<dataJ.length;i++){

			var row = document.createElement("tr");
			
			var cell=document.createElement("td");
			var btn,btn_click;
			user1= document.createTextNode(dataJ[i].uid );
			cell.appendChild(user1);
			row.appendChild(cell);
			
			cell=document.createElement("td");
			type1= document.createTextNode(dataJ[i].type);
			cell.appendChild(type1);
			row.appendChild(cell);
			
			cell=document.createElement("td");
			position1= document.createTextNode(dataJ[i].position);
			cell.appendChild(position1);
			row.appendChild(cell);
			
			cell=document.createElement("td");
			status1= document.createTextNode(dataJ[i].status);
			cell.appendChild(status1);
			row.appendChild(cell);
			
			cell=document.createElement("td");
			location1= document.createTextNode(dataJ[i].location);
			cell.appendChild(location1);
			row.appendChild(cell);

			cell=document.createElement("td");
			btn= document.createElement("BUTTON")
			btn.appendChild(document.createTextNode("Select"));
			btn_click=document.createAttribute("onClick");
			btn_click.value="setUid("+dataJ[i].uid+")";
			btn.attributes.setNamedItem(btn_click);
			cell.appendChild(btn);
			row.appendChild(cell);

			cell=document.createElement("td");
			btn= document.createElement("BUTTON")
			btn.appendChild(document.createTextNode("Request"));
			btn_click=document.createAttribute("onClick");
			btn_click.value="sendToLocation('"+dataJ[i].uid+"','"+dataJ[i].position+"','"+pos+"','"+loc+"')";
			btn.attributes.setNamedItem(btn_click);
			cell.appendChild(btn);
			row.appendChild(cell);
	
			
			tblBody.appendChild(row);
			
			}
			
		tbl.appendChild(tblBody);
	}
}

function setUid(uid){
	document.getElementById('uid').value=uid;
}

function sendToLocation(uid,src,dest,location){

	if(src=='X'){
		var xhr1 = new XMLHttpRequest()
		xhr1.open('GET','/sim/bringToLocation?uid='+uid+'&from='+src+'&to='+dest+'&loc='+location,true);
		xhr1.send();
		xhr1.onreadystatechange=function(){
			if(xhr1.readyState==4){	
				if(xhr1.status == 200){
					
				}
			}
		}
	}
	else{
		var xhrSTL = new XMLHttpRequest();
		xhrSTL.open('GET', '/sim/direction?from='+src+'&to='+dest);
		xhrSTL.send();
		xhrSTL.onreadystatechange=function(){
			if(xhrSTL.readyState==4){	
				if(xhrSTL.status == 200){
					// var res =xhr.responseText;	
					var command = xhrSTL.responseText;
					console.log(command)
					document.getElementById('requestResult').value="Command: "+command;			


					var xhr2 = new XMLHttpRequest()
					xhr2.open('GET','/sim/command?uid='+uid+'&command=' +command+'&from='+src+'&to='+dest,true);
					xhr2.send();
					xhr2.onreadystatechange=function(){
						if(xhr2.readyState==4){	
							if(xhr2.status == 200){
								console.log("Sent the command");
								document.getElementById('requestResult').value+="\nSentCommand";			

							}
						}
					}
				}
				else{
					document.getElementById('requestResult').value='command: '+'undefined';			

				}
			}		
		}		
	}

	alert("sent")
}