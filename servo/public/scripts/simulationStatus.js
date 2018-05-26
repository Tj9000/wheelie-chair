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
				populateTable(dataJ);
			}
			else if(xhr.status==304){
				console.log("not Modified")
			}
			else{
				console.log("Some Error");
			}
		}
	}
}
function populateTable(dataJ={}){
	var tbl = document.getElementById("resTbl");
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
}
window.onload=function(){
	populateTable()
	getAllInfo()

};




