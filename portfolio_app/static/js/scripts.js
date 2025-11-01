// Initialize GSAP and its plugins
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Custom cursor with smoother animation
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;
        const cursorSpeed = 0.95; // Slightly reduced for smoother movement
        const followerSpeed = 0.12; // Slightly reduced for smoother movement

        // Optimize performance with gsap.quickSetter
        const cursorSet = {
            x: gsap.quickSetter(cursor, "x", "px"),
            y: gsap.quickSetter(cursor, "y", "px")
        };
        
        const followerSet = {
            x: gsap.quickSetter(follower, "x", "px"),
            y: gsap.quickSetter(follower, "y", "px")
        };

        // Handle mouse movement
        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Hide cursor when mouse leaves window
            if (cursor.style.opacity === "0") {
                gsap.to(cursor, { opacity: 1, duration: 0.3 });
                gsap.to(follower, { opacity: 1, duration: 0.3 });
            }
        });

        window.addEventListener("mouseout", () => {
            gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
        });

        // Smooth cursor animation
        gsap.ticker.add(() => {
            // Calculate new positions with easing
            cursorX += (mouseX - cursorX) * cursorSpeed;
            cursorY += (mouseY - cursorY) * cursorSpeed;
            
            followerX += (mouseX - followerX) * followerSpeed;
            followerY += (mouseY - followerY) * followerSpeed;

            // Update positions
            cursorSet.x(cursorX);
            cursorSet.y(cursorY);
            followerSet.x(followerX);
            followerSet.y(followerY);
        });
        
        // Interactive elements hover effect
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .certificate-card, input, textarea, select, .nav-link, .btn'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });

            // Prevent cursor flickering when hovering links
            el.addEventListener('mousemove', e => {
                e.stopPropagation();
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add active class to nav items on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        lastScrollTop = scrollTop;
    });

    // GSAP Scroll Animations
    const animateOnScroll = () => {
        // Hero section animations
        const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
        const heroTimeline = gsap.timeline({
            defaults: {
                ease: "expo.out",
                duration: 0.8
            }
        });

        // Animate hero elements sequentially
        heroElements.forEach((element, index) => {
            const delay = index * 0.15; // Reduced delay for smoother sequence
            
            if (element.classList.contains('reveal-from-left')) {
                heroTimeline.from(element, {
                    x: -50, // Reduced distance for smoother animation
                    opacity: 0,
                    delay: delay
                }, index > 0 ? "-=0.3" : 0);
            } else if (element.classList.contains('reveal-from-right')) {
                heroTimeline.from(element, {
                    x: 50, // Reduced distance for smoother animation
                    opacity: 0,
                    delay: delay
                }, index > 0 ? "-=0.3" : 0);
            } else {
                heroTimeline.from(element, {
                    y: 30, // Reduced distance for smoother animation
                    opacity: 0,
                    delay: delay
                }, index > 0 ? "-=0.3" : 0);
            }
        });

        // Initialize ScrollTrigger for hero section
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top center",
            onEnter: () => heroTimeline.play(),
            onLeaveBack: () => heroTimeline.reverse()
        });

        // Fade up animation for other elements
        gsap.utils.toArray('.animate-on-scroll:not(.hero .animate-on-scroll)').forEach(element => {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Reveal from left animation
        gsap.utils.toArray('.reveal-from-left').forEach(element => {
            gsap.from(element, {
                x: -100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Reveal from right animation
        gsap.utils.toArray('.reveal-from-right').forEach(element => {
            gsap.from(element, {
                x: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse"
                }
            });
        });
    };

    // Initialize scroll animations
    animateOnScroll();

    // Project card animations
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        // Initial animation when the card comes into view
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            }
        });

        // Hover animations
        const image = card.querySelector('.project-image');
        const content = card.querySelector('.project-content');
        const techStack = card.querySelector('.tech-stack');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            });
            if (image) {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
            gsap.to(content, {
                y: -5,
                duration: 0.4,
                ease: "power2.out"
            });
            if (techStack) {
                gsap.from(techStack.children, {
                    y: 10,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
            gsap.to(content, {
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            });
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        });
    }

    // Alert animations
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        gsap.from(alert, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out"
        });
        
        setTimeout(() => {
            gsap.to(alert, {
                y: -20,
                opacity: 0,
                duration: 0.5,
                ease: "power3.in",
                onComplete: () => alert.remove()
            });
        }, 5000);
    });
});