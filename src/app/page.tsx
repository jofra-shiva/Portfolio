"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingGate from '../components/OS/LandingGate';
import CinematicIntro from '../components/OS/CinematicIntro';
import Desktop from '../components/OS/Desktop';
import ClientLayout from '../components/Layout/ClientLayout';
import { getProjects, getSkills, getPortfolioInfo, getStats, getTimeline, getTestimonials, getAchievements } from '../lib/db';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

type Phase = 'landing' | 'intro' | 'desktop';

export default function PortfolioPage() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [info, setInfo] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [commitsCount, setCommitsCount] = useState(500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, projectsRes, skillsRes, statsRes, timelineRes, achievementsRes] = await Promise.all([
          getPortfolioInfo(),
          getProjects(),
          getSkills(),
          getStats(),
          getTimeline(),
          getAchievements(),
        ]);
        setInfo(infoRes);
        setProjects(Array.isArray(projectsRes) ? projectsRes : []);
        setSkills(Array.isArray(skillsRes) ? skillsRes : []);
        setStats(Array.isArray(statsRes) ? statsRes : []);
        setTimeline(Array.isArray(timelineRes) ? timelineRes : []);
        setAchievements(Array.isArray(achievementsRes) ? achievementsRes : []);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      }
    };

    fetchData();

    // Real-time listener for timeline
    const timelineQ = query(collection(db, 'timeline'), orderBy('order', 'asc'));
    const unsubTimeline = onSnapshot(timelineQ, (snapshot) => {
      setTimeline(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubTimeline(); };
  }, []);

  useEffect(() => {
    if (!info?.github) return;
    const match = info.github.match(/github\.com\/([^\/]+)/);
    const username = match ? match[1] : '';
    if (!username) return;

    const fetchCommits = async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, { headers: { 'Cache-Control': 'no-cache' } });
        if (res.ok) {
          const data = await res.json();
          if (data.total) {
            const sum = Object.values(data.total).reduce((a: any, b: any) => a + b, 0) as number;
            if (sum > 0) { setCommitsCount(sum); return; }
          }
        }
      } catch {}
      try {
        const res = await fetch(`https://api.github.com/search/commits?q=author:${username}`, { headers: { Accept: 'application/vnd.github.v3+json' } });
        if (res.ok) { const d = await res.json(); if (d.total_count) setCommitsCount(d.total_count); }
      } catch {}
    };
    fetchCommits();
  }, [info]);

  const data = { info, projects, skills, stats, timeline, achievements, commitsCount };

  return (
    <>
      {/*
        ── SEO Semantic Content (Crawler-Visible) ─────────────────────────────
        This section is visually hidden from users but fully readable by
        Google, Bing, and AI crawlers (ChatGPT, Perplexity, Claude, Gemini).
        It establishes entity identity in the initial HTML payload.
        DO NOT REMOVE — this is critical for search engine indexability.
      */}
      <section
        aria-label="Portfolio summary for Sivaprakash M"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <h1>Sivaprakash M — Full Stack Developer &amp; Software Engineer</h1>
        <p>
          Sivaprakash M is a Full Stack Developer and MCA student from Theni, Tamil Nadu, India.
          Specialising in Java, Python, React, Next.js, Node.js, Express.js, Flutter, Firebase,
          MongoDB, MySQL, and UI/UX Design using Figma. Available for software developer roles,
          internships, and freelance web development projects.
        </p>

        <nav aria-label="Portfolio sections">
          <ul>
            <li><a href="/?section=projects">Projects by Sivaprakash M</a></li>
            <li><a href="/?section=skills">Technical Skills</a></li>
            <li><a href="/?section=about">About Sivaprakash M</a></li>
            <li><a href="/?section=experience">Work Experience</a></li>
            <li><a href="/?section=education">Education — MCA</a></li>
            <li><a href="/?section=awards">Awards &amp; Achievements</a></li>
            <li><a href="/?section=contact">Contact Sivaprakash M</a></li>
          </ul>
        </nav>

        <section aria-label="Technical skills">
          <h2>Technical Skills</h2>
          <h3>Programming Languages</h3>
          <ul>
            <li>Java</li><li>Python</li><li>JavaScript</li><li>TypeScript</li>
          </ul>
          <h3>Frontend Development</h3>
          <ul>
            <li>React</li><li>Next.js</li><li>HTML5</li><li>CSS3</li>
            <li>Tailwind CSS</li><li>Bootstrap</li><li>Framer Motion</li>
          </ul>
          <h3>Backend Development</h3>
          <ul>
            <li>Node.js</li><li>Express.js</li><li>REST APIs</li>
          </ul>
          <h3>Mobile Development</h3>
          <ul><li>Flutter</li></ul>
          <h3>Databases</h3>
          <ul><li>MySQL</li><li>MongoDB</li><li>Firebase Firestore</li></ul>
          <h3>Tools &amp; Design</h3>
          <ul><li>Git</li><li>GitHub</li><li>Figma</li><li>UI/UX Design</li><li>Vercel</li></ul>
        </section>

        <section aria-label="Contact information">
          <h2>Contact Sivaprakash M</h2>
          <ul>
            <li>
              Email: <a href="mailto:shivaprakash3115@gmail.com">shivaprakash3115@gmail.com</a>
            </li>
            <li>
              GitHub: <a href="https://github.com/jofra-shiva" rel="me">github.com/jofra-shiva</a>
            </li>
            <li>
              LinkedIn: <a href="https://www.linkedin.com/in/sivaprakashm/" rel="me">linkedin.com/in/sivaprakashm</a>
            </li>
            <li>
              Instagram: <a href="https://www.instagram.com/sivaprakash.m_/" rel="me">instagram.com/sivaprakash.m_</a>
            </li>
            <li>Location: Theni, Tamil Nadu, India</li>
          </ul>
        </section>
      </section>

      {/* ── Interactive Portfolio App ──────────────────────────────────────── */}
      <ClientLayout>
        <AnimatePresence mode="wait">
          {/* Phase 1: Landing Gate */}
          {phase === 'landing' && (
            <LandingGate key="landing" onEnter={() => setPhase('intro')} info={info} stats={stats} projects={projects} />
          )}

          {/* Phase 2: Intro Video */}
          {phase === 'intro' && (
            <CinematicIntro key="intro" onComplete={() => setPhase('desktop')} />
          )}

          {/* Phase 3: OS Desktop */}
          {phase === 'desktop' && (
            <Desktop key="desktop" data={data} />
          )}
        </AnimatePresence>
      </ClientLayout>
    </>
  );
}

