# Quick Start Guide - Care1st Dental Management

Get your website running in 5 minutes!

## Prerequisites
- Node.js installed (download from nodejs.org)
- A text editor (VS Code recommended)
- Gmail account (for email notifications)

## Step-by-Step Setup

### 1. Extract Files
Extract all files to a folder on your computer, e.g., `C:\care1st-dental` or `~/care1st-dental`

### 2. Open Terminal/Command Prompt
- **Windows**: Press Win+R, type `cmd`, press Enter
- **Mac**: Press Cmd+Space, type "terminal", press Enter
- Navigate to your folder:
  ```bash
  cd path/to/care1st-dental
  ```

### 3. Install Dependencies
```bash
npm install
```
Wait for installation to complete (1-2 minutes)

### 4. Configure Email (Optional but recommended)
1. Copy `.env.example` to `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

2. Open `.env` in text editor and update:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@care1stdental.com
   ```

3. Get Gmail App Password:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Go to https://myaccount.google.com/apppasswords
   - Create new app password
   - Copy the 16-character password to EMAIL_PASS

### 5. Start the Server
```bash
npm start
```

You should see:
```
Server is running on port 3000
Visit http://localhost:3000
```

### 6. Open Website
Open your browser and go to:
```
http://localhost:3000
```

🎉 **Congratulations!** Your website is running!

## Testing the Website

### Test Forms
1. **Book Appointment**: Click "Book Appointment" and fill the form
2. **Contact Form**: Scroll to "Contact Us" and send a message
3. **Check Console**: Open browser console (F12) to see form submissions

### View Submitted Data
While server is running, visit:
- All appointments: http://localhost:3000/api/admin/appointments
- All contacts: http://localhost:3000/api/admin/contacts
- All courses: http://localhost:3000/api/courses
- All products: http://localhost:3000/api/products

## Customization Basics

### Update Contact Information
Edit `index.html`, find the contact section and update:
- Address
- Phone number
- Email addresses
- Business hours

### Change Colors/Branding
Edit `styles.css` at the top:
```css
:root {
    --primary-color: #1a5f7a;  /* Change this */
    --accent-color: #d4941f;   /* And this */
}
```

### Add/Edit Courses
Edit `script.js`, find the `courses` array and add/modify entries

### Add/Edit Products
Edit `script.js`, find the `products` array and add/modify entries

## Common Issues

### "Port 3000 already in use"
Someone else is using port 3000. Change it in `.env`:
```
PORT=3001
```
Then visit http://localhost:3001

### "Cannot find module"
Run `npm install` again

### Forms not sending email
- Check your `.env` file has correct credentials
- Make sure you're using App Password, not regular password
- Check spam folder for test emails

### Website not updating
- Stop server (Ctrl+C)
- Clear browser cache (Ctrl+Shift+Delete)
- Restart server

## Next Steps

1. ✅ Website running locally
2. 📝 Customize content (contact info, courses, products)
3. 🎨 Adjust branding (colors, fonts)
4. 📧 Configure email (if not done)
5. 🚀 Deploy to internet (see DEPLOYMENT.md)

## File Structure Overview

```
care1st-dental/
├── index.html          ← Main website file
├── styles.css          ← All styling/colors
├── script.js           ← Interactive features
├── server.js           ← Backend server
├── package.json        ← Project dependencies
├── .env                ← Your private settings
├── README.md           ← Full documentation
├── DEPLOYMENT.md       ← How to put online
└── BUSINESS_STRATEGY.md ← Growth ideas
```

## Development Mode (Auto-reload)

For easier development with automatic restart on file changes:

```bash
npm install -g nodemon
npm run dev
```

Now the server restarts automatically when you edit files!

## Getting Help

1. Read README.md for detailed documentation
2. Check DEPLOYMENT.md for hosting options
3. Review BUSINESS_STRATEGY.md for growth ideas
4. Contact support: info@care1stdental.com

## What's Working Right Now

✅ Fully responsive website  
✅ Navigation with smooth scrolling  
✅ Course listings (dynamic)  
✅ Product showcase (dynamic)  
✅ Appointment booking form  
✅ Contact form  
✅ Email notifications (if configured)  
✅ Mobile-friendly design  
✅ Professional animations  

## What You'll Need to Add Later

⏳ Database (currently using memory - data resets on restart)  
⏳ User accounts and login  
⏳ Payment processing  
⏳ Image uploads  
⏳ Admin dashboard  
⏳ Search functionality  

All of these can be added incrementally without breaking what's working!

---

**Ready to go live?** Check out DEPLOYMENT.md for hosting options starting at $0/month!
