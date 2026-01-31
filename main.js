

document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS is available and initialize
    if (typeof AOS !== 'undefined') {
        // Initialize AOS with enhanced settings
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            delay: 0,
            anchorPlacement: 'top-bottom'
        });
        
        console.log('AOS initialized successfully');
        
        // Refresh AOS after dynamic content loads
        setTimeout(() => {
            AOS.refresh();
            console.log('AOS refreshed');
        }, 100);
    } else {
        console.warn('AOS library not loaded - using fallback animations');
        // Fallback animation for elements with data-aos
        const observeElements = () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
        };
        
        observeElements();
    }
    
    // Initialize Swiper with error handling
    const initializeSwiper = () => {
        const testimonialSlider = document.querySelector('.testimonials-slider');
        if (testimonialSlider && typeof Swiper !== 'undefined') {
            try {
                new Swiper('.testimonials-slider', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 1,
                            spaceBetween: 40
                        },
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 50
                        }
                    }
                });
                console.log('Swiper initialized successfully');
            } catch (error) {
                console.warn('Swiper initialization failed:', error);
            }
        } else {
            console.warn('Swiper library not available or testimonial slider not found');
        }
    };
    
    // Initialize Swiper after DOM is ready
    setTimeout(initializeSwiper, 100);

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Enhanced Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (navToggle && navMenu && sidebarOverlay) {
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            // Toggle sidebar
            navMenu.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Close sidebar when clicking on overlay
            if (!isActive) {
                sidebarOverlay.addEventListener('click', closeSidebar);
            } else {
                sidebarOverlay.removeEventListener('click', closeSidebar);
            }
        });
        
        // Close sidebar function
        function closeSidebar() {
            navMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            navToggle.classList.remove('active');
            sidebarOverlay.removeEventListener('click', closeSidebar);
        }
        
        // Close sidebar when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeSidebar();
            });
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeSidebar();
            }
        });
    }

    // Enhanced Navigation with Fluid Active Pill
    const initFluidNavigation = () => {
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!navMenu || navLinks.length === 0) return;
        
        // Create fluid pill trace indicator
        const pillTrace = document.createElement('div');
        pillTrace.className = 'nav-pill-trace';
        navMenu.appendChild(pillTrace);
        
        // Update pill position and size
        const updatePillTrace = (targetLink) => {
            if (!targetLink || !pillTrace) return;
            
            const menuRect = navMenu.getBoundingClientRect();
            const linkRect = targetLink.getBoundingClientRect();
            
            // Calculate position relative to nav menu
            const left = linkRect.left - menuRect.left;
            const width = linkRect.width;
            
            // Apply styles with smooth transition
            pillTrace.style.left = `${left}px`;
            pillTrace.style.width = `${width}px`;
        };
        
        // Initialize with active link
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            updatePillTrace(activeLink);
        } else {
            // Hide pill initially if no active link
            pillTrace.style.opacity = '0';
        }
        
        // Handle link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show and update pill trace
                pillTrace.style.opacity = '0.9';
                updatePillTrace(this);
            });
        });
        
        // Handle window resize
        const handleResize = () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                updatePillTrace(activeLink);
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Handle scroll to update active section
        const updateActiveNav = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollY = window.pageYOffset;
            
            let current = '';
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    updatePillTrace(link);
                }
            });
        };
        
        // Update active nav on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Initial call
        updateActiveNav();
    };
    
    initFluidNavigation();

    // Active Navigation Link
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function setActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const bars = navToggle.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            const isDarkTheme = document.body.classList.contains('dark-theme');
            if (isDarkTheme) {
                navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            }
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = '';
            navbar.style.boxShadow = 'none';
        }
    });

    // Typing Animation for Hero Subtitle
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = ['Software Developer', 'Full-Stack Engineer', 'Problem Solver', 'Tech Enthusiast'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before new word
            }

            setTimeout(typeText, typingSpeed);
        }

        typeText();
    }

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Testimonials Slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        const swiper = new Swiper(testimonialSlider, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show success message (in production, you'd send to a server)
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Email Validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = '#27ae60';
                break;
            case 'error':
                notification.style.background = '#e74c3c';
                break;
            default:
                notification.style.background = '#3498db';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('::before');
            if (parallax) {
                const speed = 0.5;
                heroSection.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    }

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const countUp = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(countUp, 1);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Trigger counter animation when in viewport
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Skill Bar Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Portfolio Lightbox
    const portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    portfolioImages.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;
            
            const imgElement = lightbox.querySelector('img');
            imgElement.style.cssText = `
                width: 100%;
                height: auto;
                border-radius: 8px;
            `;
            
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
            `;
            
            document.body.appendChild(lightbox);
            
            // Animate in
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            // Close handlers
            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.remove();
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
        
        // Add cursor pointer
        img.style.cursor = 'pointer';
    });

    // Download CV Button
    const downloadCVBtn = document.querySelector('.download-cv');
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In production, this would link to an actual CV file
            showNotification('CV download started!', 'success');
        });
    }

    
    // Performance optimization - Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll events
    const debouncedSetActiveNav = debounce(setActiveNav, 100);
    const debouncedRevealOnScroll = debounce(revealOnScroll, 100);

    window.removeEventListener('scroll', setActiveNav);
    window.removeEventListener('scroll', revealOnScroll);
    window.addEventListener('scroll', debouncedSetActiveNav);
    window.addEventListener('scroll', debouncedRevealOnScroll);

    // Counter Animation for Hero Stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-count');
                const currentText = counter.innerText;
                const currentNum = +currentText.replace('+', '');
                const time = value / speed;
                
                if (currentNum < value) {
                    counter.innerText = Math.ceil(currentNum + time) + '+';
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value + '+';
                }
            }
            
            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    };
    
    animateCounters();
    
    // Smooth Scroll for Scroll Indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // CV Download Handler
    const cvDownload = document.getElementById('cv-download');
    if (cvDownload) {
        cvDownload.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('CV download started!', 'success');
            // In production, this would link to an actual CV file
        });
    }

    // Enhanced Cursor Glow Effect
    const createCursorGlow = () => {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Add active class on click
        document.addEventListener('mousedown', () => cursor.classList.add('active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('active'));
    };
    
    createCursorGlow();
    
    // Enhanced Scroll Animations
    const observeElements = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
            observer.observe(el);
        });
    };
    
    observeElements();
    
    // Enhanced Parallax Effect
    const createParallax = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', updateParallax);
        updateParallax();
    };
    
    createParallax();
    
    // Enhanced Loading States
    const enhanceButtons = () => {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (!this.classList.contains('no-loading')) {
                    const originalContent = this.innerHTML;
                    this.innerHTML = `
                        <div class="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    `;
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = originalContent;
                        this.disabled = false;
                    }, 2000);
                }
            });
        });
    };
    
    enhanceButtons();
    
    // Enhanced Tooltips
    const enhanceTooltips = () => {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = this.getAttribute('data-tooltip');
                // Tooltip is handled by CSS
            });
        });
    };
    
    enhanceTooltips();
    
    // Enhanced Form Interactions
    const enhanceForms = () => {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Add character counter for textareas
            if (input.tagName === 'TEXTAREA') {
                const counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-align: right;
                    margin-top: 0.5rem;
                `;
                input.parentElement.appendChild(counter);
                
                input.addEventListener('input', function() {
                    counter.textContent = `${this.value.length} characters`;
                });
            }
        });
    };
    
    enhanceForms();
    
    // Enhanced Smooth Scroll
    const enhanceSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    enhanceSmoothScroll();
    
    // Enhanced Page Load Animations
    const enhancePageLoad = () => {
        // Add staggered animations to elements
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Refresh AOS after page load to ensure all animations work
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        }
        
        // Remove preloader with enhanced animation
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Final AOS refresh after preloader is gone
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, 500);
            }, 1000);
        }
    };
    
    enhancePageLoad();
    
    // Enhanced Keyboard Navigation
    const enhanceKeyboardNav = () => {
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals or reset forms
            if (e.key === 'Escape') {
                // Close any open modals or overlays
                document.querySelectorAll('.modal.active, .overlay.active').forEach(el => {
                    el.classList.remove('active');
                });
            }
            
            // Tab key enhancement for better focus management
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    };
    
    enhanceKeyboardNav();
    
    // Enhanced Performance Monitoring
    const monitorPerformance = () => {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Add performance class based on load time
            if (loadTime < 1000) {
                document.body.classList.add('fast-load');
            } else if (loadTime < 3000) {
                document.body.classList.add('medium-load');
            } else {
                document.body.classList.add('slow-load');
            }
        });
    };
    
    monitorPerformance();

    // Portfolio Filtering
    const initPortfolioFilter = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    };
    
    initPortfolioFilter();
    
    // Portfolio Lightbox
    const openLightbox = (title, imageSrc) => {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'portfolio-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        lightbox.innerHTML = `
            <div class="lightbox-content" style="
                max-width: 90%;
                max-height: 90%;
                position: relative;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            ">
                <button class="lightbox-close" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                ">&times;</button>
                <img src="${imageSrc}" alt="${title}" style="
                    width: 100%;
                    height: auto;
                    border-radius: var(--border-radius-lg);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                ">
                <h3 style="
                    color: white;
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                ">${title}</h3>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Animate in
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
        }, 10);
        
        // Close on click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.style.opacity = '0';
                lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                }, 300);
            }
        });
        
        // Close on ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                lightbox.style.opacity = '0';
                lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                }, 300);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        
        document.addEventListener('keydown', handleEsc);
    };
    
    // Make openLightbox globally available
    window.openLightbox = openLightbox;
    
    // Download Portfolio function
    const downloadPortfolio = () => {
        showNotification('Portfolio download started!', 'success');
        // In production, this would trigger an actual download
        setTimeout(() => {
            showNotification('Portfolio PDF ready for download!', 'success');
        }, 2000);
    };
    
    // Make downloadPortfolio globally available
    window.downloadPortfolio = downloadPortfolio;

    // Contact Form Enhancement
    const initContactForm = () => {
        const contactForm = document.getElementById('contact-form');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        console.log('Initializing contact form...');
        
        // Character counter
        if (messageTextarea && charCount) {
            console.log('Character counter elements found');
            
            messageTextarea.addEventListener('input', () => {
                const length = messageTextarea.value.length;
                charCount.textContent = length;
                
                if (length > 500) {
                    charCount.style.color = '#e74c3c';
                    messageTextarea.value = messageTextarea.value.substring(0, 500);
                    charCount.textContent = 500;
                } else if (length > 400) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = 'var(--text-secondary)';
                }
            });
        } else {
            console.log('Character counter elements not found');
        }
        
        // Form submission
        if (contactForm) {
            console.log('Contact form found, adding submit handler');
            
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                console.log('Form data:', data);
                
                // Validate form
                if (!data.name || !data.email || !data.subject || !data.message) {
                    showNotification('Please fill in all required fields', 'error');
                    return;
                }
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        } else {
            console.log('Contact form not found');
        }
        
        // Test input functionality
        const inputs = contactForm?.querySelectorAll('input, textarea, select');
        if (inputs) {
            console.log(`Found ${inputs.length} form inputs`);
            inputs.forEach((input, index) => {
                console.log(`Input ${index}: ${input.name || input.id || input.type}`, input);
                input.addEventListener('focus', () => {
                    console.log(`Input focused: ${input.name || input.id || input.type}`);
                });
            });
        }
    };
    
    initContactForm();
    
    // Reset form function
    const resetForm = () => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.reset();
            document.getElementById('char-count').textContent = '0';
            showNotification('Form reset successfully', 'info');
        }
    };
    
    // Make resetForm globally available
    window.resetForm = resetForm;
    
    // Schedule call function
    const scheduleCall = () => {
        showNotification('Opening calendar scheduler...', 'success');
        // In production, this would open a calendar scheduling tool
        setTimeout(() => {
            showNotification('Calendar opened! Select your preferred time slot.', 'success');
        }, 1500);
    };
    
    // Make scheduleCall globally available
    window.scheduleCall = scheduleCall;
    
    // Open map function
    const openMap = () => {
        showNotification('Opening map location...', 'success');
        // In production, this would open Google Maps or similar
        setTimeout(() => {
            showNotification('Map opened with location details!', 'success');
        }, 1000);
    };
    
    // Make openMap globally available
    window.openMap = openMap;
    
    // Download CV function (enhanced version)
    const downloadCV = () => {
        showNotification('Preparing CV download...', 'success');
        
        // Create a simple CV content (in production, this would be a real PDF)
        const cvContent = `
IBRAHIM FONYUY - SOFTWARE DEVELOPER

=====================================
CONTACT INFORMATION
=====================================
Email: ibrahimfonyuy06@gmail.com
Phone: +237 677 020 718
Location: Bambili, Northwest Region, Cameroon
Portfolio: https://ibrahimfonyuy.com

=====================================
SUMMARY
=====================================
Experienced software developer specializing in Django, React, and Python.
Passionate about building scalable web applications and mobile solutions.

=====================================
SKILLS
=====================================
• Programming: Python, JavaScript, HTML5, CSS3
• Frameworks: Django, React, React Native, Node.js
• Databases: PostgreSQL, MongoDB, MySQL
• Tools: Git, Docker, AWS, Firebase
• Other: REST APIs, WebSocket, Agile/Scrum

=====================================
PROJECTS
=====================================
• E-Commerce Platform (Django, React, PostgreSQL)
• Mobile Banking App (React Native, Node.js, MongoDB)
• Task Management System (Django, JavaScript, WebSocket)
• Portfolio Website (React, Tailwind CSS, Framer Motion)

=====================================
EDUCATION
=====================================
• Bachelor's in Computer Science
• Various online certifications and courses

=====================================
CERTIFICATIONS
=====================================
• Django Web Development
• React Native Development
• Cloud Computing Fundamentals

Thank you for considering my application!
        `;
        
        // Create blob and download
        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Ibrahim_Fonyuy_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('CV downloaded successfully!', 'success');
    };
    
    // Make downloadCV globally available
    window.downloadCV = downloadCV;

    // Contact Options Click System
    const initContactOptions = () => {
        const optionCards = document.querySelectorAll('.option-card');
        const contactOptions = document.querySelector('.contact-options');
        const messageForm = document.getElementById('message-form');
        const scheduleForm = document.getElementById('schedule-form');
        
        console.log('Initializing contact options...');
        
        // Add click listeners to option cards (removed hover)
        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                const formType = card.getAttribute('data-form');
                showForm(formType);
            });
        });
        
        // Show form function
        const showForm = (formType) => {
            console.log(`Showing ${formType} form`);
            
            // Hide options with animation
            if (contactOptions) {
                contactOptions.style.opacity = '0';
                contactOptions.style.transform = 'translateY(-20px)';
                contactOptions.style.transition = 'all 0.3s ease';
            }
            
            // Show appropriate form after options fade out
            setTimeout(() => {
                if (contactOptions) {
                    contactOptions.style.display = 'none';
                }
                
                if (formType === 'message' && messageForm) {
                    messageForm.style.display = 'block';
                    messageForm.style.opacity = '0';
                    messageForm.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        messageForm.style.opacity = '1';
                        messageForm.style.transform = 'translateY(0)';
                        messageForm.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                } else if (formType === 'schedule' && scheduleForm) {
                    scheduleForm.style.display = 'block';
                    scheduleForm.style.opacity = '0';
                    scheduleForm.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        scheduleForm.style.opacity = '1';
                        scheduleForm.style.transform = 'translateY(0)';
                        scheduleForm.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                }
            }, 300);
        };
        
        // Make showForm globally available
        window.showForm = showForm;
    };
    
    // Hide forms function
    const hideForms = () => {
        console.log('Hiding forms, showing options');
        
        const contactOptions = document.querySelector('.contact-options');
        const messageForm = document.getElementById('message-form');
        const scheduleForm = document.getElementById('schedule-form');
        
        console.log('Elements found:', {
            contactOptions: !!contactOptions,
            messageForm: !!messageForm,
            scheduleForm: !!scheduleForm
        });
        
        // Hide forms with animation
        if (messageForm) {
            messageForm.style.opacity = '0';
            messageForm.style.transform = 'translateY(20px)';
        }
        
        if (scheduleForm) {
            scheduleForm.style.opacity = '0';
            scheduleForm.style.transform = 'translateY(20px)';
        }
        
        // Show options after forms fade out
        setTimeout(() => {
            if (messageForm) messageForm.style.display = 'none';
            if (scheduleForm) scheduleForm.style.display = 'none';
            
            if (contactOptions) {
                contactOptions.style.display = 'grid';
                contactOptions.style.opacity = '0';
                contactOptions.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    contactOptions.style.opacity = '1';
                    contactOptions.style.transform = 'translateY(0)';
                    contactOptions.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 50);
            }
        }, 300);
    };
    
    // Make hideForms globally available immediately
    window.hideForms = hideForms;
    
    // Also add a backup click handler for back buttons
    document.addEventListener('DOMContentLoaded', function() {
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Back button clicked via event listener');
                hideForms();
            });
        });
    });
    
    initContactOptions();

    // Enhanced Theme Toggle with Smooth Transition
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const themeOverlay = document.getElementById('theme-transition-overlay');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
        
        // Enhanced theme toggle function with transition effect
        window.toggleThemeWithEffect = () => {
            console.log('Theme toggle clicked');
            
            // Add transition class to body
            document.body.classList.add('theme-transitioning');
            
            // Add pulsing effect to toggle button
            if (themeToggle) {
                themeToggle.classList.add('pulsing');
            }
            
            // Create particles
            createThemeParticles();
            
            // Show transition overlay
            if (themeOverlay) {
                themeOverlay.classList.add('active');
            }
            
            // Toggle theme after overlay animation starts
            setTimeout(() => {
                const isDark = document.body.classList.contains('dark-theme');
                
                if (isDark) {
                    document.body.classList.remove('dark-theme');
                    if (themeIcon) {
                        themeIcon.classList.remove('fa-sun');
                        themeIcon.classList.add('fa-moon');
                    }
                    localStorage.setItem('theme', 'light');
                } else {
                    document.body.classList.add('dark-theme');
                    if (themeIcon) {
                        themeIcon.classList.remove('fa-moon');
                        themeIcon.classList.add('fa-sun');
                    }
                    localStorage.setItem('theme', 'dark');
                }
                
                // Update navbar background
                updateNavbarBackground();
                
                console.log('Theme changed to:', isDark ? 'light' : 'dark');
            }, 200);
            
            // Remove overlay and transition classes
            setTimeout(() => {
                if (themeOverlay) {
                    themeOverlay.classList.remove('active');
                }
                
                setTimeout(() => {
                    document.body.classList.remove('theme-transitioning');
                    
                    if (themeToggle) {
                        themeToggle.classList.remove('pulsing');
                        themeToggle.classList.add('glowing');
                        
                        setTimeout(() => {
                            themeToggle.classList.remove('glowing');
                        }, 300);
                    }
                }, 100);
            }, 800);
        };
        
        // Create theme transition particles
        const createThemeParticles = () => {
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'theme-particle';
                
                // Random starting position (top-left area)
                const startX = Math.random() * 200;
                const startY = Math.random() * 200;
                
                // Random ending position (bottom-right area)
                const endX = window.innerWidth - Math.random() * 200;
                const endY = window.innerHeight - Math.random() * 200;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                particle.style.setProperty('--tx', (endX - startX) + 'px');
                particle.style.setProperty('--ty', (endY - startY) + 'px');
                particle.style.animation = `particleFloat ${1 + Math.random() * 2}s ease-out`;
                particle.style.animationDelay = `${Math.random() * 0.5}s`;
                
                document.body.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }
        };
        
        // Update navbar background based on theme
        const updateNavbarBackground = () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                const isDark = document.body.classList.contains('dark-theme');
                if (isDark) {
                    navbar.style.background = 'rgba(26, 26, 46, 0.95)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            }
        };
        
        // Initialize navbar background
        updateNavbarBackground();
        
        // Add hover effects to theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('mouseenter', () => {
                themeToggle.classList.add('glowing');
            });
            
            themeToggle.addEventListener('mouseleave', () => {
                if (!themeToggle.classList.contains('pulsing')) {
                    themeToggle.classList.remove('glowing');
                }
            });
        }
    };
    
    initThemeToggle();

    console.log('Enhanced RahimStudios Portfolio Initialized Successfully! 🚀');
});
