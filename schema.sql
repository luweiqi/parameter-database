create table pd_metaitems (
	id int NOT NULL AUTO_INCREMENT,
    name varchar(100),
    question varchar(200),
    type varchar(50),
    options varchar(500),
    PRIMARY KEY (`id`)
);

insert pd_metaitems (name) values ("Version"),("Timestamp"),("Hardware Variant"),("Userid");
insert pd_metaitems (name,question,type,options) values ("Motor Type","Which motor are you using?","text",null),
("Inverter Type","Which Inverter are you using?","select", "Hardware v1,Hardware v2,Hardware v3,Blue-Pill,Nissan Leaf Gen1,Nissan Leaf Gen2, Nissan Leaf Gen3,Tesla SDU,Tesla LDU,Toyota Prius Gen2,Ford Ranger,Mitsubishi,BMW,DIY Custom"),
("Battery Voltage", "What is your nominal battery voltage?","numeric",null),
("Vehicle Weight", "What is the weight of your vehicle in kg?","numeric",null),
("Driven Wheels", "What are the driven wheels?","select","FWD,RWD,AWD"),
("Tuning Goal", "What is your tuning goal?","checkbox","Street,Track,Smooth,Aggressive"),
("Throttle Pot","Which throttle pedal are you using?","text",null);

create table pd_metadata (
    setid int NOT NULL,
    metaitem int not null,
    value varchar(200),
    primary key(setid, metaitem),
    foreign key (metaitem) references pd_metaitems(id)
);

create table pd_parameters (
    id int NOT NULL AUTO_INCREMENT,
    fwindex int,
    catindex int,
    category varchar(50) not null,
    name varchar(50) UNIQUE,
    unit varchar(500),
    PRIMARY KEY (`id`)
);

create table pd_datasets (
    id int NOT NULL AUTO_INCREMENT,
    metadata int not null,
    notes varchar(2000),
    primary key(id),
    foreign key (metadata) references pd_metadata(setid)
);

create table pd_data (
    setid int NOT NULL,
    parameter int not null,
    value decimal(10,2),
    primary key(setid, parameter),
    foreign key (parameter) references pd_parameters(id),
    foreign key (setid) references pd_datasets(id)
);

create view pd_datasetdescriptions AS
select id,GROUP_CONCAT(m.value) description from pd_datasets d, pd_metadata m where d.metadata=m.setid and m.metaitem IN (2, 5, 6) group by d.id;

create or replace view pd_namedata AS
select setid, category, name, unit, value FROM pd_parameters p, pd_data d WHERE p.id=d.parameter ORDER BY catindex, fwindex;

create or replace view pd_namedmetadata as
select d.id,i.name,i.question,m.value from pd_metadata m,pd_datasets d,pd_metaitems i WHERE m.setid=d.metadata AND i.id=m.metaitem;

update pd_metaitems set type='numeric', options='' where id in (7,8);

#Some test queries
select * from pd_namedmetadata;
select * from pd_parameters;
select * from pd_metaitems;

delete from pd_data where setid=6;
delete from pd_datasets where id=6;
truncate pd_data;
delete from pd_datasets where id > 0;
delete from pd_parameters where id > 0;
delete from pd_metadata WHERE setid > 0;
