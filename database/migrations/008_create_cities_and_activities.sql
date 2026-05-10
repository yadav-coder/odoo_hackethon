CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    banner_image TEXT,
    popularity_score INT DEFAULT 0,
    UNIQUE (name, country)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    city_id INT REFERENCES cities(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    average_cost NUMERIC(10,2) DEFAULT 0,
    popularity_score INT DEFAULT 0
);
