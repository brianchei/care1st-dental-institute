const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (replace with database in production)
const appointments = [];
const contacts = [];
/*
// Email configuration (configure with your SMTP settings)
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
*/

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Get all courses
app.get('/api/courses', (req, res) => {
    const courses = [
        {
            id: 1,
            title: "Advanced Implantology Masterclass",
            instructor: "Dr. Sarah Mitchell",
            tag: "Masterclass",
            description: "Comprehensive 3-day intensive training covering latest implant placement techniques, bone grafting, and immediate loading protocols.",
            duration: "3 days",
            level: "Advanced",
            price: 2499,
            date: "2024-03-15",
            capacity: 20,
            enrolled: 14
        },
        {
            id: 2,
            title: "Cosmetic Dentistry Workshop",
            instructor: "Dr. James Chen",
            tag: "Workshop",
            description: "Hands-on training in veneers, teeth whitening, and smile design using modern CAD/CAM technology.",
            duration: "2 days",
            level: "Intermediate",
            price: 1799,
            date: "2024-04-08",
            capacity: 25,
            enrolled: 18
        },
        {
            id: 3,
            title: "Endodontic Excellence",
            instructor: "Dr. Maria Rodriguez",
            tag: "Masterclass",
            description: "Master complex root canal procedures, retreatment strategies, and latest rotary instrumentation.",
            duration: "2 days",
            level: "Advanced",
            price: 1999,
            date: "2024-05-12",
            capacity: 18,
            enrolled: 12
        }
    ];
    res.json(courses);
});

// Get all products
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: "NextGen Digital Scanner",
            category: "Imaging Technology",
            description: "High-precision intraoral scanner with AI-powered accuracy and real-time 3D visualization.",
            price: 24999,
            manufacturer: "DentalTech Pro",
            inStock: true
        },
        {
            id: 2,
            name: "Elite Dental Chair System",
            category: "Clinical Equipment",
            description: "Ergonomic patient chair with integrated delivery system and touchless controls.",
            price: 18500,
            manufacturer: "ErgoChair Solutions",
            inStock: true
        },
        {
            id: 3,
            name: "ProWhite LED System",
            category: "Cosmetic Equipment",
            description: "Advanced LED teeth whitening system with customizable treatment protocols.",
            price: 3499,
            manufacturer: "BrightSmile Tech",
            inStock: true
        }
    ];
    res.json(products);
});

// Submit appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const { name, email, phone, appointmentType, date, time, message } = req.body;
        
        // Validation
        if (!name || !email || !phone || !appointmentType || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        // Create appointment object
        const appointment = {
            id: appointments.length + 1,
            name,
            email,
            phone,
            appointmentType,
            date,
            time,
            message: message || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Store appointment
        appointments.push(appointment);
        
        // Send confirmation email to customer
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Appointment Request Confirmation - Care1st Dental',
                html: `
                    <h2>Thank you for your appointment request!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your appointment request with the following details:</p>
                    <ul>
                        <li><strong>Type:</strong> ${appointmentType}</li>
                        <li><strong>Date:</strong> ${date}</li>
                        <li><strong>Time:</strong> ${time}</li>
                    </ul>
                    <p>We will confirm your appointment within 24 hours.</p>
                    <p>If you have any questions, please contact us at (555) 123-4567.</p>
                    <br>
                    <p>Best regards,<br>Care1st Dental Management Team</p>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }
        
        // Send notification to admin
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: 'New Appointment Request',
                html: `
                    <h2>New Appointment Request</h2>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Phone:</strong> ${phone}</li>
                        <li><strong>Type:</strong> ${appointmentType}</li>
                        <li><strong>Date:</strong> ${date}</li>
                        <li><strong>Time:</strong> ${time}</li>
                        <li><strong>Message:</strong> ${message || 'N/A'}</li>
                    </ul>
                `
            });
        } catch (emailError) {
            console.error('Admin notification failed:', emailError);
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Appointment request submitted successfully',
            appointment: {
                id: appointment.id,
                status: appointment.status
            }
        });
        
    } catch (error) {
        console.error('Appointment submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { contactName, contactEmail, subject, contactMessage } = req.body;
        
        // Validation
        if (!contactName || !contactEmail || !subject || !contactMessage) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        // Create contact object
        const contact = {
            id: contacts.length + 1,
            name: contactName,
            email: contactEmail,
            subject,
            message: contactMessage,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        // Store contact
        contacts.push(contact);
        
        // Send confirmation email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: contactEmail,
                subject: 'Message Received - Care1st Dental',
                html: `
                    <h2>Thank you for contacting us!</h2>
                    <p>Dear ${contactName},</p>
                    <p>We have received your message and will respond as soon as possible.</p>
                    <p><strong>Your message:</strong></p>
                    <p>${contactMessage}</p>
                    <br>
                    <p>Best regards,<br>Care1st Dental Management Team</p>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        
        // Send notification to admin
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: `New Contact Message: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <ul>
                        <li><strong>Name:</strong> ${contactName}</li>
                        <li><strong>Email:</strong> ${contactEmail}</li>
                        <li><strong>Subject:</strong> ${subject}</li>
                        <li><strong>Message:</strong> ${contactMessage}</li>
                    </ul>
                `
            });
        } catch (emailError) {
            console.error('Admin notification failed:', emailError);
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully',
            contact: {
                id: contact.id,
                status: contact.status
            }
        });
        
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
});

// Get all appointments (admin endpoint - should be protected in production)
app.get('/api/admin/appointments', (req, res) => {
    res.json(appointments);
});

// Get all contacts (admin endpoint - should be protected in production)
app.get('/api/admin/contacts', (req, res) => {
    res.json(contacts);
});

// Update appointment status (admin endpoint)
app.patch('/api/admin/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = appointments.find(a => a.id === parseInt(id));
    
    if (!appointment) {
        return res.status(404).json({ 
            success: false, 
            message: 'Appointment not found' 
        });
    }
    
    appointment.status = status;
    appointment.updatedAt = new Date().toISOString();
    
    res.json({ 
        success: true, 
        message: 'Appointment updated successfully',
        appointment 
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});

module.exports = app;
