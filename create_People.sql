CREATE TABLE People (
	id SERIAL PRIMARY KEY, -- Unique ID
	fname VARCHAR(50), -- First name
	lname VARCHAR(50), -- Last name
	mname VARCHAR(50), -- Middle name
	wemail VARCHAR(100), -- Work Email
	pemail VARCHAR(100), -- Personal Email
	wphone VARCHAR(100), -- Work phone number
	pphone VARCHAR(100), -- Personal phone number
	address VARCHAR(100)
);