CREATE TABLE trip_sections (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    description TEXT,
    section_budget NUMERIC(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    sort_order INT DEFAULT 1,
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    section_id INT REFERENCES trip_sections(id) ON DELETE SET NULL,
    trip_day INT,
    title VARCHAR(255) NOT NULL,
    activity TEXT,
    location VARCHAR(255),
    scheduled_date DATE,
    start_time TIME,
    end_time TIME,
    notes TEXT,
    estimated_cost NUMERIC(10,2) DEFAULT 0
);
