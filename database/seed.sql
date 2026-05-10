INSERT INTO users (
    first_name,
    last_name,
    username,
    email,
    password,
    phone,
    city,
    country
)
VALUES (
    'James',
    'Traveler',
    'james',
    'james@example.com',
    'hashedpassword',
    '+91-9000000000',
    'Mumbai',
    'India'
);

INSERT INTO trips (
    user_id,
    title,
    destination,
    short_overview,
    start_date,
    end_date,
    total_budget,
    status
)
VALUES (
    1,
    'Trip to Europe Adventure',
    'Paris & Rome',
    'May 25 - Jan 05, 2025 - 4 cities',
    '2025-05-25',
    '2026-01-05',
    20000,
    'ongoing'
);

INSERT INTO trip_travelers (
    trip_id,
    full_name
)
VALUES
    (1, 'James'),
    (1, 'Arjun'),
    (1, 'Jerry'),
    (1, 'Cristina');

INSERT INTO trip_sections (
    trip_id,
    title,
    city,
    country,
    description,
    section_budget,
    start_date,
    end_date,
    sort_order
)
VALUES
    (1, 'Section 1: Paris', 'Paris', 'France', 'Flight bookings and popular activities.', 12000, '2025-05-25', '2025-05-28', 1),
    (1, 'Section 2: Rome', 'Rome', 'Italy', 'Hotel check-in details and local visits.', 9000, '2025-05-29', '2025-06-01', 2);

INSERT INTO itineraries (
    trip_id,
    section_id,
    trip_day,
    title,
    activity,
    location,
    scheduled_date,
    notes,
    estimated_cost
)
VALUES
    (1, 1, 1, 'Flight bookings', 'flight bookings (DEL -> PAR)', 'Delhi to Paris', '2025-05-25', 'Keep printed flight tickets and passport handy.', 12000),
    (1, 2, 3, 'Hotel check-in details', 'hotel booking paris', 'Rome stop', '2025-05-29', 'Check in after 2pm, room 302, breakfast included (7-10am).', 3000);

INSERT INTO expenses (
    trip_id,
    user_id,
    title,
    category,
    amount,
    description,
    expense_date,
    payment_status
)
VALUES
    (1, 1, 'Hotel booking confirmation', 'hotel', 21000, 'Hotel booking Paris and Rome.', '2025-05-20', 'pending'),
    (1, 1, 'Paragliding', 'Physical Activity', 1050, 'Adventure activity booking.', '2025-05-27', 'paid');

INSERT INTO packing_items (
    trip_id,
    category,
    item_name,
    qty_details,
    is_packed,
    sort_order
)
VALUES
    (1, 'Documents', 'Passport', 'Original passport', TRUE, 1),
    (1, 'Documents', 'Travel insurance', 'Printed copy', TRUE, 2),
    (1, 'Electronics', 'Universal power adapter', '1 adapter', FALSE, 3),
    (1, 'Electronics', 'Phone charger', '1 charger', FALSE, 4),
    (1, 'Clothing', 'Light jacket / windbreaker', '1 jacket', FALSE, 5);

INSERT INTO trip_notes (
    trip_id,
    user_id,
    title,
    note,
    note_date
)
VALUES (
    1,
    1,
    'Hotel check-in details - Rome stop',
    'Check in after 2pm, room 302, breakfast included (7-10am).',
    '2025-05-29'
);

INSERT INTO cities (name, country, popularity_score)
VALUES
    ('Paris', 'France', 95),
    ('Rome', 'Italy', 90),
    ('Goa', 'India', 85);

INSERT INTO activities (
    city_id,
    name,
    category,
    description,
    average_cost,
    popularity_score
)
VALUES
    (1, 'Top Regional Selections', 'travel', 'Suggested places to visit and activities to perform.', 50, 80),
    (3, 'Paragliding', 'Physical Activity', 'Popular adventure activity.', 1050, 88);

INSERT INTO preplanned_trips (
    city_id,
    title,
    short_overview,
    duration_days,
    estimated_budget,
    popularity_score
)
VALUES
    (1, 'Paris & Rome Adventure', 'Preplanned trip across popular European stops.', 4, 20000, 92),
    (3, 'Goa Activity Weekend', 'Beach and adventure activity trip.', 3, 12000, 86);

INSERT INTO community_posts (
    user_id,
    trip_id,
    activity_id,
    title,
    body
)
VALUES (
    1,
    1,
    2,
    'Paragliding experience',
    'Community post for sharing trip or activity experience.'
);

INSERT INTO invoices (
    invoice_number,
    trip_id,
    user_id,
    generated_date,
    payment_status,
    subtotal,
    tax_amount,
    discount_amount,
    grand_total
)
VALUES (
    'INV-xyz-30290',
    1,
    1,
    '2025-05-20',
    'pending',
    22000,
    1100,
    0,
    23100
);

INSERT INTO invoice_items (
    invoice_id,
    description,
    category,
    quantity,
    unit_cost,
    amount
)
VALUES
    (1, 'Hotel booking Paris', 'hotel', 1, 21000, 21000),
    (1, 'Paragliding', 'Physical Activity', 1, 1050, 1050);
