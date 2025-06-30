document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen DOM yang dibutuhkan
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- Fungsi Dark Mode Toggle yang BARU untuk tombol 'darkModeToggle' mengambang (hanya ini yang tersisa) ---
    const floatingDarkModeToggle = document.getElementById('darkModeToggle'); // Mengambil tombol mengambang

    // Fungsi untuk memperbarui ikon tombol dark mode mengambang saja
    const syncFloatingDarkModeToggle = () => {
        if (floatingDarkModeToggle) {
            if (body.classList.contains('dark-mode')) {
                floatingDarkModeToggle.innerHTML = '☀️'; // Sun emoji
            } else {
                floatingDarkModeToggle.innerHTML = '🌙'; // Moon emoji
            }
        }
    };

    // Inisialisasi status tema dan ikon saat dimuat
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.className = currentTheme;
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    }
    syncFloatingDarkModeToggle(); // Panggil untuk memastikan ikon floating toggle benar saat load

    // Event listener untuk tombol dark mode mengambang
    if (floatingDarkModeToggle) {
        floatingDarkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            syncFloatingDarkModeToggle(); // Sinkronkan ikon setelah perubahan tema
        });
    }

    // --- Navbar fixed and scroll effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust for fixed navbar height if necessary
            if (pageYOffset >= sectionTop - navbar.clientHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate offset considering fixed navbar
                const offsetTop = targetSection.offsetTop - navbar.clientHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // --- BAGIAN YANG DITAMBAHKAN UNTUK MENAMBAHKAN HASH KE URL ---
                history.pushState(null, '', `#${targetId}`);
                // --- AKHIR BAGIAN YANG DITAMBAHKAN ---

                // Close mobile menu after clicking a link
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                // Update active class immediately for smooth scroll
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- Navbar Hamburger (Mobile Menu) ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close nav menu when a link is clicked (for mobile)
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Set initial active link based on current section on load
    function setActiveNavLink() {
        let currentActive = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100; // Adjusted for padding
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('resize', setActiveNavLink); // Recalculate on resize
    setActiveNavLink(); // Call on initial load

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item');

    const appearOptions = {
        threshold: 0.3, // Percentage of element visible to trigger
        rootMargin: "0px 0px -100px 0px" // Adjust to trigger earlier/later
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('animate-slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('animate-slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('animate-fade-in-up')) {
                    entry.target.style.opacity = 1;
                }
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Modal Image Gallery
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "flex"; // Use flex to center
            modalImg.src = this.getAttribute('data-src');
            captionText.innerHTML = this.getAttribute('data-caption');
        });
    });

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});