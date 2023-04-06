// Rest based chat client
// Jim Skon 2022
// Kenyon College

var baseUrl = 'http://44.202.89.194:5005';
var state="off";
var myname="";
var email="";
var password="";
var color="";
var username="";

var inthandle;
var masterUserList =[];
var activeUserList =[];

/* Start with text input and status hidden */
document.getElementById('chatinput').style.display = 'none';
document.getElementById('status').style.display = 'none';
document.getElementById('leave').style.display = 'none';
// Action if they push the join button
document.getElementById('login-btn').addEventListener("click", (e) => {
	join();
})
// Action if they push the register button
document.getElementById('register-btn').addEventListener("click", (e) => {
    register();
})
/* Set up buttons */
document.getElementById('leave-btn').addEventListener("click", leaveSession);
document.getElementById('send-btn').addEventListener("click", sendText);
document.getElementById('color-toggle').addEventListener("click", toggleMode);

// Watch for enter on message box
document.getElementById('message').addEventListener("keydown", (e)=> {
    if (e.code == "Enter") {
	e.preventDefault();
    sendText();
    clearTextbox();
    return false;
    }   
});

// function for toggling the css on the page between light and dark mode.
function toggleMode() {
	document.getElementById('chatBox').classList.toggle('dark-mode-chatbox');
}

// Call function on page exit
window.onbeforeunload = leaveSession;

// Registers a new user by sending their information to the server
function register() {
    username = document.getElementById('register-name').value;
    email = document.getElementById('register-email').value;
    password = document.getElementById('register-pass').value;
    var temp = document.getElementById("userColor").value;
	color = temp.slice(1);
    if (password.length < 6) {
	alert("Password too short, try again.");    
    }
    fetch(baseUrl+'/chat/register/'+username+'/'+email+'/'+password+'/'+color, {
        method: 'get'
    })
    .then (response => response.json() )
    .then (data =>completeRegister(data))
    .catch(error => {
        {alert("Error: Something went wrong:"+error);}
    })
}

// Handle the registration response from the server. Only registers if there exists no overlapping username/email.
function completeRegister(results) {
	var status = results['status'];
	if (status != "success") {
		alert("Username or email already exists!");
		leaveSession();
		return;
	}
	var user = results['user'];
	console.log("Register:"+user);
}

// Handle the response after attempting to join the chat
function completeJoin(results) {
	var status = results['status'];
	if (status != "success") {
		alert("User already exists");
		leaveSession();
		return;
	}
	var user = results['user'];
	console.log("Join:"+user);
	startSession(user);
}

// Joins the chat by sending the username and password to the server
function join() {
	myname = document.getElementById('yourname').value;
	mypassword = document.getElementById('yourpass').value;
	fetch(baseUrl+'/chat/join/'+myname+'/'+mypassword, {
        method: 'get'
    })
    .then (response => response.json() )
    .then (data =>completeJoin(data))
    .catch(error => {
        {alert("Error: Something went wrong:"+error);}
    })
}

function completeSend(results) {
	var status = results['status'];
	if (status == "success") {
		console.log("Send succeeded")
	} else {
		alert("Error sending message!");
	}
}

//function called on submit or enter on text input
function sendText() {
    var message = document.getElementById('message').value;
    console.log("Send: "+myname+":"+message);
	fetch(baseUrl+'/chat/send/'+myname+'/'+message, {
        method: 'get'
    })

    .then (response => response.json() )
    .then (data =>completeSend(data))
    .catch(error => {
        {alert("Error: Something went wrong:"+error);}
    })
    clearTextbox();    
}

// Clears up the textbox once the message is sent
function clearTextbox() {
    document.getElementById('message').value = "";
}

// Process the messages and user list
function completeFetch(result) {
	names = result["userlist"];
	names.forEach(function (m,i) {
		name = m["name"] + ", ";
		if  (masterUserList.includes(name) == false) {
		masterUserList.push(name);
		}
    });
	activeUserList=[];
	activeusers = result["activelist"];
	activeusers.forEach(function (m,i) {
		user = m["name"] + ", ";
		activeUserList.push(user);
		
	});
    messages = result["messages"];
	messages.forEach(function (m,i) {
		name = m['user'];
		message = m['message'];
		color = m['color'];
		document.getElementById('chatBox').innerHTML +=
	    	"<font color="+color+">" + name + ": </font>" + message + "<br />";
	});
	updateChatMembers();
}

/* Check for new messaged */
function fetchMessage() {
	fetch(baseUrl+'/chat/fetch/'+myname, {
        method: 'get'
    })
    .then (response => response.json() )
    .then (data =>completeFetch(data))
    .catch(error => {
        {console.log("Server appears down");}
    })  	
}

// Update the list of chat members
function updateChatMembers() {
	document.getElementById('members').innerHTML = ""
    masterUserList.forEach(function (element,i) {
        var user = element;
        if (activeUserList.includes(user)) {
            document.getElementById('members').innerHTML +=
            "<font color='green'>" + user + " " +"</font> ";
        }
        else {
            document.getElementById('members').innerHTML +=
            "<font color='#ff0000'>" + user + " " + "</font>";
        } 
    });
}
/* Functions to set up visibility of sections of the display */
function startSession(name){
    state="on";
    
    document.getElementById('yourname').value = "";
    document.getElementById('register').style.display = 'none';
    document.getElementById('user').innerHTML = "User: " + name;
    document.getElementById('chatinput').style.display = 'block';
    document.getElementById('members').style.display = 'block';
    document.getElementById('status').style.display = 'block';
    document.getElementById('leave').style.display = 'block';
    /* Check for messages every 500 ms */
    inthandle=setInterval(fetchMessage,500);
}

function completeLogout(result){
   // something to remove the user from the ActiveUsers list/array but not just client side
var status = result['status'];
	if (status == "success") {
		console.log("Logout successful")
	} else {
		alert("Error logging out!");
	}
}

// Logs out the current user from the chat
function logout(){
    fetch(baseUrl+'/chat/logout/'+myname, {
        method: 'get'
    })
    .then (response => response.json() )
    .then (data => completeLogout(data))
    .catch(error => {
        {console.log("Server appears down");}
    })
}

// Handle leaving the chat session and the features following, such as hiding elements and stopping sending messages
function leaveSession(){
	logout();
	state="off";
    document.getElementById('yourname').value = "";
    document.getElementById('register').style.display = 'block';
    document.getElementById('user').innerHTML = "";
    document.getElementById('chatinput').style.display = 'none';
    document.getElementById('members').style.display = 'none';
    document.getElementById('status').style.display = 'none';
    document.getElementById('leave').style.display = 'none';
	clearInterval(inthandle);
}
