const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const appointments = [];
const contacts = [];

// Email configuration
let transporter = null;

try {
    const nodemailer = require('nodemailer');  // Keep as const, inside try
    console.log('✅ Nodemailer module loaded');
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log('✅ Email transporter configured successfully');
        console.log('📧 Email user:', process.env.EMAIL_USER);
    } else {
        console.log('⚠️ Email credentials missing');
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    }
} catch (error) {
    console.error('❌ Nodemailer error:', error);
    transporter = null;
}

// CRITICAL: Static file routes for Vercel

// CSS and JS files
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'script.js'));
});

// Universal image handler - handles ALL image files automatically
app.get('/:filename(.*\\.(jpg|jpeg|png|gif|svg|webp|ico))', (req, res, next) => {
    const { filename } = req.params;
    
    // Determine MIME type
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        ico: 'image/x-icon'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Try multiple possible locations
    const possiblePaths = [
        path.join(__dirname, filename),                    // Same directory as server.js
        path.join(__dirname, '..', filename),              // Parent directory (for api/ structure)
        path.join(process.cwd(), filename),                // Current working directory
        path.join('/var/task', filename),                  // Vercel lambda root
    ];
    
    console.log('🔍 Looking for:', filename);
    console.log('__dirname:', __dirname);
    console.log('cwd:', process.cwd());
    
    // Try each path
    for (let filepath of possiblePaths) {
        if (fs.existsSync(filepath)) {
            console.log('✅ Found at:', filepath);
            return res.sendFile(filepath);
        }
        console.log('❌ Not at:', filepath);
    }
    
    console.error('❌ Image not found anywhere:', filename);
    res.status(404).send('Image not found');
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

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

app.post('/api/appointments', async (req, res) => {
    try {
        const { name, email, phone, appointmentType, date, time, message } = req.body;
        
        if (!name || !email || !phone || !appointmentType || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
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
        
        appointments.push(appointment);
        
        if (transporter) {
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
                        <br>
                        <p>Best regards,<br>Care1st Dental Management Team</p>
                    `
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
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

app.post('/api/contact', async (req, res) => {
    try {
        const { contactName, contactEmail, subject, contactMessage } = req.body;
        
        if (!contactName || !contactEmail || !subject || !contactMessage) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        const contact = {
            id: contacts.length + 1,
            name: contactName,
            email: contactEmail,
            subject,
            message: contactMessage,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        contacts.push(contact);
        
        if (transporter) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: contactEmail,
                    subject: 'Message Received - Care1st Dental',
                    html: `
                        <h2>Thank you for contacting us!</h2>
                        <p>Dear ${contactName},</p>
                        <p>We have received your message and will respond as soon as possible.</p>
                        <br>
                        <p>Best regards,<br>Care1st Dental Management Team</p>
                    `
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
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

app.get('/api/admin/appointments', (req, res) => {
    res.json(appointments);
});

app.get('/api/admin/contacts', (req, res) => {
    res.json(contacts);
});

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

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Export for Vercel
module.exports = app;