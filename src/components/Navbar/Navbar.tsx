"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { X, Menu, Sun, Moon } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { getLenis } from '../../hooks/useLenis';
import './Navbar.css';

/* ── Lamp transition overlay ── */
function triggerLampTransition(originX: number, originY: number, toLight: boolean, onThemeApply: () => void) {
  const existing = document.getElementById('lamp-overlay');
  if (existing) { existing.remove(); }

  const overlay = document.createElement('div');
  overlay.id = 'lamp-overlay';

  const maxRadius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  ) * 1.2;

  // Warm lamp-on glow for light; deep dark for switching off
  const bg = toLight
    ? `radial-gradient(circle at ${originX}px ${originY}px, #fffbeb 0%, #fef3c7 30%, #f8fafc 70%)`
    : '#020509';

  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    pointerEvents: 'none',
    background: bg,
    clipPath: `circle(0px at ${originX}px ${originY}px)`,
    opacity: '1',
  });

  document.body.appendChild(overlay);

  // Phase 1: Expand overlay from button outward to cover entire screen
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'clip-path 0.48s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.clipPath = `circle(${maxRadius}px at ${originX}px ${originY}px)`;

      // Phase 2: Screen is fully covered — swap theme invisibly
      setTimeout(() => {
        onThemeApply();

        // Phase 3: Fade overlay out, revealing the new theme beneath
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 340);
      }, 500);
    });
  });
}

const navLinks = [
  { href: '#home',         label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#skills',       label: 'Skills' },
  { href: '#projects',     label: 'Projects' },
  { href: '#achievements', label: 'Awards' },
  { href: '#contact',      label: 'Contact' },
];

const Navbar = ({ info }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const toLight = newTheme === 'light';

    // Get button centre as animation origin
    const btn = themeBtnRef.current;
    const rect = btn ? btn.getBoundingClientRect() : null;
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    triggerLampTransition(originX, originY, toLight, () => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  };
  const [active, setActive] = useState('#home');
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const brandName = info?.name || 'Sivaprakash';
  const isScrollingRef = useRef(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);


  // Scroll listener - handles scrolled state, progress bar, and Scroll Spy!
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // 1. Update scrolled state
          const shouldScroll = scrollY > 60;
          setScrolled(prev => prev !== shouldScroll ? shouldScroll : prev);

          // 2. Scroll progress bar update (direct DOM)
          if (scrollProgressRef.current) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const pct = total > 0 ? Math.min((scrollY / total) * 100, 100) : 0;
            scrollProgressRef.current.style.width = `${pct}%`;
          }

          // 3. Bulletproof Scroll Spy (updates active section)
          if (!isScrollingRef.current) {
            const middle = window.innerHeight / 3; // Trigger when top of section hits top 33% of screen
            let currentActive = '';
            let minDistance = Infinity;

            navLinks.forEach(link => {
              const el = document.querySelector(link.href);
              if (el) {
                const rect = el.getBoundingClientRect();
                // Check if the section covers the "middle" trigger line
                if (rect.top <= middle && rect.bottom >= middle) {
                  currentActive = link.href;
                } else if (currentActive === '' && Math.abs(rect.top - middle) < minDistance) {
                  // Fallback: closest section to the trigger line
                  minDistance = Math.abs(rect.top - middle);
                  currentActive = link.href;
                }
              }
            });

            if (currentActive) {
              setActive(prev => (prev !== currentActive ? currentActive : prev));
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount to set initial state
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    setActive(href);
    isScrollingRef.current = true;

    const failsafe = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1500);

    const resetScrollLock = () => {
      clearTimeout(failsafe);
      setTimeout(() => { isScrollingRef.current = false; }, 100);
    };

    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(href, { offset: -30, onComplete: resetScrollLock });
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
          setTimeout(resetScrollLock, 800);
        }
      }, 150);
    } else {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(href, { offset: -30, onComplete: resetScrollLock });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(resetScrollLock, 800);
      }
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner" ref={navRef}>
          
          {/* Scroll progress bar attached to bottom of capsule */}
          <div className="navbar__progress-wrapper">
            <div ref={scrollProgressRef} id="scroll-progress" />
          </div>


          {/* Brand */}
          <a
            className="navbar__brand"
            onClick={() => handleNav('#home')}
            aria-label={`${brandName} — Go to home`}
            role="link"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleNav('#home')}
          >
            <div className="navbar__logo-wrap">
              <img
                src={logoImg.src}
                alt={`${brandName} — Portfolio Logo`}
                className="navbar__logo-img"
                width={36}
                height={36}
              />
              <div className="navbar__logo-glow" />
            </div>
            <span className="navbar__brand-name">{brandName}</span>
          </a>

          {/* Desktop links */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  className={`navbar__link ${active === link.href ? 'active' : ''}`}
                  onClick={() => handleNav(link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Status dot + CTA */}
          <div className="navbar__actions">
            <button
              ref={themeBtnRef}
              className="icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'dark' ? <Sun key="sun" size={20} /> : <Moon key="moon" size={20} />}
            </button>
            <a
              href={`mailto:${info?.email || ''}`}
              className="btn btn-primary btn-sm navbar__cta"
              aria-label={`Hire ${brandName} — Send an email`}
            >
              Hire Me
            </a>
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X key="close" size={20} /> : <Menu key="open" size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0px at calc(100% - 40px) 40px)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)', opacity: 1 }}
            exit={{ clipPath: 'circle(0px at calc(100% - 40px) 40px)', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >

            <ul className="mobile-menu__links">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <a
                    className={`mobile-menu__link ${active === link.href ? 'active' : ''}`}
                    onClick={() => handleNav(link.href)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mobile-menu__footer">
              <div className="navbar__status">
                <span className="status-dot" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Open to opportunities</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
