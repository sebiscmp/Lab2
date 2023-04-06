#ifndef user_h
#define user_h
#include <iostream>
#include <fstream> 
#include <map>
#include <algorithm>

using namespace std; 


// Defines the "user" class
class user {
public: 
  // default constructor
  user(); 
  // called when an object of the "user" is created with the specific arguments (username, email, password, color, active)
  user(string username, string email, string password, string color, bool active); 
  // each of the followings returns the email, password, active status, and the color of the user, respectively.
  string getEmail(); 
  string getPassword();
  void setActive(bool status);
  bool getActive();
  string getColor();

  
private: 
  // creates variables that stores the username, email, password, color, and active status of the user, respectively.
  string username;
  string email; 
  string password; 
  string color; 
  bool active; 
  
};

#endif 
