"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Folder, Users, GitCommit, Code2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function GitHubStats({ info, commitsCount: passedCommitsCount }: { info: any; commitsCount?: number }) {
  const { theme } = useTheme();
  const GITHUB_USERNAME = info?.github?.split('/').pop() || '';

  const [profileData, setProfileData] = useState<any>(null);
  const [reposData, setReposData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!GITHUB_USERNAME) return;

    const cacheKey = `gh_stats_cache_${GITHUB_USERNAME}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        if (age < 15 * 60 * 1000) {
          setProfileData(parsed.profile);
          setReposData(parsed.repos);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached GitHub stats:', e);
      }
    }

    const fetchData = async () => {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
        ]);

        if (profileRes.ok && reposRes.ok) {
          const profile = await profileRes.json();
          const repos = await reposRes.json();
          setProfileData(profile);
          setReposData(repos);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              profile,
              repos,
              timestamp: Date.now(),
            })
          );
        }
      } catch (err) {
        console.error('Failed to fetch GitHub statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [GITHUB_USERNAME]);

  if (!GITHUB_USERNAME) return null;

  const starsCount = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
  const finalCommitsCount = passedCommitsCount !== undefined ? passedCommitsCount : (profileData?.public_repos ? 500 : 0);

  const getLanguagesList = () => {
    if (!reposData || reposData.length === 0) return [];
    const counts: Record<string, number> = {};
    reposData.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const getLangColor = (name: string) => {
    const colors: Record<string, string> = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      html: '#e34c26',
      css: '#1572b6',
      python: '#3776ab',
      java: '#b07219',
      go: '#00add8',
      rust: '#dea584'
    };
    return colors[name] || '#8b5cf6';
  };

  const themeColors: Record<string, string> = {
    purple: '8b5cf6',
    blue: '3b82f6',
    green: '10b981',
    orange: 'f97316',
    rose: 'f43f5e',
  };
  const themeColor = themeColors[info?.themeName || 'purple'] || '8b5cf6';

  // Adjusted for our dark OS theme
  const streakColors = `background=00000000&text=f8fafc&sideLabels=cbd5e1&currStreakNum=f8fafc&sideNums=f8fafc&dates=64748b&border=00000000`;
  const streakUrl = `https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&fire=${themeColor}&ring=${themeColor}&currStreakLabel=${themeColor}&${streakColors}&cache_seconds=1800&t=${Math.floor(Date.now() / 60000)}`;

  const stats = [
    { label: 'Total Commits', value: finalCommitsCount, icon: <GitCommit size={18} /> },
    { label: 'Public Repos', value: profileData?.public_repos || 0, icon: <Folder size={18} /> },
    { label: 'Total Stars', value: starsCount, icon: <Star size={18} /> },
    { label: 'Followers', value: profileData?.followers || 0, icon: <Users size={18} /> },
  ].filter(stat => stat.value > 0);

  const languages = getLanguagesList();

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      <style>{`
        .gh-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .gh-premium-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }

        .gh-premium-card:hover {
          background: rgba(255, 255, 255, 0.035);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .gh-premium-card-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .gh-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .gh-stat-row:first-of-type {
          padding-top: 0;
        }
        .gh-stat-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .gh-stat-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 1.05rem;
        }

        .gh-stat-icon {
          color: #a78bfa;
        }

        .gh-stat-val {
          font-weight: 700;
          font-size: 1.25rem;
          color: white;
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        .gh-lang-row {
          margin-bottom: 1.5rem;
        }
        .gh-lang-row:last-child {
          margin-bottom: 0;
        }

        .gh-lang-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.6rem;
          font-size: 1rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
        }

        .gh-lang-pct {
          color: rgba(255,255,255,0.5);
          font-family: monospace;
        }

        .gh-lang-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          overflow: hidden;
        }

        .gh-lang-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gh-streak-img {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
        }

        .gh-cta-container {
          display: flex;
          justify-content: center;
          padding: 1rem 0 2rem 0;
        }

        .gh-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1rem 2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .gh-cta:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          gap: 1rem;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        @media (max-width: 600px) {
          .gh-header {
            display: none !important;
          }
          .gh-premium-grid {
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .gh-premium-card {
            padding: 1rem;
          }
          .gh-premium-card-title {
            margin-bottom: 1rem;
            font-size: 0.75rem;
          }
          .gh-stat-row {
            padding: 0.8rem 0;
          }
          .gh-stat-left {
            font-size: 0.95rem;
            gap: 0.6rem;
          }
          .gh-stat-val {
            font-size: 1rem;
          }
        }
      `}</style>

      <h2 className="gh-header" style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <svg viewBox="0 0 24 24" fill="white" width={28} height={28}>
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub Activity
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>🐙</div>
          <p>Fetching GitHub data...</p>
        </div>
      ) : (
        <>
          <div className="gh-premium-grid">
            <motion.div className="gh-premium-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>
              <div className="gh-premium-card-title">GitHub Stats</div>
              <div>
                {stats.map((stat, i) => (
                  <div key={i} className="gh-stat-row">
                    <div className="gh-stat-left">
                      <span className="gh-stat-icon">{stat.icon}</span>
                      <span>{stat.label}</span>
                    </div>
                    <span className="gh-stat-val">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="gh-premium-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} style={{ justifyContent: 'center' }}>
              <div className="gh-premium-card-title">Contribution Streak</div>
              <img src={streakUrl} alt="Contribution Streak" className="gh-streak-img" loading="lazy" />
            </motion.div>

            <motion.div className="gh-premium-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.3}}>
              <div className="gh-premium-card-title">Top Languages</div>
              {languages.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem 0' }}>
                  <Code2 size={24} style={{ margin: '0 auto 1rem' }} />
                  <div>No languages detected</div>
                </div>
              ) : (
                <div>
                  {languages.map((lang, i) => (
                    <div key={i} className="gh-lang-row">
                      <div className="gh-lang-header">
                        <span>{lang.name}</span>
                        <span className="gh-lang-pct">{lang.percentage}%</span>
                      </div>
                      <div className="gh-lang-bar-bg">
                        <div 
                          className="gh-lang-bar-fill" 
                          style={{ 
                            width: `${lang.percentage}%`,
                            background: getLangColor(lang.name.toLowerCase()),
                            boxShadow: `0 0 10px ${getLangColor(lang.name.toLowerCase())}40`
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="gh-cta-container">
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="gh-cta">
              View GitHub Profile <ExternalLink size={16} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
