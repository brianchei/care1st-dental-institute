// Sample Data
const courses = [
    {
        title: "Advanced Implantology Masterclass",
        instructor: "Dr. Sarah Mitchell",
        tag: "Masterclass",
        description: "Comprehensive 3-day intensive training covering latest implant placement techniques, bone grafting, and immediate loading protocols.",
        duration: "3 days",
        level: "Advanced",
        price: "$2,499",
        date: "March 15-17, 2026"
    },
    {
        title: "Cosmetic Dentistry Workshop",
        instructor: "Dr. James Chen",
        tag: "Workshop",
        description: "Hands-on training in veneers, teeth whitening, and smile design using modern CAD/CAM technology and composite materials.",
        duration: "2 days",
        level: "Intermediate",
        price: "$1,799",
        date: "April 8-9, 2026"
    },
    {
        title: "Endodontic Excellence",
        instructor: "Dr. Maria Rodriguez",
        tag: "Masterclass",
        description: "Master complex root canal procedures, retreatment strategies, and the latest rotary instrumentation techniques.",
        duration: "2 days",
        level: "Advanced",
        price: "$1,999",
        date: "May 12-13, 2026"
    },
    {
        title: "Digital Dentistry Fundamentals",
        instructor: "Dr. Kevin Park",
        tag: "Course",
        description: "Introduction to digital workflows including intraoral scanning, digital smile design, and 3D printing applications.",
        duration: "1 day",
        level: "Beginner",
        price: "$899",
        date: "April 22, 2026"
    },
    {
        title: "Orthodontic Treatment Planning",
        instructor: "Dr. Emily Thompson",
        tag: "Workshop",
        description: "Learn systematic approach to orthodontic diagnosis, treatment planning, and clear aligner therapy.",
        duration: "2 days",
        level: "Intermediate",
        price: "$1,599",
        date: "June 5-6, 2026"
    },
    {
        title: "Practice Management & Growth",
        instructor: "Dr. Robert Williams",
        tag: "Seminar",
        description: "Business strategies for growing your dental practice, team management, marketing, and patient communication.",
        duration: "1 day",
        level: "All Levels",
        price: "$699",
        date: "May 28, 2026"
    }
];

const products = [
    {
        name: "NextGen Digital Scanner",
        category: "Imaging Technology",
        description: "High-precision intraoral scanner with AI-powered accuracy and real-time 3D visualization.",
        icon: "📸",
        link: "#product-scanner"
    },
    {
        name: "Elite Dental Chair System",
        category: "Clinical Equipment",
        description: "Ergonomic patient chair with integrated delivery system and touchless controls.",
        icon: "🪑",
        link: "#product-chair"
    },
    {
        name: "ProWhite LED System",
        category: "Cosmetic Equipment",
        description: "Advanced LED teeth whitening system with customizable treatment protocols.",
        icon: "💡",
        link: "#product-whitening"
    },
    {
        name: "SmartCure Composite Kit",
        category: "Restorative Materials",
        description: "Premium nano-hybrid composite system with superior aesthetics and durability.",
        icon: "🦷",
        link: "#product-composite"
    },
    {
        name: "SonicPro Ultrasonic Scaler",
        category: "Hygiene Equipment",
        description: "Variable frequency ultrasonic scaler with ergonomic design and LED illumination.",
        icon: "🔧",
        link: "#product-scaler"
    },
    {
        name: "BioSafe Sterilization Unit",
        category: "Infection Control",
        description: "Class B autoclave with rapid cycle times and comprehensive instrument protection.",
        icon: "♻️",
        link: "#product-autoclave"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    populateCourses();
    populateProducts();
    initForms();
    initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Populate courses dynamically
function populateCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    
    courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.style.animationDelay = `${index * 0.1}s`;
        
        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-tag">${course.tag}</div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor">with ${course.instructor}</p>
            </div>
            <div class="course-body">
                <p class="course-description">${course.description}</p>
                <div class="course-details">
                    <div class="detail-item">
                        <span>⏱️</span>
                        <span>${course.duration}</span>
                    </div>
                    <div class="detail-item">
                        <span>📊</span>
                        <span>${course.level}</span>
                    </div>
                    <div class="detail-item">
                        <span>📅</span>
                        <span>${course.date}</span>
                    </div>
                </div>
                <div class="course-price">${course.price}</div>
                <button class="course-btn" onclick="scrollToAppointment('${course.title}')">Enroll Now</button>
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
}

// Populate products dynamically
function populateProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        productCard.innerHTML = `
            <div class="product-image">
                <span style="position: relative; z-index: 1;">${product.icon}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <a href="${product.link}" class="product-link">Learn More →</a>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Helper function to scroll to appointment section
function scrollToAppointment(courseName) {
    const appointmentSection = document.getElementById('appointment');
    const offset = 80;
    const targetPosition = appointmentSection.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Optionally pre-fill the appointment type
    setTimeout(() => {
        const appointmentType = document.getElementById('appointmentType');
        if (appointmentType) {
            appointmentType.value = 'course';
        }
    }, 500);
}

// Form handling
function initForms() {
    const appointmentForm = document.getElementById('appointmentForm');
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal');

    // Appointment form submission
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(appointmentForm);
        const data = Object.fromEntries(formData);
        
        console.log('Appointment Data:', data);
        
        // Show success modal
        showModal('Your appointment request has been submitted! We\'ll contact you within 24 hours to confirm.');
        
        // Reset form
        appointmentForm.reset();
    });

    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Contact Data:', data);
        
        // Show success modal
        showModal('Thank you for your message! We\'ll get back to you as soon as possible.');
        
        // Reset form
        contactForm.reset();
    });

    // Close modal handlers
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Show success modal
function showModal(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    
    modalMessage.textContent = message;
    modal.classList.add('active');
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        modal.classList.remove('active');
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.course-card, .product-card, .facility-card, .stat-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Set minimum date for appointment booking (today)
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}
