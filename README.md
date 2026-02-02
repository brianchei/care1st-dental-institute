# Care1st Dental Management Website

A professional website for a dental training institute featuring course management, appointment booking, product showcases, and facility rentals.

## Features

### Frontend
- **Responsive Design**: Mobile-first, fully responsive layout
- **Home Page**: Hero section with statistics and value propositions
- **Courses & Workshops**: Dynamic course listings with enrollment capabilities
- **Products & Equipment**: Showcase of dental equipment and devices
- **Facilities**: Information about lecture halls, training areas, and rental spaces
- **Appointment Booking**: Integrated booking system with form validation
- **Contact Form**: Multi-purpose contact and inquiry form
- **Smooth Animations**: Scroll-triggered animations and micro-interactions

### Backend
- **RESTful API**: Express.js backend with organized endpoints
- **Email Notifications**: Automated confirmations via Nodemailer
- **Data Storage**: In-memory storage (easily extendable to database)
- **Form Validation**: Server-side validation for all inputs
- **Admin Endpoints**: Basic admin functionality for managing appointments

## Tech Stack

### Frontend
- HTML5
- CSS3 (Custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Cormorant Garamond, Archivo)

### Backend
- Node.js
- Express.js
- Nodemailer (email functionality)
- CORS
- dotenv (environment management)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone or download the project**
   ```bash
   cd care1st-dental-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your email credentials:
   ```
   PORT=3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@care1stdental.com
   ```

   **For Gmail:**
   - Enable 2-factor authentication
   - Create an App Password: https://myaccount.google.com/apppasswords
   - Use the App Password in EMAIL_PASS

4. **Start the server**
   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run dev
   ```

5. **Access the website**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
care1st-dental-management/
├── index.html              # Main HTML file
├── styles.css              # Comprehensive CSS styles
├── script.js               # Frontend JavaScript
├── server.js               # Express backend server
├── package.json            # Node dependencies
├── .env.example            # Environment variables template
├── .env                    # Your environment variables (create this)
├── README.md               # This file
└── DEPLOYMENT.md           # Deployment guide
```

## API Endpoints

### Public Endpoints

#### Get Courses
```
GET /api/courses
```
Returns list of all available courses.

#### Get Products
```
GET /api/products
```
Returns list of all dental products.

#### Submit Appointment
```
POST /api/appointments
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "appointmentType": "course",
  "date": "2024-03-15",
  "time": "10:00",
  "message": "Optional message"
}
```

#### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "contactName": "Jane Smith",
  "contactEmail": "jane@example.com",
  "subject": "Inquiry about facilities",
  "contactMessage": "I would like to know more..."
}
```

### Admin Endpoints

#### Get All Appointments
```
GET /api/admin/appointments
```

#### Get All Contacts
```
GET /api/admin/contacts
```

#### Update Appointment Status
```
PATCH /api/admin/appointments/:id
Content-Type: application/json

{
  "status": "confirmed"
}
```

## Customization

### Adding New Courses
Edit the `courses` array in `script.js`:

```javascript
{
    title: "Your Course Name",
    instructor: "Dr. Name",
    tag: "Masterclass",
    description: "Course description...",
    duration: "2 days",
    level: "Advanced",
    price: "$1,999",
    date: "May 12-13, 2024"
}
```

### Adding New Products
Edit the `products` array in `script.js`:

```javascript
{
    name: "Product Name",
    category: "Category",
    description: "Product description...",
    icon: "🔧",
    link: "#product-link"
}
```

### Styling Customization
All colors and styles are defined as CSS variables in `styles.css`:

```css
:root {
    --primary-color: #1a5f7a;
    --accent-color: #d4941f;
    /* Modify these to match your brand */
}
```

## Future Enhancements

### Database Integration
Replace in-memory storage with PostgreSQL, MongoDB, or MySQL:

```javascript
// Example with PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### Payment Integration
Add Stripe for course payments:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### Calendar Integration
Sync appointments with Google Calendar:

```javascript
const { google } = require('googleapis');
```

### User Authentication
Add user accounts and login:

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
```

### Content Management System
Add admin dashboard for managing courses and content dynamically.

## Additional Services to Consider

Based on the dental training institute niche, consider adding:

1. **Continuing Education Credits (CE)**: Track and certificate CE credits
2. **Video Library**: On-demand course replays and tutorials
3. **Certification Programs**: Multi-course certification tracks
4. **Equipment Financing**: Partner with financing companies
5. **Membership Programs**: Annual membership with discounts
6. **Virtual Consultations**: Online 1-on-1 sessions with instructors
7. **Product Trials**: Demo equipment before purchase
8. **Job Board**: Connect trained professionals with opportunities
9. **Discussion Forum**: Community for knowledge sharing
10. **Newsletter/Blog**: Regular updates on dental innovations

## Support

For technical support or questions:
- Email: info@care1stdental.com
- Phone: (555) 123-4567

## License

MIT License - feel free to use and modify for your needs.
