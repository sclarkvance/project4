#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include "fifo.h"
#include <string>
#include <vector>
#include <stddef.h>

using namespace std;

/* Fifo names */
string receive_fifo = "CRrequest";
string send_fifo = "CRreply";

int main() {
	vector<string> chatVector;
	string user, message, fullChat;
	
    // create the FIFOs for communication
	Fifo recfifo(receive_fifo);
	Fifo sendfifo(send_fifo);

	while(1) {
	recfifo.openread();
		cout << "Open read" << endl;
		fullChat = "";
		cout << "Getting fifo" << endl;

		/* Get a message from a client */
	
    
		fullChat = recfifo.recv();

		cout << "Received: " << fullChat << endl;
		sendfifo.openwrite();
		if (fullChat.length() > 4) {

    
		chatVector.push_back(fullChat);
		
    }
		for(int i=0; i < chatVector.size(); i++) {
		cout << "chat vector size = " << chatVector.size() << endl;
		cout << "i = " << i << endl;
			sendfifo.send(chatVector[i]);
			cout << "Sending message " << i << endl;
			cout << chatVector[i] << endl;
		
		}   

sendfifo.send("<!--$END-->");
		cout << "send end message" << endl;
		sendfifo.fifoclose();
		recfifo.fifoclose();
}
    }
