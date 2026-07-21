// Form submission handling

// Get the forms
const appointmentForm = document.getElementById('appointmentForm');
const contactForm = document.getElementById('contactForm');

// Get the modal elements
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close-modal');
const modalMessage = document.querySelector('.modal-message');

// Close modal when clicking X or outside
if (closeModal) {
    closeModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Show success modal
function showSuccessModal(message) {
    if (modalMessage) {
        modalMessage.textContent = message;
    }
    if (successModal) {
        successModal.style.display = 'block';
    }
}

// Handle appointment form submission
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('=== APPOINTMENT FORM SUBMISSION ===');
        
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const appointmentData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            appointmentType: document.getElementById('appointmentType').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value
        };
        
        console.log('Appointment Data:', appointmentData);
        console.log('Sending POST to /api/appointments');
        
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                console.log('✅ Appointment submitted successfully!');
                
                // Show success modal
                showSuccessModal('Your appointment request has been submitted successfully! We will contact you within 24 hours.');
                
                // Reset form
                appointmentForm.reset();
            } else {
                console.error('❌ Server returned error:', data.message);
                alert('Error: ' + data.message);
            }
            
        } catch (error) {
            console.error('❌ Fetch error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Handle contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('=== CONTACT FORM SUBMISSION ===');
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        const contactData = {
            contactName: document.getElementById('contactName').value,
            contactEmail: document.getElementById('contactEmail').value,
            subject: document.getElementById('subject').value,
            contactMessage: document.getElementById('contactMessage').value
        };
        
        console.log('Contact Data:', contactData);
        console.log('Sending POST to /api/contact');
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                console.log('✅ Message sent successfully!');
                
                // Show success modal
                showSuccessModal('Your message has been sent successfully! We will respond as soon as possible.');
                
                // Reset form
                contactForm.reset();
            } else {
                console.error('❌ Server returned error:', data.message);
                alert('Error: ' + data.message);
            }
            
        } catch (error) {
            console.error('❌ Fetch error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if you have one)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Populate courses dynamically
async function populateCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        
        const coursesContainer = document.querySelector('.courses-grid');
        if (!coursesContainer) return;
        
        coursesContainer.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-tag">${course.tag}</div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor">👨‍⚕️ ${course.instructor}</p>
                <p class="course-description">${course.description}</p>
                <div class="course-details">
                    <span>⏱️ ${course.duration}</span>
                    <span>📊 ${course.level}</span>
                    <span>💰 $${course.price.toLocaleString()}</span>
                </div>
                <div class="course-meta">
                    <span>📅 ${course.date}</span>
                    <span>${course.enrolled}/${course.capacity} enrolled</span>
                </div>
                <a href="#appointment" class="btn btn-primary">Enroll Now</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Populate products dynamically
async function populateProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const productsContainer = document.querySelector('.products-grid');
        if (!productsContainer) return;
        
        productsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="product-price">$${product.price.toLocaleString()}</span>
                    <span class="product-manufacturer">${product.manufacturer}</span>
                </div>
                <div class="product-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </div>
                <a href="#contact" class="btn btn-secondary">Contact for Details</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
    populateProducts();
});

console.log('✅ Script.js loaded successfully');