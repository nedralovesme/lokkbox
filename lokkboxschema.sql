drop table if exists "users";
create table "users"(
    "id" serial primary key,
    "f_name" text not null,
    "l_name" text not null,
    "username" text not null,
    "email" text not null,
    "password" text not null,
    "birthday" date not null,
    "c_date" date default current_date
);

drop table if exists "file";
create table "file"(
    "id" serial primary key,
    "name" text null,
    "path" text not null,
    "type_id" text not null,
    "c_date" date default current_date,
    "user_id" text not null,
    "album" text null
);

drop table if exists "comment";
create table "comment"(
    "id" serial primary key,
    "comment" text null,
    "c_date" date not null,
    "userId", integer not null,
    "date" date not null
);

drop table if exists "collection";
create table "collection"(
    "id" serial primary key,
    "c_date" date not null,
    "userId" integer not null,
    "name" text not null
);

/* this will store what users have access to a collection */
drop table if exists "collection_user";
create table "collection_user"(
    "id" serial primary key,
    "collectionId" date not null,
    "userId" integer not null,
    "typeId" text not null
);

drop table if exists "user_friends";
create table "user_friends"(
    "user_id" integer not null,
    "friend_id" integer not null,
    "friend_name" text not null
);
