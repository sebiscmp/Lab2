
#include <iostream>
#include <fstream> 
#include <map>
#include <algorithm>
#include "user.h" 

using namespace std; 

// default constructor for the "user" class. 
user::user(){
  // Initializes the member variables to empty strings
  username = "";
  email = "";
  password = "";
  color = "";
  active; 
  
}

// initializes the member variables (username, email, password, color) with the corresponding argument values,
// and "active" as "true".
user::user(string username, string email, string password, string color, bool active){
  this->username = username; 
  this->email = email;
  this->password = password;
  this->color = color; 
  this->active = true;
}

// The followings return the email, password, active status, and color of the user, respectively.
string user::getEmail(){
  return email;
}

string user::getPassword(){
  return password;
}

void user::setActive(bool status){
  active = status;
}

bool user::getActive(){
  return active;
}

string user::getColor() {
	return color;
}

