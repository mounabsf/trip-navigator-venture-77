
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS travel_planner;
USE travel_planner;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Travel plans (destinations) table
CREATE TABLE IF NOT EXISTS travel_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    travel_plan_id INT NOT NULL,
    travel_date DATE NOT NULL,
    num_people INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (travel_plan_id) REFERENCES travel_plans(id)
);

-- Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    day_number INT NOT NULL,
    morning_activity TEXT,
    afternoon_activity TEXT,
    evening_activity TEXT,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);

-- Insert sample destinations
INSERT INTO travel_plans (title, location, description, image_url, price, duration) VALUES
('Paris', 'France', 'Experience the romance of the City of Light with iconic landmarks like the Eiffel Tower and charming cafés.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 1299, 7),
('Tokyo', 'Japan', 'Discover the perfect blend of tradition and innovation in Japan\'s vibrant capital city.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', 1599, 10),
('Rome', 'Italy', 'Explore ancient history and enjoy delicious Italian cuisine in the Eternal City.', 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80', 1199, 6),
('Bali', 'Indonesia', 'Relax on pristine beaches and immerse yourself in the rich cultural heritage of this Indonesian paradise.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', 1099, 8),
('New York', 'USA', 'Experience the energy of the city that never sleeps with world-class shopping, dining, and entertainment.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', 1499, 5),
('Santorini', 'Greece', 'Enjoy breathtaking sunsets and stunning views on this iconic Greek island with white-washed buildings.', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80', 1399, 6),
('Sydney', 'Australia', 'Explore the beautiful harbor city with the iconic Opera House and vibrant cultural scene.', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80', 1799, 12),
('London', 'UK', 'Discover the rich history and modern attractions of England\'s vibrant capital city.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', 1349, 7),
('Bangkok', 'Thailand', 'Experience the vibrant street life, ornate temples, and amazing cuisine of Thailand\'s capital.', 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0c5?auto=format&fit=crop&w=600&q=80', 999, 9),
('Barcelona', 'Spain', 'Enjoy the unique architecture, beautiful beaches, and vibrant culture of this Spanish city.', 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80', 1199, 6),
('Dubai', 'UAE', 'Experience the luxury and innovation of this futuristic desert city with stunning architecture.', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80', 1699, 7),
('Cairo', 'Egypt', 'Explore ancient pyramids and experience the rich history of Egypt\'s bustling capital city.', 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80', 1099, 8),
('Vancouver', 'Canada', 'Discover this coastal city with stunning mountains, parks, and a diverse cultural scene.', 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=600&q=80', 1299, 6),
('Singapore', 'Singapore', 'Explore the ultramodern city-state with lush gardens, diverse cuisine, and world-class shopping.', 'https://images.unsplash.com/photo-1574227492706-f65b24c3688a?auto=format&fit=crop&w=600&q=80', 1399, 5),
('Marrakech', 'Morocco', 'Immerse yourself in vibrant colors, rich fragrances, and ancient traditions in this historic Moroccan city.', 'https://images.unsplash.com/photo-1560719887-fe3105fa1e55?auto=format&fit=crop&w=600&q=80', 999, 6),
('Rio de Janeiro', 'Brazil', 'Experience the stunning beaches, vibrant culture, and iconic landmarks of this Brazilian wonderland.', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80', 1599, 8),
('Cape Town', 'South Africa', 'Explore the breathtaking mountains, beaches, and cultural diversity of South Africa\'s coastal gem.', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80', 1499, 10),
('Vienna', 'Austria', 'Discover imperial palaces, classical music heritage, and café culture in this elegant European city.', 'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?auto=format&fit=crop&w=600&q=80', 1199, 5),
('Kyoto', 'Japan', 'Step back in time with ancient temples, traditional gardens, and preserved geisha districts.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', 1399, 7),
('Amsterdam', 'Netherlands', 'Experience the picturesque canals, innovative architecture, and vibrant culture of this Dutch capital.', 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', 1249, 5);
