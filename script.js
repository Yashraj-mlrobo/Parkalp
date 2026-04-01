// script.js

// --- Theme Toggle Logic (Avoid FOUC) ---
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// Default to light, but respect saved preference
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle Button Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = themeToggleBtn?.querySelector('.toggle-icon');
    
    // Initialize Icon
    if (toggleIcon) {
        toggleIcon.textContent = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
    }

    themeToggleBtn?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (toggleIcon) {
            toggleIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    });
    
    // --- Custom Cursor / Robot Follower ---
    const robot = document.getElementById('cursor-robot');
    const dot = document.getElementById('cursor-dot');
    const line = document.getElementById('cursor-line');

    // Target positions based on mouse movement
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    
    // Current positions for smooth interpolation (lerp)
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Lerp function for smooth animation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Animation Loop
    function animate() {
        // Linear interpolation factor for the robot follower
        currentX = lerp(currentX, targetX, 0.15);
        currentY = lerp(currentY, targetY, 0.15);

        // Instantly place the dot at the target cursor location
        if (dot) {
            dot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`;
        }

        // Update the robot's delayed position via transform
        if (robot) {
            robot.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
        }

        // Update the connecting line
        if (line) {
            const dx = currentX - targetX;
            const dy = currentY - targetY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            line.style.width = `${distance}px`;
            line.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${angle}deg)`;

            // Fade out line if the cursor is perfectly still
            if (distance < 2) {
                line.style.opacity = '0';
            } else {
                line.style.opacity = '0.6';
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Start animation loop
    animate();

    // Hide/show cursor elements when mouse leaves/enters window
    document.documentElement.addEventListener('mouseleave', () => {
        if (robot) robot.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
        if (line) line.style.opacity = '0';
    });
    
    document.documentElement.addEventListener('mouseenter', () => {
        if (robot) robot.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
    });

    // --- Hover effects for interactive elements ---
    const interactiveElements = document.querySelectorAll('a, button, .group, .bg-surface-container, .bg-surface-container-highest');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (robot) robot.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scale(1.5)`;
            if (dot) dot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%)) scale(2)`;
        });
        el.addEventListener('mouseleave', () => {
            if (robot) robot.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%)) scale(1)`;
            if (dot) dot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%)) scale(1)`;
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

});
