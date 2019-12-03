const users = `create table if not exists users(
     name VARCHAR(100) NOT NULL,
     nickname VARCHAR(100),
     word TEXT(0),
     pass VARCHAR(100) NOT NULL,
     avator VARCHAR(100) DEFAULT 'default.jpeg',
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( name )
    )character set = utf8;`;

const posts = `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     avator VARCHAR(100),
     PRIMARY KEY ( id )
    )character set = utf8;`;

const comment = `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     nickname VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     moment VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    )character set = utf8;`;

module.exports = {
  users,
  posts,
  comment
};
