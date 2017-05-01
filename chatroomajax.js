var XMLHttp, message;
var cgiFlag = false;


// Things to do at page load
function pageInit() {
console.log("init");
if(navigator.appName == "Microsoft Internet Explorer") {
    XMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
} else {
    XMLHttp = new XMLHttpRequest();
}
}
// Function to force scrollable window at bottom
function updateScroll(){
    var element = document.getElementById("boxtext");
    element.scrollTop = element.scrollHeight;
}

function makeReadOnly() {
    document.getElementById('user').readOnly = true;
  } 
  
function getUser () {
	 message = document.getElementById('message').value;
	var user = document.getElementById('user').value;
	if (user.length < 1) {
	console.log("user < 1");
	return;
	}
	if (message.length < 1) {
	console.log("message < 1");
	return;
	}
	ajaxTimeout();
	if(cgiFlag == false) {
	console.log("cgiflag is false");
	cgiFlag = true;
	//XMLHttp.abort();
	XMLHttp.open("GET", "/cgi-bin/vances_chatroomajax.cgi?"
						+ "&user=" + user
						+ "&message=" + message 
						,true);
						console.log("xml opened");
	//XMLHttp.onreadystatechange=function() {
	console.log("readystate change");
	console.log(XMLHttp.readyState);
	//if (XMLHttp.readyState == 4) {
	//clearTimeout(XMLHttpTimeout); 
		var response = XMLHttp.responseText;
		document.getElementById('message').value = "";
		console.log("message erased");
		// add to the bottom of the chat box
		//document.getElementById('boxtext').innerHTML = response;
		// force to bottom
		//updateScroll();
		cgiFlag = false;
   // }
//}
XMLHttp.send(null);
//var XMLHttpTimeout=setTimeout(ajaxTimeout,5000);
}
console.log("get user done");
}

function validateMessage() {
     message = document.getElementById("message").value;
    if (message.indexOf('&&') > -1)
{
  console.log("Message may not contain '&&' ");
}
}

function deleteUser() {
	document.getElementById("user_response_area").value="";
}

function getChats() {
console.log(cgiFlag);
if (cgiFlag == true) return;
if (cgiFlag == false) {
cgiFlag = true;
console.log("opening getchats xml");
	XMLHttp.open("GET", "/cgi-bin/vances_chatroomajax.cgi?"
	+
	"message=" + message, true);
						 XMLHttp.onreadystatechange=function() {
						 console.log(XMLHttp.readyState);
						 if (XMLHttp.readyState==4) {
						 clearTimeout(XMLHttpTimeout); 
				var chatResponse = XMLHttp.responseText;
				console.log(chatResponse);
				if (document.getElementById('boxtext').innerHTML != chatResponse) {
				alert("posting to chatbox");
    	document.getElementById('boxtext').innerHTML = chatResponse;
    	}
    	console.log("finished readystate portion of getchats");
    	cgiFlag = false;
    } 
}
console.log("sending getchats ");
	XMLHttp.send(null);
	 var XMLHttpTimeout=setTimeout(ajaxTimeout(),10000);
}
}

var intVar;
function AutoRefresh() {
	intVar = setInterval(function(){ getChats()}, 3000);
}
 
function ajaxTimeout(){
   XMLHttp.abort();
   console.log("Request timed out");
   cgiFlag=false;
}
