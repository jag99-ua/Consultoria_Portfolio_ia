/* ============================================
   INTERACTIVE SCRIPTS — Javier Arribas
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Language Setup
  const langEnBtn = document.getElementById("lang-en");
  const langEsBtn = document.getElementById("lang-es");
  
  function applyLanguage(lang) {
    if (!translations[lang]) return;
    const t = translations[lang];
    
    for (const selector in t) {
      if (selector === "title") {
        document.title = t[selector];
      } else if (selector.startsWith("meta")) {
        const metaEl = document.querySelector(selector);
        if (metaEl) metaEl.setAttribute("content", t[selector]);
      } else {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.setAttribute("placeholder", t[selector]);
          } else {
            el.innerHTML = t[selector];
          }
        });
      }
    }
    
    // Re-render icons if any nested HTML changed
    lucide.createIcons();
    
    // Update active state
    if (lang === 'en') {
      langEnBtn.classList.add('active');
      langEsBtn.classList.remove('active');
    } else {
      langEsBtn.classList.add('active');
      langEnBtn.classList.remove('active');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  // Set default to English initially
  applyLanguage('en');

  langEnBtn.addEventListener("click", () => applyLanguage('en'));
  langEsBtn.addEventListener("click", () => applyLanguage('es'));

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) toggleMenu();
    });
  });

  // --- Smooth scroll for anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Reveal-on-scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Typing effect on terminal lines ---
  const terminalLines = document.querySelectorAll('.terminal-line');
  if (terminalLines.length) {
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateTerminal(terminalLines);
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminalLines[0].closest('.terminal'));
  }

  function animateTerminal(lines) {
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(8px)';
      line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        line.style.opacity = '0.6';
        line.style.transform = 'translateY(0)';
      }, 200 + i * 180);
    });
  }

  // --- Counter animation for hero stats ---
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }

  function animateCounters() {
    const numbers = document.querySelectorAll('.hero-stat .number');
    numbers.forEach(num => {
      const text = num.textContent;
      // Only animate numbers, not symbols
      const match = text.match(/^(\d+)/);
      if (match) {
        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '');
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          num.innerHTML = current + suffix.replace('+', '<span>+</span>').replace('x', '<span>x</span>');
        }, 40);
      }
    });
  }

  // --- Parallax effect on hero glows ---
  const heroGlow  = document.querySelector('.hero-glow');
  const heroGlow2 = document.querySelector('.hero-glow-2');

  if (heroGlow && heroGlow2) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      heroGlow.style.transform  = `translate(${x * 20}px, ${y * 15}px)`;
      heroGlow2.style.transform = `translate(${-x * 15}px, ${-y * 10}px)`;
    }, { passive: true });
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--clr-white)';
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
