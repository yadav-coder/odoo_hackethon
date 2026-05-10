CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255),
    start_date DATE,
    end_date DATE,
    budget NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    trip_day INT,
    activity TEXT,
    location VARCHAR(255),
    notes TEXT
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(100),
    amount NUMERIC(10,2),
    description TEXT,
    expense_date DATE
);