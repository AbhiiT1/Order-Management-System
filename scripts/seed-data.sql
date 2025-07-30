-- Insert sample orders
INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_amount, status) VALUES
('John Doe', 'john@example.com', '+1234567890', '123 Main St, New York, NY 10001', 299.99, 'placed'),
('Jane Smith', 'jane@example.com', '+1987654321', '456 Oak Ave, Los Angeles, CA 90210', 149.50, 'picked'),
('Bob Johnson', 'bob@example.com', '+1122334455', '789 Pine Rd, Chicago, IL 60601', 89.99, 'shipped'),
('Alice Brown', 'alice@example.com', '+1555666777', '321 Elm St, Houston, TX 77001', 199.99, 'delivered');

-- Insert sample order items
INSERT INTO order_items (order_id, product_name, quantity, price) VALUES
(1, 'Wireless Headphones', 1, 199.99),
(1, 'Phone Case', 2, 50.00),
(2, 'Bluetooth Speaker', 1, 149.50),
(3, 'USB Cable', 3, 29.99),
(4, 'Laptop Stand', 1, 199.99);

-- Insert status history
INSERT INTO order_status_history (order_id, status, notes) VALUES
(1, 'placed', 'Order received and confirmed'),
(2, 'placed', 'Order received and confirmed'),
(2, 'picked', 'Items picked from warehouse'),
(3, 'placed', 'Order received and confirmed'),
(3, 'picked', 'Items picked from warehouse'),
(3, 'shipped', 'Package shipped via FedEx'),
(4, 'placed', 'Order received and confirmed'),
(4, 'picked', 'Items picked from warehouse'),
(4, 'shipped', 'Package shipped via UPS'),
(4, 'delivered', 'Package delivered successfully');
