
-- --------------------------------------------------------
-- Travelers Table 
-- --------------------------------------------------------
CREATE TABLE travelers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Plans Table
-- --------------------------------------------------------
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    traveler_id INT NOT NULL,
    parent_id INT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    image_url VARCHAR(512),
    group_type ENUM(
        'family',
        'friends',
        'coworkers',
        'couple',
        'solo',
        'school_group',
        'other'
    ) NOT NULL DEFAULT 'friends',
    start_date DATE,
    end_date DATE,
    nb_people INT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nb_people CHECK (nb_people > 0 AND nb_people <= 20),
    CONSTRAINT chk_date_range CHECK (start_date <= end_date),
    FOREIGN KEY (traveler_id) 
        REFERENCES travelers(id) 
        ON DELETE CASCADE,
    FOREIGN KEY (parent_id) 
        REFERENCES plans(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Keywords Table
-- --------------------------------------------------------
CREATE TABLE keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    FOREIGN KEY (plan_id) 
        REFERENCES plans(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Days Table
-- --------------------------------------------------------
CREATE TABLE days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    day_number INT NOT NULL,
    image_url VARCHAR(512),
    accommodation VARCHAR(512),
    accommodation_cost DECIMAL(10,2),
    transportation VARCHAR(512),
    transport_cost DECIMAL(10,2),
    FOREIGN KEY (plan_id) 
        REFERENCES plans(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Activities Table
-- --------------------------------------------------------
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_id INT NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    FOREIGN KEY (day_id) 
        REFERENCES days(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Meals Table
-- --------------------------------------------------------
CREATE TABLE meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_id INT NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner','Snack') NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    FOREIGN KEY (day_id) 
        REFERENCES days(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Bookmarks Table
-- --------------------------------------------------------
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    traveler_id INT NOT NULL,
    plan_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (traveler_id) 
        REFERENCES travelers(id)
        ON DELETE CASCADE,
    FOREIGN KEY (plan_id) 
        REFERENCES plans(id)
        ON DELETE CASCADE,
    UNIQUE KEY unique_bookmark (traveler_id, plan_id)
) ENGINE=InnoDB;

-- Insert sample data for testing
INSERT INTO travelers (name, email, hashed_password) VALUES 
('Test User', 'test123@example.com', '$2y$10$YourHashedPasswordHere');

-- Insert some sample countries/destinations
INSERT INTO plans (traveler_id, country, city, image_url, group_type, start_date, end_date, nb_people, cost) VALUES 
(1, 'France', 'Paris', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 'couple', '2023-06-10', '2023-06-17', 2, 1299.99),
(1, 'Japan', 'Tokyo', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', 'friends', '2023-07-15', '2023-07-25', 4, 1599.99),
(1, 'Italy', 'Rome', 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80', 'family', '2023-08-01', '2023-08-07', 5, 1199.99);

-- Add keywords to plans
INSERT INTO keywords (plan_id, keyword) VALUES
(1, 'romantic'),
(1, 'sightseeing'),
(1, 'food'),
(2, 'culture'),
(2, 'technology'),
(2, 'shopping'),
(3, 'history'),
(3, 'architecture'),
(3, 'cuisine');

-- Add days to the Paris plan
INSERT INTO days (plan_id, day_number, accommodation, accommodation_cost, transportation, transport_cost) VALUES
(1, 1, 'Hotel des Arts Paris', 150.00, 'Taxi from airport', 35.00),
(1, 2, 'Hotel des Arts Paris', 150.00, 'Metro pass', 10.00),
(1, 3, 'Hotel des Arts Paris', 150.00, 'Metro pass', 10.00);

-- Add activities to day 1 of Paris
INSERT INTO activities (day_id, activity_name, description, cost) VALUES
(1, 'Eiffel Tower Visit', 'Visit the iconic Eiffel Tower and enjoy the panoramic view of Paris', 25.00),
(1, 'Seine River Cruise', 'Evening cruise on the Seine River', 30.00),
(2, 'Louvre Museum', 'Explore the world-famous Louvre Museum', 15.00),
(2, 'Champs-Élysées Walk', 'Stroll down the famous Champs-Élysées avenue', 0.00),
(3, 'Montmartre Tour', 'Visit the artistic neighborhood of Montmartre and Sacré-Cœur', 0.00),
(3, 'Moulin Rouge Show', 'Evening show at the legendary Moulin Rouge', 120.00);

-- Add meals
INSERT INTO meals (day_id, meal_type, description, cost) VALUES
(1, 'Breakfast', 'Continental breakfast at the hotel', 0.00),
(1, 'Lunch', 'Lunch at a café near Eiffel Tower', 25.00),
(1, 'Dinner', 'Dinner at a romantic restaurant', 80.00),
(2, 'Breakfast', 'Continental breakfast at the hotel', 0.00),
(2, 'Lunch', 'Quick lunch at a boulangerie', 15.00),
(2, 'Dinner', 'French cuisine at a local bistro', 60.00),
(3, 'Breakfast', 'Continental breakfast at the hotel', 0.00),
(3, 'Lunch', 'Lunch in Montmartre', 30.00),
(3, 'Dinner', 'Dinner before the show', 70.00);
