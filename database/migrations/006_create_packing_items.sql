CREATE TABLE packing_items (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    qty_details VARCHAR(255),
    is_packed BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT DEFAULT 1
);
