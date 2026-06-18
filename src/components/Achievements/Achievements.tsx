"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { getAchievements } from '../../lib/db';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    getAchievements().then(res => setAchievements(res)).catch(console.error);
  }, []);

  return (
    <section id="achievements" className="section achievements">
      <div className="achievements__bg-glow" />
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Honors & <span className="gradient-text">Awards</span>
          </h2>
          <div className="neon-divider" />
        </div>

        {achievements.length > 0 ? (
          <div className="achievements__grid">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id || i}
                className="achievement-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Icon */}
                <div className="achievement-card__icon-wrap">
                  <Trophy size={22} />
                </div>

                <div className="achievement-card__content">
                  <h3 className="achievement-card__title">{ach.title}</h3>

                  <div className="achievement-card__meta">
                    {ach.organization && (
                      <span><MapPin size={12} /> {ach.organization}</span>
                    )}
                    {ach.date && (
                      <span><Calendar size={12} /> {ach.date}</span>
                    )}
                  </div>

                  {ach.description && (
                    <p className="achievement-card__desc">{ach.description}</p>
                  )}

                  {ach.link && (
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noreferrer"
                      className="achievement-card__link"
                    >
                      Verify <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ marginBottom: '1rem', opacity: 0.25 }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              // Awards and recognitions loading...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
