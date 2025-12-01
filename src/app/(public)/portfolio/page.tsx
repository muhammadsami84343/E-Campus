'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import './portfolio.css';

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const statsRef = useRef<HTMLElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate on scroll
  useEffect(() => {
    const aosObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      aosObserver.observe(el);
    });

    return () => aosObserver.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    const animateCounter = (element: Element) => {
      const target = parseInt(element.getAttribute('data-count') || '0', 10);
      const duration = 2000;
      const stepTime = Math.max(15, Math.floor(duration / target));
      let current = 0;

      const timer = setInterval(() => {
        current += Math.ceil(target / 100);
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent =
          element.getAttribute('data-count') === '99'
            ? current + '%'
            : current.toLocaleString();
      }, stepTime);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            entry.target.querySelectorAll('.counter').forEach(animateCounter);
            setStatsAnimated(true);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => statsObserver.disconnect();
  }, [statsAnimated]);

  // Active section observer
  useEffect(() => {
    const sections = ['home', 'academics', 'noticeboard', 'about', 'contact'];
    
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) activeObserver.observe(element);
    });

    return () => activeObserver.disconnect();
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Newsletter subscription
  const handleNewsletter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const emailInput = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
    const email = emailInput?.value || '';
    
    if (email && email.includes('@')) {
      (e.target as HTMLButtonElement).textContent = 'Subscribed!';
      (e.target as HTMLButtonElement).style.background = '#28a745';
      setTimeout(() => {
        (e.target as HTMLButtonElement).textContent = 'Subscribe';
        (e.target as HTMLButtonElement).style.background = '';
        emailInput.value = '';
      }, 2000);
    } else {
      alert('Please enter a valid email address');
    }
  };

  return (
    <div className="portfolio-page">
      <div className="bg-animation"></div>

      {/* Header */}
      <header id="header" className={isScrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="header-content">
            <a href="#home" className="logo" aria-label="eCampus">
              <img src="/assets/Designer.png" alt="Institute Logo" style={{ width: 'auto', height: '40px' }} />
            </a>

            <nav>
              <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                <li>
                  <a href="#home" className={activeSection === 'home' ? 'active' : ''}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#academics" className={activeSection === 'academics' ? 'active' : ''}>
                    Academics
                  </a>
                </li>
                <li>
                  <a href="#noticeboard" className={activeSection === 'noticeboard' ? 'active' : ''}>
                    Noticeboard
                  </a>
                </li>
                <li>
                  <a href="#about" className={activeSection === 'about' ? 'active' : ''}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                className="mobile-menu-btn"
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
              <Link href="/login" className="cta-button">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Welcome to <span className="highlight">eCampus Education System</span>
              </h1>
              <p>
                Where curiosity meets excellence. We nurture values, creativity, and leadership
                through a supportive academic environment and vibrant campus life.
              </p>
              <div className="hero-buttons">
                <a href="#academics" className="btn-primary">
                  Explore Academics
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="feature-cards">
                <div className="feature-card">
                  <i className="fas fa-chalkboard-user"></i>
                  <h3>Experienced Faculty</h3>
                  <p>Dedicated teachers guiding students to reach their full potential.</p>
                </div>
                <div className="feature-card">
                  <i className="fas fa-flask"></i>
                  <h3>Modern Labs & Library</h3>
                  <p>Hands-on learning with well-equipped labs and rich library resources.</p>
                </div>
                <div className="feature-card">
                  <i className="fas fa-seedling"></i>
                  <h3>Holistic Development</h3>
                  <p>Focus on academics, character, arts, and community engagement.</p>
                </div>
                <div className="feature-card">
                  <i className="fas fa-shield-halved"></i>
                  <h3>Safe, Inclusive Campus</h3>
                  <p>A welcoming environment that respects diversity and well-being.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academics */}
      <section id="academics" className="services animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>Academics</h2>
            <p>
              Programs and experiences designed to build strong foundations, critical thinking, and
              creativity.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="icon">
                <i className="fas fa-atom"></i>
              </div>
              <h3>Science & Technology</h3>
              <p>
                Inquiry-based learning across Physics, Chemistry, Biology, Computer Science, and
                Robotics.
              </p>
            </div>
            <div className="service-card">
              <div className="icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>Arts & Humanities</h3>
              <p>
                Language, literature, social sciences, and arts to broaden perspectives and
                expression.
              </p>
            </div>
            <div className="service-card">
              <div className="icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h3>Core Curriculum</h3>
              <p>
                Balanced curriculum emphasizing literacy, numeracy, and real-world problem solving.
              </p>
            </div>
            <div className="service-card">
              <div className="icon">
                <i className="fas fa-person-running"></i>
              </div>
              <h3>Sports & Co‑curricular</h3>
              <p>
                Opportunities in sports, clubs, debate, and music to build confidence and teamwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Noticeboard */}
      <section id="noticeboard" className="noticeboard animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>Noticeboard</h2>
            <p>Latest announcements and important dates for students, parents, and staff.</p>
          </div>
          <div className="notice-grid">
            <div className="notice-card">
              <div className="notice-meta">
                <i className="fas fa-calendar"></i> 15 Oct 2025
              </div>
              <h4>Parent-Teacher Meetings</h4>
              <p>PTMs for Grades 6–10 will be held next week. Timetables have been emailed.</p>
              <a href="#">Read more</a>
            </div>
            <div className="notice-card">
              <div className="notice-meta">
                <i className="fas fa-bullhorn"></i> 10 Oct 2025
              </div>
              <h4>Midterm Exam Schedule</h4>
              <p>Midterm exams begin 24 Oct. Detailed schedule is available on the portal.</p>
              <a href="#">View schedule</a>
            </div>
            <div className="notice-card">
              <div className="notice-meta">
                <i className="fas fa-file-alt"></i> 07 Oct 2025
              </div>
              <h4>Clubs & Societies Registration</h4>
              <p>Registrations are open for Debate, Robotics, Music, and Sports clubs.</p>
              <a href="#">Register now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="counter" data-count="1500">
                0
              </h3>
              <p>Students</p>
            </div>
            <div className="stat-item">
              <h3 className="counter" data-count="120">
                0
              </h3>
              <p>Faculty Members</p>
            </div>
            <div className="stat-item">
              <h3 className="counter" data-count="99">
                0
              </h3>
              <p>Pass Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2>About Us</h2>
            <p>
              eCampus is committed to inclusive, student-centered education built on excellence,
              integrity, and service.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>
                To inspire lifelong learning and empower students to thrive academically and
                personally.
              </p>
              <ul>
                <li>Student-centered teaching</li>
                <li>Inclusive and supportive culture</li>
                <li>Community involvement</li>
              </ul>
            </div>
            <div className="about-card">
              <h3>Our Values</h3>
              <p>
                We believe in curiosity, collaboration, respect, and responsibility as the
                foundation of a thriving community.
              </p>
              <ul>
                <li>Academic excellence</li>
                <li>Character and leadership</li>
                <li>Innovation and growth</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Contact) */}
      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About eCampus</h3>
              <p>
                We foster a positive, inclusive, and supportive learning environment where every
                student has the opportunity to achieve their full potential.
              </p>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#academics">Academics</a>
                </li>
                <li>
                  <a href="#noticeboard">Noticeboard</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact</h3>
              <p>
                <i className="fas fa-map-marker-alt"></i> 38D, LDA Avenue Lahore
              </p>
              <p>
                <i className="fab fa-whatsapp"></i> (0333)-0000000
                <br />
                <i className="fas fa-phone"></i> (042) 37113344
                <br />
                <i className="fas fa-envelope"></i> info@ecampus.com
              </p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Newsletter</h3>
              <p>Stay updated with campus news and events.</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button className="newsletter-btn" onClick={handleNewsletter}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              &copy; 2025 eCampus — All rights reserved. | Designed with ❤️ for eCampus
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <button
        className={`scroll-top ${showScrollTop ? 'show' : ''}`}
        id="scrollTop"
        aria-label="Scroll to top"
        onClick={scrollToTop}
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
}
