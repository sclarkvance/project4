#include <iostream>
// Stuff for AJAX
#include "cgicc/Cgicc.h"
#include "cgicc/HTTPHTMLHeader.h"
#include "cgicc/HTMLClasses.h"

//Stuff for pipes
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <iostream>
#include <fstream>
#include "fifo.h"
#include <string>

using namespace std;
using namespace cgicc; // Needed for AJAX functions.

string parseMessage(string);

ofstream logFile;
// fifo for communication
string receive_fifo = "CRreply";
string send_fifo = "CRrequest";

int main() {
	string finalmessage, results;
  Cgicc cgi;    // Ajax object
  char *cstr;
  // Create AJAX objects to recieve information from web page.
  form_iterator username = cgi.getElement("user");
  form_iterator messagetext = cgi.getElement("message");

  // create the FIFOs for communication
  Fifo recfifo(receive_fifo);
  Fifo sendfifo(send_fifo);
cout << "Content-Type: text/plain\n\n";
  

  // Call server to get results
  string user = **username;
string message = **messagetext;
sendfifo.openwrite();
if (message.length() > 1) {
  string ajaxmessage =  "&&"+user+"~~"+message;
  sendfifo.send(ajaxmessage);
    }
else {
sendfifo.send(" ");
}
  /* Get a message from a server */
  recfifo.openread();


  
  results = " ";



while (results.find("<!--$END-->") == string::npos) { 
if(results.length()>4) {
logFile.open("/tmp/vances.log", ios::out | ios::app);
logFile << "results: " << results << endl;
logFile.close();
finalmessage = parseMessage(results);
logFile.open("/tmp/vances.log", ios::out | ios::app);
logFile << "final message: " << finalmessage << endl;
logFile.close();
cout<< "<p>" << finalmessage << "</p>" << endl;
}
results = recfifo.recv();
  }


recfifo.fifoclose();
sendfifo.fifoclose();

return 0;
}


string parseMessage(string message) {
string original = message;
if (message.length()<5) {
logFile.open("/tmp/vances.log", ios::out | ios::app);
logFile << "message:" << message << " too small, quitting parse" << endl;
logFile.close();
message = "";
 return message;
}
	string user;
const string userDelineator = "&&";
 const string messageDelineator = "~~";
   size_t userPos = message.find_first_of(userDelineator);
 size_t messagePos = message.find_first_of(messageDelineator); 
   if (userPos != string::npos) {
     //message[userPos] = ""; 
     user = message.substr(2, messagePos-2);
     //userPos = message.find_first_of(userDelineator, userPos+1); 
     }
      if (messagePos != string::npos) {
     message = message.substr(messagePos+2,userPos-2);
     //message[messagePos] = ""; 
     messagePos = message.find_first_of(messageDelineator, messagePos+1); 
     }
	 if(message.find("<!--$END-->") == string::npos) {
      message = user + ": " + message;	
logFile.open("/tmp/vances.log", ios::out | ios::app);
logFile << "Parsed message" << message << endl;
logFile.close();
	  return message;
	 }
	 else {
logFile.open("/tmp/vances.log", ios::out | ios::app);
logFile << "received end message: " << original << endl;
logFile.close();
		 return original;
	 }
}

