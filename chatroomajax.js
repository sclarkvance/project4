var XMLHttp, message, user;
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
    var element = document.getElementById("Messagebox");
    element.scrollTop = element.scrollHeight;
}

function makeReadOnly() {
    document.getElementById('user').readOnly = true;
  } 
  
function getUser () {
	if(cgiFlag == false) {
	 message = document.getElementById('message').value;
	 user = document.getElementById('user').value;
	if (user.length < 1) {
	console.log("user < 1");
	return;
	}
	if (message.length < 1) {
	console.log("message < 1");
	return;
	}
	//ajaxTimeout();

	cgiFlag = true;
	//XMLHttp.abort();
	XMLHttp.open("GET", "/cgi-bin/vances_chatroomajax.cgi?"
+ "&user=" + user
						+ "&message=" + message 
						,true);
	XMLHttp.onreadystatechange=function() {
	if (XMLHttp.readyState == 4) {
	//clearTimeout(XMLHttpTimeout); 
		var response = XMLHttp.responseText;
		// add to the bottom of the chat box

		document.getElementById('Messagebox').innerHTML = response;
		// force to bottom
		updateScroll();
		cgiFlag = false;
   }
}
document.getElementById('message').value =null;
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
//ajaxTimeout();
	if(cgiFlag == false) {
	console.log("cgiflag is false");
	cgiFlag = true;
	//XMLHttp.abort();
var user = document.getElementById('user').value;
if(user.length < 1) return;
	XMLHttp.open("GET", "/cgi-bin/vances_chatroomajax.cgi?"
				+ "&user=" + user
				+ "&message=" + " "
				,true);

	XMLHttp.onreadystatechange=function() {
	if (XMLHttp.readyState == 4) {
	//clearTimeout(XMLHttpTimeout); 
		var response = XMLHttp.responseText;
		document.getElementById('Messagebox').innerHTML = response;

		// force to bottom
		updateScroll();
		cgiFlag = false;
   }
}
XMLHttp.send(null);
//var XMLHttpTimeout=setTimeout(ajaxTimeout,5000);
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
