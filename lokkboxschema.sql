drop table if exists "users";
create table "users"(
    "id" serial primary key,
    "f_name" text not null,
    "l_name" text not null,
    "username" text not null,
    "email" text not null,
    "password" text not null,
    "birthday" date not null,
    "c_date" date not null
);

drop table if exists "files";
create table "files"(
    "id" serial primary key,
    "name" text null,
    "path" text not null,
    "typeId" text not null,
    "u_date" date not null,
    "album" text null
);

drop table if exists "comments";
create table "comments"(
    "id" serial primary key,
    "comment" text null,
    "userId", integer not null,
    "date" date not null
);

drop table if exists "collections";
create table "collections"(
    "id" serial primary key,
    "userId" integer not null,
    "name" text not null
);
