"use client";
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import './Testimonials.css';

const PLACEHOLDER_TESTIMONIALS = [
  {
    name: 'Professor / Mentor',
    role: 'MCA Department, Bishop Heber College',
    text: 'This section is reserved for future recommendations and testimonials from professors, collaborators, and industry mentors.',
    stars: 5,
    avatar: 'PM',
    color: 'var(--neon-violet)',
    glow: 'var(--neon-violet-glow)',
  },
  {
    name: 'Team Collaborator',
    role: 'Fellow Developer',
    text: 'Testimonials from project collaborators and peers will be displayed here as the portfolio grows.',
    stars: 5,
    avatar: 'TC',
    color: 'var(--neon-cyan)',
    glow: 'var(--neon-cyan-glow)',
  },
  {
    name: 'Industry Mentor',
    role: 'Senior Software Engineer',
    text: 'Professional recommendations and endorsements from the industry will be added here in the future.',
    stars: 5,
    avatar: 'IM',
    color: 'var(--success)',
    glow: 'var(--success-glow)',
  },
];

const Testimonials = ({ testimonials }: { testimonials: any[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const displayTestimonials = testimonials && testimonials.length > 0
    ? testimonials
    : PLACEHOLDER_TESTIMONIALS;

  return (
    <section className="section testimonials">
      <div className="testimonials__ambient" />
      <div className="container" ref={ref}>
        <div className="section-header">
          <span className="section-tag">Recommendations</span>
          <h2 className="section-title">
            What People <span className="gradient-text">Say</span>
          </h2>
          <div className="neon-divider" />
          <p className="section-subtitle">
            Testimonials and recommendations from colleagues and mentors
          </p>
        </div>

        <div className="testimonials__grid">
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ '--t-color': t.color, '--t-color-glow': t.glow || 'var(--neon-violet-glow)' } as any}
            >
              <div className="testimonial-card__top">
                <Quote className="testimonial-card__quote" size={28} />
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.stars || 5 }).map((_, si) => (
                    <Star key={si} size={13} fill={t.color || 'var(--neon-violet)'} color={t.color || 'var(--neon-violet)'} />
                  ))}
                </div>
              </div>

              <p className="testimonial-card__text">{t.text}</p>

              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{ background: t.glow || 'var(--neon-violet-glow)', border: `1px solid ${t.color || 'var(--neon-violet)'}`, color: t.color || 'var(--neon-violet)' }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>

              <div className="testimonial-card__accent" style={{ background: t.color || 'var(--neon-violet)' }} />
            </motion.div>
          ))}
        </div>

        {(!testimonials || testimonials.length === 0) && (
          <motion.p
            className="testimonials__coming-soon"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            // Real testimonials will be added as I build connections in the industry
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
