"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingGate from '../components/OS/LandingGate';
import Desktop from '../components/OS/Desktop';
import ClientLayout from '../components/Layout/ClientLayout';
import { getProjects, getSkills, getPortfolioInfo, getStats, getTimeline, getTestimonials, getAchievements } from '../lib/db';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

type Phase = 'landing' | 'desktop';

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
    <ClientLayout>
      <AnimatePresence mode="wait">
        {/* Phase 1: Landing Gate — full portfolio intro */}
        {phase === 'landing' && (
          <LandingGate key="landing" onEnter={() => setPhase('desktop')} info={info} stats={stats} projects={projects} />
        )}

        {/* Phase 2: OS Desktop */}
        {phase === 'desktop' && (
          <Desktop key="desktop" data={data} />
        )}
      </AnimatePresence>
    </ClientLayout>
  );
}
