CREATE TABLE preplanned_trips (
    id SERIAL PRIMARY KEY,
    city_id INT REFERENCES cities(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    short_overview TEXT,
    duration_days INT,
    estimated_budget NUMERIC(12,2) DEFAULT 0,
    banner_image TEXT,
    popularity_score INT DEFAULT 0
);
