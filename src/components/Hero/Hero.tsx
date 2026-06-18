"use client";
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import { Mail, ArrowDown, Download, FolderOpen } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { getLenis } from '../../hooks/useLenis';
import './Hero.css';

/* ─── Floating Tech Icon Definitions ─── */
const TECH_ICONS = [
  { label: 'React',     color: '#61DAFB', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { label: 'Node.js',   color: '#68A063', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { label: 'MongoDB',   color: '#47A248', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { label: 'Express',   color: '#FFFFFF', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { label: 'Python',    color: '#3776AB', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { label: 'MySQL',     color: '#4479A1', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { label: 'GitHub',    color: '#FFFFFF', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { label: 'TypeScript',color: '#3178C6', svg: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
];

const FLOAT_POSITIONS = [
  { top: '12%', left: '5%',  delay: 0,    duration: 6 },
  { top: '25%', left: '88%', delay: 1.2,  duration: 7 },
  { top: '55%', left: '3%',  delay: 0.5,  duration: 8 },
  { top: '70%', left: '92%', delay: 2,    duration: 6.5 },
  { top: '80%', left: '15%', delay: 1.5,  duration: 7.5 },
  { top: '15%', left: '75%', delay: 0.8,  duration: 5.5 },
  { top: '40%', left: '92%', delay: 2.5,  duration: 6.2 },
  { top: '88%', left: '80%', delay: 1.8,  duration: 7.8 },
];

const FloatingTechIcons = () => (
  <div className="hero__floats" aria-hidden="true">
    {TECH_ICONS.map((icon, i) => (
      <motion.div
        key={icon.label}
        className="hero__float-icon"
        style={{ top: FLOAT_POSITIONS[i].top, left: FLOAT_POSITIONS[i].left }}
        animate={{ y: [0, -18, 0], rotate: [0, 5, 0, -5, 0] }}
        transition={{
          duration: FLOAT_POSITIONS[i].duration,
          delay: FLOAT_POSITIONS[i].delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img src={icon.svg} alt={`${icon.label} logo`} loading="lazy" width={40} height={40} />
        <span className="hero__float-label">{icon.label}</span>
      </motion.div>
    ))}
  </div>
);

/* ─── Mouse-follow light blob ─── */
const MouseLight = () => {
  const blobRef = useRef<any>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<any>(null);

  useEffect(() => {
    // Start at center of screen to avoid abrupt jumps
    const initX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const initY = typeof window !== 'undefined' ? window.innerHeight / 2 : 500;
    mousePos.current = { x: initX, y: initY };
    currentPos.current = { x: initX, y: initY };

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      if (blobRef.current) {
        // Smooth linear interpolation (lerp)
        currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.08;
        currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.08;

        blobRef.current.style.transform = `translate3d(${currentPos.current.x - 300}px, ${currentPos.current.y - 300}px, 0)`;
      }
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <div ref={blobRef} className="hero__mouse-light" />;
};

/* ─── Hero Component ─── */
const Hero = ({ info, projects, skills, stats, projectsCount, commitsCount }) => {
  const typedRef = useRef(null);

  useEffect(() => {
    const strings = info?.typingTexts?.length
      ? info.typingTexts
      : ['Full Stack Developer', 'MERN Stack Developer', 'Software Engineer', 'AI Enthusiast'];

    const typed = new Typed(typedRef.current, {
      strings,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      cursorChar: '|',
    });
    return () => typed.destroy();
  }, [info]);

  const name = info?.name || 'Sivaprakash M';

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] as any } },
  };

  const displayProjectsCount = projectsCount !== undefined ? projectsCount : (projects?.length || 4);
  const displayCommitsCount = commitsCount !== undefined ? commitsCount : 500;

  const statsData = stats && stats.length > 0
    ? stats.slice(0, 3).map(s => {
        const labelLower = s.label?.toLowerCase() || '';
        let val = s.value;
        let suffix = s.suffix || '';
        if (labelLower.includes('project')) {
          val = displayProjectsCount;
          suffix = '+';
        } else if (labelLower.includes('commit') || labelLower.includes('github')) {
          val = displayCommitsCount;
          suffix = '+';
        }
        return { value: `${val}${suffix}`, label: s.label };
      })
    : [
        { value: `${displayProjectsCount}+`, label: 'Projects' },
        { value: info?.degree || 'MCA', label: 'Degree' },
        { value: `${displayCommitsCount}+`, label: 'Commits' },
      ];

  return (
    <section id="home" className="hero">
      {/* Layered BG */}
      <div className="hero__grid-bg" />
      <div className="hero__ambient-top" />
      <div className="hero__ambient-bottom" />
      <MouseLight />

      {/* Floating tech icons */}
      <FloatingTechIcons />

      <div className="container hero__content">
        <motion.div className="hero__text" variants={container} initial="hidden" animate="visible">



          {/* Name */}
          <motion.div variants={item}>
            <h1 className="hero__name">
              {name.split(' ').map((word, i) => (
                <span key={i} className={i === name.split(' ').length - 1 ? 'hero__name-accent' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <div className="hero__name-underline" />
          </motion.div>

          {/* Typed role */}
          <motion.div variants={item} className="hero__typed-wrapper">
            <span className="hero__typed-prefix">&gt;&nbsp;</span>
            <span className="hero__typed" ref={typedRef} />
          </motion.div>

          {/* Bio */}
          <motion.p variants={item} className="hero__bio">
            {info?.bio || (
              <>
                Building scalable, immersive web applications with the <strong>MERN</strong> stack.
                Passionate about clean code, great UX, and transforming ideas into{' '}
                <strong>real-world</strong> digital products.
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="hero__cta">
            <a
              href="#projects"
              className="btn hero__btn-primary"
              onClick={e => { e.preventDefault(); const lenis = getLenis(); if (lenis) lenis.scrollTo('#projects'); else document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <FolderOpen size={17} />
              <span>View Projects</span>
            </a>
            <a href={info?.resume || '/resume.pdf'} target="_blank" rel="noreferrer" className="btn hero__btn-secondary">
              <Download size={17} />
              Download Resume
            </a>
            <a
              href="#contact"
              className="btn hero__btn-outline"
              onClick={e => { e.preventDefault(); const lenis = getLenis(); if (lenis) lenis.scrollTo('#contact'); else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <Mail size={17} />
              Contact Me
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div variants={item} className="hero__socials">
            {info?.github && (
              <a 
                href="#github-stats" 
                className="hero__social" 
                title="GitHub Activity"
                aria-label="View GitHub activity"
                onClick={e => { 
                  e.preventDefault(); 
                  const lenis = getLenis(); 
                  if (lenis) lenis.scrollTo('#github-stats', { offset: -110 }); 
                  else {
                    const el = document.querySelector('#github-stats');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 110;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}
              >
                <FiGithub size={20} />
              </a>
            )}
            {info?.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="hero__social" title="LinkedIn" aria-label="Visit LinkedIn profile">
                <FiLinkedin size={20} />
              </a>
            )}
            {info?.instagram && (
              <a href={info.instagram} target="_blank" rel="noreferrer" className="hero__social" title="Instagram" aria-label="Visit Instagram profile">
                <FiInstagram size={20} />
              </a>
            )}
            {info?.facebook && (
              <a href={info.facebook} target="_blank" rel="noreferrer" className="hero__social" title="Facebook" aria-label="Visit Facebook profile">
                <FiFacebook size={20} />
              </a>
            )}
            {info?.email && (
              <a href={`mailto:${info.email}`} className="hero__social" title="Email" aria-label={`Send email to ${info.email}`}>
                <Mail size={20} />
              </a>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={item} className="hero__stats">
            {statsData.map((s, i) => {
              const isGit = s.label.toLowerCase().includes('commit') || s.label.toLowerCase().includes('github');
              const anchorProps = isGit ? {
                as: "a",
                href: "#github-stats",
                onClick: (e: any) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#github-stats', { offset: -110 });
                  else {
                    const el = document.querySelector('#github-stats');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 110;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }                },
                style: { textDecoration: 'none', cursor: 'pointer' }
              } : {};

              const Tag = isGit ? "a" : "div";

              return (
                <Tag key={i} className="hero__stat" {...anchorProps}>
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </Tag>
              );
            })}
          </motion.div>

            {/* Scroll indicator integrated into content flow */}
            <motion.a
              href="#about"
              className="hero__scroll"
              onClick={e => { e.preventDefault(); const lenis = getLenis(); if (lenis) lenis.scrollTo('#about', { offset: -30 }); else document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="hero__scroll-line" />
              <ArrowDown size={14} />
              <span>SCROLL</span>
            </motion.a>

          </motion.div>
        </div>
    </section>
  );
};

export default Hero;
