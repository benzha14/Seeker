# 2803_project: Seeker
This project looks up deals for PC games. 
The user can choose to save the deal on their profile page.
api(s) used:
  cheapShark, 
  short.io

navigate to mysql terminal (mac): /usr/local/mysql/bin/mysql -u root -p

The table is created in mysql terminal as follows:
create database CS2803;
use CS2803;
create table registeredUsers(
  username varchar(60) primary key,
  password varchar(60),
  securityQuestion1 varchar(60) not null,
  securityQuestion2 varchar(60) not null
)

create table saved_deals (
  id int not null auto_increment,
  username varchar(60) not null,
  deal_id varchar(60) not null,
  price varchar(60) not null,
  retail_price varchar(60) not null,
  game_name varchar(60) not null,
  deal_link varchar(255) not null,
  banner_link varchar(255) not null,
  primary key (id)
) 

Made by Benson Zhang & Brandon Schmitz


