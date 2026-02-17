const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const appointments = [];
const contacts = [];

// Email configuration using Resend
let resend = null;

if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend email service configured');
    console.log('📧 Admin email set to:', process.env.ADMIN_EMAIL || 'Not configured');
} else {
    console.log('⚠️ RESEND_API_KEY not set in environment variables');
    console.log('Emails will not be sent. Add RESEND_API_KEY to Vercel environment variables.');
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

// Universal image handler - handles ALL image files
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
        path.join(__dirname, filename),
        path.join(__dirname, '..', filename),
        path.join(process.cwd(), filename),
        path.join('/var/task', filename),
    ];
    
    console.log('🔍 Looking for:', filename);
    
    // Try each path
    for (let filepath of possiblePaths) {
        if (fs.existsSync(filepath)) {
            console.log('✅ Found at:', filepath);
            return res.sendFile(filepath);
        }
    }
    
    console.error('❌ Image not found:', filename);
    res.status(404).send('Image not found');
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        emailConfigured: !!resend
    });
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
        console.log('✅ Appointment saved:', appointment.id);
        
        // Send emails using Resend
        if (resend) {
            try {
                // Send confirmation to customer
                const customerEmail = await resend.emails.send({
                    from: 'Care1st Dental <onboarding@resend.dev>',
                    to: email,
                    subject: 'Appointment Request Confirmation - Care1st Dental',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #1a5f7a; color: white; padding: 20px; text-align: center; }
                                .content { background: #f9f9f9; padding: 30px; }
                                .details { background: white; padding: 20px; border-left: 4px solid #1a5f7a; margin: 20px 0; }
                                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                                ul { list-style: none; padding: 0; }
                                li { padding: 8px 0; }
                                strong { color: #1a5f7a; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Thank you for your appointment request!</h1>
                                </div>
                                <div class="content">
                                    <p>Dear ${name},</p>
                                    <p>We have received your appointment request with the following details:</p>
                                    <div class="details">
                                        <ul>
                                            <li><strong>Type:</strong> ${appointmentType}</li>
                                            <li><strong>Date:</strong> ${date}</li>
                                            <li><strong>Time:</strong> ${time}</li>
                                            <li><strong>Phone:</strong> ${phone}</li>
                                            ${message ? `<li><strong>Note:</strong> ${message}</li>` : ''}
                                        </ul>
                                    </div>
                                    <p>We will confirm your appointment within 24 hours.</p>
                                    <p>If you have any questions, please contact us at <strong>(214) 566-7795</strong>.</p>
                                </div>
                                <div class="footer">
                                    <p>Best regards,<br><strong>Care1st Dental Management Team</strong></p>
                                    <p style="font-size: 12px; color: #999;">
                                        1548 Valwood Pkwy Ste 100, Carrollton, TX 75006
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
                
                console.log('✅ Customer email sent:', customerEmail.data?.id);
                
                // Send notification to admin
                const adminEmail = await resend.emails.send({
                    from: 'Care1st Dental <onboarding@resend.dev>',
                    to: process.env.ADMIN_EMAIL || 'admin@care1stdental.com',
                    subject: `New Appointment Request - ${appointmentType}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #d4941f; color: white; padding: 20px; }
                                .content { background: #f9f9f9; padding: 30px; }
                                .details { background: white; padding: 20px; border-left: 4px solid #d4941f; }
                                ul { list-style: none; padding: 0; }
                                li { padding: 8px 0; border-bottom: 1px solid #eee; }
                                strong { color: #1a5f7a; display: inline-block; width: 120px; }
                                .urgent { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 10px 0; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2>🔔 New Appointment Request</h2>
                                </div>
                                <div class="content">
                                    <div class="urgent">
                                        <strong>Action Required:</strong> Please confirm this appointment within 24 hours.
                                    </div>
                                    <div class="details">
                                        <ul>
                                            <li><strong>Name:</strong> ${name}</li>
                                            <li><strong>Email:</strong> ${email}</li>
                                            <li><strong>Phone:</strong> ${phone}</li>
                                            <li><strong>Type:</strong> ${appointmentType}</li>
                                            <li><strong>Date:</strong> ${date}</li>
                                            <li><strong>Time:</strong> ${time}</li>
                                            <li><strong>Message:</strong> ${message || 'N/A'}</li>
                                            <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
                
                console.log('✅ Admin email sent:', adminEmail.data?.id);
                
            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                // Don't fail the request if email fails
            }
        } else {
            console.log('⚠️ Email not configured - skipping email notifications');
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
        console.error('❌ Appointment submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
});

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
        console.log('✅ Contact message saved:', contact.id);
        
        // Send emails using Resend
        if (resend) {
            try {
                // Send confirmation to customer
                const customerEmail = await resend.emails.send({
                    from: 'Care1st Dental <onboarding@resend.dev>',
                    to: contactEmail,
                    subject: 'Message Received - Care1st Dental',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #1a5f7a; color: white; padding: 20px; text-align: center; }
                                .content { background: #f9f9f9; padding: 30px; }
                                .message-box { background: white; padding: 20px; border-left: 4px solid #1a5f7a; margin: 20px 0; }
                                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Thank you for contacting us!</h1>
                                </div>
                                <div class="content">
                                    <p>Dear ${contactName},</p>
                                    <p>We have received your message and will respond as soon as possible.</p>
                                    <div class="message-box">
                                        <p><strong>Your message:</strong></p>
                                        <p>${contactMessage}</p>
                                    </div>
                                    <p>Our typical response time is within 24 hours during business days.</p>
                                    <p>For urgent matters, please call us at <strong>(214) 566-7795</strong>.</p>
                                </div>
                                <div class="footer">
                                    <p>Best regards,<br><strong>Care1st Dental Management Team</strong></p>
                                    <p style="font-size: 12px; color: #999;">
                                        1548 Valwood Pkwy Ste 100, Carrollton, TX 75006
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
                
                console.log('✅ Customer email sent:', customerEmail.data?.id);
                
                // Send notification to admin
                const adminEmail = await resend.emails.send({
                    from: 'Care1st Dental <onboarding@resend.dev>',
                    to: process.env.ADMIN_EMAIL || 'admin@care1stdental.com',
                    subject: `New Contact Message: ${subject}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: #d4941f; color: white; padding: 20px; }
                                .content { background: #f9f9f9; padding: 30px; }
                                .details { background: white; padding: 20px; border-left: 4px solid #d4941f; }
                                ul { list-style: none; padding: 0; }
                                li { padding: 8px 0; border-bottom: 1px solid #eee; }
                                strong { color: #1a5f7a; display: inline-block; width: 100px; }
                                .message { background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 4px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2>💬 New Contact Form Submission</h2>
                                </div>
                                <div class="content">
                                    <div class="details">
                                        <ul>
                                            <li><strong>Name:</strong> ${contactName}</li>
                                            <li><strong>Email:</strong> ${contactEmail}</li>
                                            <li><strong>Subject:</strong> ${subject}</li>
                                            <li><strong>Submitted:</strong> ${new Date().toLocaleString()}</li>
                                        </ul>
                                        <div class="message">
                                            <strong>Message:</strong>
                                            <p>${contactMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                });
                
                console.log('✅ Admin email sent:', adminEmail.data?.id);
                
            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
            }
        } else {
            console.log('⚠️ Email not configured - skipping email notifications');
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
        console.error('❌ Contact submission error:', error);
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Export for Vercel
module.exports = app;