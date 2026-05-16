/*
========================================================================
PROJECT: Electronics Lab Kit - Interactive System Controller (MOBILE OPTIMIZED)
ENGINE: HTML5 Canvas + Intersection Observers + Cursor Interceptors
========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Asynchronous System Loader Management
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.visibility = "hidden", 500);
        }, 600);
    });

    // 2. Hardware Canvas Particle Ecosystem Initialization
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    let pxRatio = window.devicePixelRatio || 1;
    function sizeCanvas() {
        canvas.width = window.innerWidth * pxRatio;
        canvas.height = window.innerHeight * pxRatio;
        ctx.scale(pxRatio, pxRatio);
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // تقليل عدد الجزيئات على الهواتف
    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 30 : 65;
    const particlePool = [];

    class MatrixNode {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vX = (Math.random() - 0.5) * 0.4;
            this.vY = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.pulseSeed = Math.random() * 100;
        }
        update() {
            this.x += this.vX;
            this.y += this.vY;
            this.pulseSeed += 0.02;

            if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
                this.reset();
            }
        }
        draw() {
            let opacity = 0.15 + Math.abs(Math.sin(this.pulseSeed)) * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particlePool.push(new MatrixNode());
    }

    function processNetworkFrame() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        for (let i = 0; i < particlePool.length; i++) {
            particlePool[i].update();
            particlePool[i].draw();

            // تقليل المسافة والخطوط على الهواتف
            const connectionDistance = isMobile ? 80 : 110;
            const connectionOpacity = isMobile ? 0.05 : 0.08;
            
            for (let j = i + 1; j < particlePool.length; j++) {
                const dist = Math.hypot(particlePool[i].x - particlePool[j].x, particlePool[i].y - particlePool[j].y);
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particlePool[i].x, particlePool[i].y);
                    ctx.lineTo(particlePool[j].x, particlePool[j].y);
                    ctx.strokeStyle = `rgba(176, 38, 255, ${connectionOpacity * (1 - dist / connectionDistance)})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(processNetworkFrame);
    }
    processNetworkFrame();

    // 3. Custom Glow Cursor Vector Trailing (deactivate on mobile)
    if (!isMobile) {
        const cursor = document.querySelector(".custom-cursor");
        const cursorDot = document.querySelector(".custom-cursor-dot");

        document.addEventListener("mousemove", (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });

        const focalElements = document.querySelectorAll("a, .glass-card, .feature-card, button, .gallery-item");
        focalElements.forEach(item => {
            item.addEventListener("mouseenter", () => {
                cursor.style.width = "50px";
                cursor.style.height = "50px";
                cursor.style.backgroundColor = "rgba(0, 243, 255, 0.05)";
                cursor.style.borderColor = "#b026ff";
            });
            item.addEventListener("mouseleave", () => {
                cursor.style.width = "35px";
                cursor.style.height = "35px";
                cursor.style.backgroundColor = "transparent";
                cursor.style.borderColor = "#00f3ff";
            });
        });
    }

    // 4. Mobile System Nav Architecture Navigation Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenu) {
        mobileMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileMenu.classList.toggle("open");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                mobileMenu.classList.remove("open");
            });
        });
    }

    // 5. Scroll Reveal Engine (Intersection Observers)
    const revealNodes = document.querySelectorAll(".scroll-reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealNodes.forEach(node => revealObserver.observe(node));

    // 6. Media Gallery Lightbox Core Logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.querySelector(".lightbox-close");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener("click", () => {
                const highResSource = item.getAttribute("data-src");
                const description = item.querySelector("img").getAttribute("alt");
                lightbox.style.display = "block";
                lightboxImg.src = highResSource;
                document.getElementById("lightboxCaption").innerText = description;
                document.body.style.overflow = "hidden";
            });
        });

        lightboxClose.addEventListener("click", () => {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // Gallery Modal Logic
    const modal = document.getElementById("galleryModal");
    const btn = document.getElementById("openGalleryBtn");
    const span = document.getElementsByClassName("close-modal")[0];

    if (btn && modal && span) {
        btn.onclick = function() {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }

        span.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }
    }

    // 7. Dynamic SVG Setup for Node Diagrams
    const svgOverlay = document.querySelector(".diagram-lines");
    if(svgOverlay) {
        svgOverlay.innerHTML += `
            <defs>
                <linearGradient id="cyan-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f3ff" />
                    <stop offset="100%" stop-color="#b026ff" />
                </linearGradient>
            </defs>
        `;
    }

    // Performance optimization: disable animations on low-end devices
    if (!isMobile) {
        document.body.style.setProperty('--transition-smooth', 'cubic-bezier(0.4, 0, 0.2, 1)');
    }
});
