function getAllInfo(){
	var xhr = new XMLHttpRequest()
	xhr.open('GET','/sim/getAllInfo',true);
	xhr.send();
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){	//Done
			if(xhr.status == 200){
				var res =xhr.responseText;	//the returned value
				console.log(JSON.parse(res));	//parse the JSON value (sent with JSON.stringify())
			}
			else{
				console.log("Some Error");
			}
		}
	}
}

window.onload=getAllInfo;