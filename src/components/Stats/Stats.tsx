"use client";
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, GitBranch, Layers, GraduationCap, Zap, Trophy, Award, Star, Sparkles, Heart } from 'lucide-react';
import './Stats.css';

const STAT_ICONS: Record<string, React.ReactNode> = {
  Layers: <Layers size={24} />,
  GitBranch: <GitBranch size={24} />,
  Code2: <Code2 size={24} />,
  Zap: <Zap size={24} />,
  GraduationCap: <GraduationCap size={24} />,
  Trophy: <Trophy size={24} />,
  Award: <Award size={24} />,
  Star: <Star size={24} />,
  Sparkles: <Sparkles size={24} />,
  Heart: <Heart size={24} />,
};

const getGlowColor = (hex: string) => {
  if (hex && hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  return 'rgba(255, 255, 255, 0.3)';
};

const CountUp = ({ end, suffix, inView }: { end: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = end / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [inView, end]);

  return <>{count}{suffix}</>;
};

const Stats = ({ stats, projectsCount, githubUrl, commitsCount: passedCommitsCount }: { stats: any[]; projectsCount: number; githubUrl?: string; commitsCount?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [commitsCount, setCommitsCount] = useState(passedCommitsCount !== undefined ? passedCommitsCount : 500);

  useEffect(() => {
    if (passedCommitsCount !== undefined) {
      setCommitsCount(passedCommitsCount);
      return;
    }

    if (!githubUrl) return;
    const match = githubUrl.match(/github\.com\/([^\/]+)/);
    const username = match ? match[1] : '';
    if (!username) return;

    const fetchCommits = async () => {
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
  }, [githubUrl, passedCommitsCount]);

  const displayStats = stats && stats.length > 0 ? stats.map(s => {
    const labelLower = s.label?.toLowerCase() || '';
    let val = s.value;
    if (labelLower.includes('project')) {
      val = projectsCount || val;
    } else if (labelLower.includes('commit') || labelLower.includes('github')) {
      val = commitsCount || val;
    }
    return {
      value: val,
      suffix: s.suffix || '',
      label: s.label,
      icon: STAT_ICONS[s.icon] || <Code2 size={24} />,
      color: s.color || '#8b5cf6',
      glow: getGlowColor(s.color || '#8b5cf6')
    };
  }) : [
    { value: projectsCount || 10, suffix: '+', label: 'Projects Built', icon: <Layers size={24} />, color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
    { value: commitsCount, suffix: '+', label: 'GitHub Commits', icon: <GitBranch size={24} />, color: '#00d2ff', glow: 'rgba(0,210,255,0.3)' },
    { value: 3, suffix: '+', label: 'Major Applications', icon: <Code2 size={24} />, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { value: 2, suffix: ' Yrs', label: 'Dev Experience', icon: <Zap size={24} />, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
    { value: 100, suffix: '%', label: 'Dedication', icon: <GraduationCap size={24} />, color: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
  ];

  return (
    <section className="stats-section">
      <div className="container" ref={ref}>
        <div className="stats-section__grid">
          {displayStats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ '--stat-color': stat.color, '--stat-glow': stat.glow } as any}
            >
              <div className="stat-card__icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-card__value">
                <CountUp end={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="stat-card__label">{stat.label}</p>
              <div className="stat-card__accent" style={{ background: stat.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
