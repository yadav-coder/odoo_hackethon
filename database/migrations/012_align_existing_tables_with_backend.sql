ALTER TABLE users
    ADD COLUMN IF NOT EXISTS name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS username VARCHAR(100),
    ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE users
SET
    name = COALESCE(NULLIF(name, ''), TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))),
    username = COALESCE(NULLIF(username, ''), SPLIT_PART(email, '@', 1))
WHERE name IS NULL OR username IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username);

ALTER TABLE trips
    ADD COLUMN IF NOT EXISTS title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS short_overview TEXT,
    ADD COLUMN IF NOT EXISTS banner_image TEXT,
    ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS budget NUMERIC(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_budget NUMERIC(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE trips
SET
    title = COALESCE(NULLIF(title, ''), destination),
    budget = COALESCE(budget, total_budget, 0),
    total_budget = COALESCE(total_budget, budget, 0)
WHERE title IS NULL OR budget IS NULL OR total_budget IS NULL;

ALTER TABLE itineraries
    ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date DATE,
    ADD COLUMN IF NOT EXISTS start_time VARCHAR(20) DEFAULT '',
    ADD COLUMN IF NOT EXISTS end_time VARCHAR(20) DEFAULT '',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE itineraries
SET
    title = COALESCE(NULLIF(title, ''), activity, 'Itinerary item'),
    date = COALESCE(date, scheduled_date)
WHERE title IS NULL OR date IS NULL;

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE expenses
SET
    title = COALESCE(NULLIF(title, ''), category, 'Expense'),
    date = COALESCE(date, expense_date, CURRENT_DATE),
    note = COALESCE(note, description, '')
WHERE title IS NULL OR date IS NULL OR note IS NULL;

ALTER TABLE packing_items
    ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS item_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS quantity VARCHAR(255) DEFAULT '',
    ADD COLUMN IF NOT EXISTS qty_details VARCHAR(255),
    ADD COLUMN IF NOT EXISTS packed BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_packed BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE packing_items
SET
    name = COALESCE(NULLIF(name, ''), item_name),
    item_name = COALESCE(NULLIF(item_name, ''), name),
    quantity = COALESCE(NULLIF(quantity, ''), qty_details, ''),
    qty_details = COALESCE(NULLIF(qty_details, ''), quantity, ''),
    packed = COALESCE(packed, is_packed, FALSE),
    is_packed = COALESCE(is_packed, packed, FALSE)
WHERE name IS NULL OR item_name IS NULL OR quantity IS NULL OR qty_details IS NULL;

ALTER TABLE trip_notes
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS note TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE trip_notes
SET
    content = COALESCE(NULLIF(content, ''), note, ''),
    note = COALESCE(NULLIF(note, ''), content, '')
WHERE content IS NULL OR note IS NULL;

ALTER TABLE community_posts
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS body TEXT,
    ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT '',
    ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT '',
    ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'travel',
    ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE community_posts
SET
    content = COALESCE(NULLIF(content, ''), body, ''),
    body = COALESCE(NULLIF(body, ''), content, '')
WHERE content IS NULL OR body IS NULL;

ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS tax NUMERIC(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total NUMERIC(12,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE invoices
SET
    status = COALESCE(NULLIF(status, ''), payment_status, 'pending'),
    tax = COALESCE(tax, tax_amount, 0),
    discount = COALESCE(discount, discount_amount, 0),
    total = COALESCE(total, grand_total, subtotal + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0))
WHERE status IS NULL OR tax IS NULL OR discount IS NULL OR total IS NULL;
