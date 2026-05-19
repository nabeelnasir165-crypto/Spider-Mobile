-- Insert Default Admin Staff
INSERT INTO staff (id, email, full_name, role) VALUES
('e6cbede4-d0a7-46b1-975b-7f0d0f32dcac', 'nabeelnasir165@gmail.com', 'Nabeel Nasir', 'Admin')
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Customers
INSERT INTO customers (full_name, email, phone, address, is_business_account) VALUES
('Sarah Jenkins', 'sarah.j@example.com', '+44 7700 900077', '12 High St, London', false),
('David Chen', 'david.c@example.com', '+44 7700 900088', '45 Baker St, London', true),
('Emma Watson', 'emma.w@example.com', '+44 7700 900099', '88 Oxford St, London', false);

-- Get Customer IDs to use in tickets (Note: UUIDs are random, so we do this as a single transaction in a real app, 
-- but for simple seeding we'll use a DO block or just insert some dummy tickets using subqueries)

DO $$ 
DECLARE 
    sarah_id UUID;
    david_id UUID;
    emma_id UUID;
BEGIN
    SELECT id INTO sarah_id FROM customers WHERE email = 'sarah.j@example.com';
    SELECT id INTO david_id FROM customers WHERE email = 'david.c@example.com';
    SELECT id INTO emma_id FROM customers WHERE email = 'emma.w@example.com';

    -- Insert Seed Tickets
    INSERT INTO tickets (ticket_ref, customer_id, device_brand, device_model, device_imei, reported_issues, status, estimated_price) VALUES
    ('REP-1042', sarah_id, 'Apple', 'iPhone 13 Pro', '354892019384721', ARRAY['Screen Damage'], 'Repairing', 185.00),
    ('REP-1041', david_id, 'Apple', 'MacBook Air M1', 'C02XD4A5JGH6', ARRAY['Battery Drain'], 'Completed', 85.00),
    ('REP-1040', emma_id, 'Samsung', 'Galaxy S21', '359992019384721', ARRAY['Charging Port'], 'Diagnosed', 65.00);
END $$;
