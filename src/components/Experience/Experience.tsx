import { Briefcase, Globe, Code2, Users } from 'lucide-react';
import './Experience.css';

const Experience = ({ info }) => {
  const experiences = info?.experience || [];

  // if (experiences.length === 0) return null;

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'freelance': return <Globe size={20} />;
      case 'project': return <Code2 size={20} />;
      default: return <Briefcase size={20} />;
    }
  };

  const getColor = (index) => {
    const colors = ['var(--neon-violet)', 'var(--neon-cyan)', 'var(--success)', 'var(--gold)'];
    return colors[index % colors.length];
  };

  const getGlow = (index) => {
    const glows = ['var(--neon-violet-glow)', 'var(--neon-cyan-glow)', 'var(--success-glow)', 'var(--gold-glow)'];
    return glows[index % glows.length];
  };

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <div className="section-tag">Journey</div>
          <h2 className="section-title">Experience & <span>Work</span></h2>
          <div className="divider"></div>
          <p className="section-subtitle">Professional experience and work history from the database</p>
        </div>

        {experiences.length > 0 ? (
          <div className="exp__grid">
            {experiences.map((exp, i) => {
              const color = getColor(i);
              const glow = getGlow(i);
              return (
                <div
                  key={exp._id || i}
                  className={`exp-card card`}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="exp-card__header">
                    <div className="exp-card__icon-wrap" style={{ background: glow, color: color }}>
                      {getIcon(exp.type || 'work')}
                    </div>
                    <div className="exp-card__meta">
                      <span className="exp-card__period">{exp.duration || (exp.startDate && `${exp.startDate} - ${exp.endDate || 'Present'}`)}</span>
                      {exp.type && <span className="exp-card__type badge">{exp.type}</span>}
                    </div>
                  </div>

                  <h3 className="exp-card__role">{exp.role}</h3>
                  <div className="exp-card__org">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  <p className="exp-card__desc">{exp.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" data-aos="fade-up" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
             <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
             <p>Experience details are being updated. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
