drop table IF EXISTS BROKER;

create TABLE BROKER (
    id int identity,
    host varchar(255),
    port int,
    name varchar(255),
    primary key (id)
);

insert into BROKER (host, port, name) values (
    'localhost', 9222, 'localhost'
);