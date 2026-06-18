"use client";
import { useState, useEffect } from 'react';
import { Star, Folder, Users, GitCommit, Code2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './GitHubStats.css';

/* ─── Skeleton Loaders for Custom Cards ─── */
const StatsSkeleton = () => (
  <div className="gh-skeleton-list">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="gh-skeleton-item">
        <div className="gh-skeleton-left">
          <div className="gh-skeleton-icon" />
          <div className="gh-skeleton-text" />
        </div>
        <div className="gh-skeleton-value" />
      </div>
    ))}
  </div>
);

const LanguagesSkeleton = () => (
  <div className="gh-skeleton-list">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="gh-skeleton-item-bar">
        <div className="gh-skeleton-info">
          <div className="gh-skeleton-text-short" />
          <div className="gh-skeleton-text-tiny" />
        </div>
        <div className="gh-skeleton-bar" />
      </div>
    ))}
  </div>
);

/* ─── Custom Card Content Components ─── */
const GitHubStatsCard = ({ commitsCount, reposCount, followersCount, starsCount }: any) => {
  const stats = [
    { label: 'Total Commits', value: commitsCount, icon: <GitCommit size={16} /> },
    { label: 'Public Repos', value: reposCount, icon: <Folder size={16} /> },
    { label: 'Total Stars', value: starsCount, icon: <Star size={16} /> },
    { label: 'Followers', value: followersCount, icon: <Users size={16} /> },
  ].filter(stat => stat.value > 0);

  return (
    <div className="gh-custom-stats-list">
      {stats.map((stat, index) => (
        <div key={index} className="gh-custom-stat-item">
          <div className="gh-custom-stat-left">
            <span className="gh-custom-stat-icon-wrap">{stat.icon}</span>
            <span className="gh-custom-stat-name">{stat.label}</span>
          </div>
          <span className="gh-custom-stat-val">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

const GitHubLanguagesCard = ({ languages }: { languages: any[] }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="gh-custom-stat-empty">
        <Code2 size={20} />
        <span>No languages detected</span>
      </div>
    );
  }

  // Custom colors matching the tech theme
  const getLangColor = (name: string) => {
    const colors: Record<string, string> = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      html: '#e34c26',
      css: '#1572b6',
      python: '#3572a5',
      java: '#b07219',
      r: '#198ce7',
    };
    return colors[name.toLowerCase()] || 'var(--primary, #8b5cf6)';
  };

  return (
    <div className="gh-custom-languages-list">
      {languages.map((lang, index) => (
        <div key={index} className="gh-custom-lang-item">
          <div className="gh-custom-lang-info">
            <span className="gh-custom-lang-name">{lang.name}</span>
            <span className="gh-custom-lang-pct">{lang.percentage}%</span>
          </div>
          <div className="gh-custom-lang-bar-bg">
            <div
              className="gh-custom-lang-bar-fill"
              style={{
                width: `${lang.percentage}%`,
                background: getLangColor(lang.name),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Main GitHub Stats Component ─── */
const GitHubStats = ({ info, commitsCount: passedCommitsCount }: { info: any; commitsCount?: number }) => {
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
        if (age < 15 * 60 * 1000) { // 15 minutes cache
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

  // Aggregate Stars
  const starsCount = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);

  // Aggregate Languages
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
      .slice(0, 4); // Display top 4
  };

  const themeColors: Record<string, string> = {
    purple: '8b5cf6',
    blue: '3b82f6',
    green: '10b981',
    orange: 'f97316',
    rose: 'f43f5e',
  };
  const themeColor = themeColors[info?.themeName || 'purple'] || '8b5cf6';

  const isLight = theme === 'light';
  const streakColors = isLight
    ? `background=00000000&text=0f172a&sideLabels=334155&currStreakNum=0f172a&sideNums=0f172a&dates=475569&border=00000018`
    : `background=00000000&text=f8fafc&sideLabels=cbd5e1&currStreakNum=f8fafc&sideNums=f8fafc&dates=64748b&border=ffffff18`;

  // Point to the fast and reliable demolab mirror for streak stats
  const streakUrl = `https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&fire=${themeColor}&ring=${themeColor}&currStreakLabel=${themeColor}&${streakColors}&cache_seconds=1800&t=${Math.floor(Date.now() / 60000)}`;

  const finalCommitsCount = passedCommitsCount !== undefined ? passedCommitsCount : (profileData?.public_repos ? 500 : 0);

  return (
    <section id="github-stats" className="section github-stats">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <div className="neon-divider" />
        </div>

        <div className="gh-stats__grid">
          {/* Card 1: Custom GitHub Stats */}
          <div className="gh-stat-card card" data-aos="fade-up" data-aos-delay="0">
            <div className="gh-stat-card__label">GitHub Stats</div>
            {loading ? (
              <StatsSkeleton />
            ) : (
              <GitHubStatsCard
                commitsCount={finalCommitsCount}
                reposCount={profileData?.public_repos || 0}
                followersCount={profileData?.followers || 0}
                starsCount={starsCount}
              />
            )}
          </div>

          {/* Card 2: Contribution Streak SVG */}
          <div className="gh-stat-card card" data-aos="fade-up" data-aos-delay="100">
            <div className="gh-stat-card__label">Contribution Streak</div>
            <img
              src={streakUrl}
              alt="Contribution Streak"
              className="gh-stat-card__img"
              loading="lazy"
            />
          </div>

          {/* Card 3: Custom Top Languages */}
          <div className="gh-stat-card card" data-aos="fade-up" data-aos-delay="200">
            <div className="gh-stat-card__label">Top Languages</div>
            {loading ? (
              <LanguagesSkeleton />
            ) : (
              <GitHubLanguagesCard languages={getLanguagesList()} />
            )}
          </div>
        </div>

        <div className="gh-stats__cta">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View Full GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default GitHubStats;
