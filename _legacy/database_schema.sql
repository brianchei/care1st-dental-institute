-- Database Schema for Care1st Dental Management
-- PostgreSQL Implementation

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'student', -- student, instructor, admin, vendor
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- COURSES & WORKSHOPS
-- ============================================

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    instructor_id INTEGER REFERENCES users(id),
    category VARCHAR(100), -- implantology, cosmetic, endodontic, etc.
    level VARCHAR(50), -- beginner, intermediate, advanced
    duration_days INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    ce_credits INTEGER DEFAULT 0, -- Continuing Education credits
    is_accredited BOOLEAN DEFAULT false,
    accreditation_body VARCHAR(100), -- ADA CERP, state board, etc.
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_status ON courses(status);

-- Course Sessions (Scheduled instances of courses)
CREATE TABLE course_sessions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255), -- lecture hall, training area, etc.
    enrolled_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_sessions_dates ON course_sessions(start_date, end_date);

-- ============================================
-- ENROLLMENTS
-- ============================================

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_session_id INTEGER REFERENCES course_sessions(id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled, refunded
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, partial, refunded
    amount_paid DECIMAL(10, 2),
    payment_method VARCHAR(50),
    certificate_issued BOOLEAN DEFAULT false,
    certificate_number VARCHAR(100),
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_session_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_session ON enrollments(course_session_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- ============================================
-- PRODUCTS & EQUIPMENT
-- ============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100), -- imaging, clinical, cosmetic, hygiene, etc.
    manufacturer VARCHAR(255),
    description TEXT,
    specifications JSONB, -- Store detailed specs as JSON
    price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    image_url VARCHAR(500),
    demo_available BOOLEAN DEFAULT false,
    financing_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);

-- Product Inquiries
CREATE TABLE product_inquiries (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    inquiry_type VARCHAR(50), -- demo, purchase, financing
    message TEXT,
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    appointment_type VARCHAR(100) NOT NULL, -- course, tour, rental, demo, consultation
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, rescheduled, completed, cancelled
    notes TEXT,
    admin_notes TEXT,
    confirmed_date DATE,
    confirmed_time TIME,
    assigned_to INTEGER REFERENCES users(id), -- Staff member handling appointment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(preferred_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================
-- FACILITY RENTALS
-- ============================================

CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER,
    hourly_rate DECIMAL(10, 2),
    daily_rate DECIMAL(10, 2),
    amenities JSONB, -- Store amenities list as JSON
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facility_bookings (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    user_id INTEGER REFERENCES users(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT,
    attendee_count INTEGER,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    total_price DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_facility_bookings_date ON facility_bookings(booking_date);
CREATE INDEX idx_facility_bookings_facility ON facility_bookings(facility_id);

-- ============================================
-- MEMBERSHIPS
-- ============================================

CREATE TABLE membership_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price DECIMAL(10, 2),
    annual_price DECIMAL(10, 2),
    benefits JSONB, -- Store benefits list as JSON
    course_discount_percent INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tier_id INTEGER REFERENCES membership_tiers(id),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled
    payment_frequency VARCHAR(20), -- monthly, annual
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    reference_type VARCHAR(50), -- enrollment, booking, membership, product
    reference_id INTEGER, -- ID of the related record
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- credit_card, bank_transfer, check, etc.
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference_type, reference_id);

-- ============================================
-- CONTACT MESSAGES
-- ============================================

CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- NULL if not logged in
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, read, replied, archived
    assigned_to INTEGER REFERENCES users(id), -- Staff member handling
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created ON contact_messages(created_at);

-- ============================================
-- REVIEWS & TESTIMONIALS
-- ============================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ============================================
-- EMAIL SUBSCRIPTIONS
-- ============================================

CREATE TABLE email_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, unsubscribed
    source VARCHAR(100), -- website, course, event, etc.
    tags JSONB, -- Segmentation tags
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

CREATE INDEX idx_subscribers_status ON email_subscribers(status);

-- ============================================
-- CERTIFICATIONS
-- ============================================

CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_courses JSONB, -- Array of course IDs
    duration_months INTEGER,
    price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_certifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    certification_id INTEGER REFERENCES certifications(id),
    enrollment_date DATE,
    completion_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, expired
    certificate_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ANALYTICS & TRACKING
-- ============================================

CREATE TABLE page_views (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500),
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_created ON page_views(created_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables...

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active courses with enrollment counts
CREATE VIEW active_courses_summary AS
SELECT 
    c.id,
    c.title,
    c.price,
    c.category,
    cs.start_date,
    cs.end_date,
    COUNT(e.id) as enrolled_count,
    c.max_capacity,
    (c.max_capacity - COUNT(e.id)) as available_spots
FROM courses c
LEFT JOIN course_sessions cs ON c.id = cs.course_id
LEFT JOIN enrollments e ON cs.id = e.course_session_id AND e.status = 'confirmed'
WHERE c.status = 'published'
    AND cs.start_date >= CURRENT_DATE
GROUP BY c.id, c.title, c.price, c.category, cs.id, cs.start_date, cs.end_date, c.max_capacity;

-- User enrollment history
CREATE VIEW user_enrollment_history AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    c.title as course_title,
    cs.start_date,
    e.status as enrollment_status,
    e.payment_status,
    e.certificate_issued
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN course_sessions cs ON e.course_session_id = cs.id
JOIN courses c ON cs.course_id = c.id
ORDER BY cs.start_date DESC;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample membership tiers
INSERT INTO membership_tiers (name, description, monthly_price, annual_price, benefits, course_discount_percent) VALUES
('Basic', 'Essential benefits for continuous learners', 99.00, 999.00, '["20% course discount", "Free webinars", "Resource library access"]', 20),
('Professional', 'For serious dental professionals', 199.00, 1999.00, '["30% course discount", "2 free courses/year", "Priority registration", "Quarterly consultation"]', 30),
('Elite', 'Premium access and exclusive benefits', 399.00, 3999.00, '["Unlimited course access", "VIP facility rates", "Private training", "Industry connections"]', 100);

-- Insert sample facilities
INSERT INTO facilities (name, description, capacity, hourly_rate, daily_rate, amenities) VALUES
('Professional Lecture Hall', 'Modern auditorium with AV equipment', 80, 150.00, 1000.00, '["Projector", "Sound system", "Whiteboard", "WiFi"]'),
('Hands-On Training Area', 'Equipped with dental chairs', 20, 200.00, 1400.00, '["15 dental chairs", "Sterilization", "Storage", "Equipment"]'),
('Product Showcase Room', 'Dedicated demonstration space', 40, 125.00, 800.00, '["Display cases", "Demo areas", "Seating", "Presentation equipment"]');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_enrollments_user_status ON enrollments(user_id, status);
CREATE INDEX idx_course_sessions_course_date ON course_sessions(course_id, start_date);
CREATE INDEX idx_payments_user_date ON payments(user_id, payment_date);

-- ============================================
-- NOTES
-- ============================================

/*
This schema provides:

1. User management with role-based access
2. Course catalog and scheduling
3. Student enrollment and tracking
4. Product/equipment management
5. Appointment system
6. Facility rental management
7. Membership programs
8. Payment processing
9. Contact management
10. Reviews and testimonials
11. Certification programs
12. Analytics tracking

To implement:
1. Install PostgreSQL
2. Create database: CREATE DATABASE care1st_dental;
3. Run this schema file
4. Update server.js to use PostgreSQL instead of in-memory storage
5. Use pg or pg-promise npm package for database queries

Security considerations:
- Add row-level security policies
- Encrypt sensitive data
- Use prepared statements (prevents SQL injection)
- Regular backups
- Audit logging
*/
