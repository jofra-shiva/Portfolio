"use client";
import { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import GitHubStats from '../components/GitHubStats/GitHubStats';
import Projects from '../components/Projects/Projects';
import Achievements from '../components/Achievements/Achievements';
import Testimonials from '../components/Testimonials/Testimonials';
import Contact from '../components/Contact/Contact';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { getProjects, getSkills, getPortfolioInfo, getStats, getTimeline, getTestimonials } from '../lib/db';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ClientLayout from '../components/Layout/ClientLayout';

export default function PortfolioPage() {
  const [info, setInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [commitsCount, setCommitsCount] = useState(500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, projectsRes, skillsRes, statsRes, timelineRes, testimonialsRes] = await Promise.all([
          getPortfolioInfo(),
          getProjects(),
          getSkills(),
          getStats(),
          getTimeline(),
          getTestimonials(),
        ]);
        setInfo(infoRes);
        setProjects(Array.isArray(projectsRes) ? projectsRes : []);
        setSkills(Array.isArray(skillsRes) ? skillsRes : []);
        setStats(Array.isArray(statsRes) ? statsRes : []);
        setTimeline(Array.isArray(timelineRes) ? timelineRes : []);
        setTestimonials(Array.isArray(testimonialsRes) ? testimonialsRes : []);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time listener for timeline — updates portfolio live without refresh
    const timelineQ = query(collection(db, 'timeline'), orderBy('order', 'asc'));
    const unsubscribeTimeline = onSnapshot(timelineQ, (snapshot) => {
      setTimeline(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeTimeline();
    };
  }, []);

  useEffect(() => {
    if (!info?.github) return;
    const match = info.github.match(/github\.com\/([^\/]+)/);
    const username = match ? match[1] : '';
    if (!username) return;

    const fetchCommits = async () => {
      // 1. Try scraping contributions API with Cache-Control: no-cache to get real-time data
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.total) {
            const sum = Object.values(data.total).reduce((a: any, b: any) => a + b, 0) as number;
            if (sum > 0) {
              setCommitsCount(sum);
              return;
            }
          }
        } else if (res.status === 429) {
          console.warn('Cache-control bypass rate-limited, falling back to cached scraper');
        }
      } catch (err) {
        console.warn('Scraper cache bypass failed, falling back to cached scraper:', err);
      }

      // 2. Fallback: Try fetching without Cache-Control header (serves cached version)
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (res.ok) {
          const data = await res.json();
          if (data.total) {
            const sum = Object.values(data.total).reduce((a: any, b: any) => a + b, 0) as number;
            if (sum > 0) {
              setCommitsCount(sum);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Cached scraper failed, falling back to Search API:', err);
      }

      // 3. Last Fallback: Use official Search API (public commits only, subject to index lag)
      try {
        const res = await fetch(`https://api.github.com/search/commits?q=author:${username}`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.total_count !== undefined) {
            setCommitsCount(data.total_count);
          }
        }
      } catch (err) {
        console.error('Failed to fetch commits count:', err);
      }
    };
    fetchCommits();
  }, [info]);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Enforce 0.8 seconds minimum loading screen time (reduced from 1.78s to improve LCP)
    const timer = setTimeout(() => setMinTimeElapsed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && minTimeElapsed) {
      setIsLeaving(true);
    }
  }, [loading, minTimeElapsed]);

  return (
    <ClientLayout>
      <LoadingSpinner isLeaving={isLeaving} name={info?.name} />

      <div
        style={{
          opacity: isLeaving ? 1 : 0,
          visibility: isLeaving ? 'visible' : 'hidden',
          transition: 'opacity 0.7s ease-in-out',
        }}
      >
        {/* 1. Hero – First impression */}
        <Hero info={info} projects={projects} skills={skills} stats={stats} projectsCount={projects.length} commitsCount={commitsCount} />



        {/* 3. About – Story & Timeline */}
        <About info={info} timeline={timeline} />

        {/* 4. Skills – Tech stack showcase */}
        <Skills skills={skills} />

        {/* 5. Projects – Work showcase */}
        <Projects projects={projects} loading={loading} info={info} />

        {/* 6. Achievements – Awards / Certs / Experience */}
        <Achievements />

        {/* 7. GitHub – Contribution activity */}
        <GitHubStats info={info} commitsCount={commitsCount} />


        {/* 9. Contact – Call to action */}
        <Contact info={info} />
      </div>
    </ClientLayout>
  );
}
