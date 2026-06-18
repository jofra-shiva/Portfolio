"use client";
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Code2, Target, Rocket, BookOpen, Award, Briefcase } from 'lucide-react';
import jofraLight from '../../assets/jofra.jpeg';
import jofraDark from '../../assets/jofraaa.png';
import './About.css';

/* ─── Static timeline data ─── */
const TIMELINE_DATA = [
  {
    phase: 'Experience',
    icon: <Code2 size={20} />,
    color: 'var(--neon-cyan)',
    items: [
      {
        year: '2023 – Present',
        title: 'Full Stack Developer',
        org: 'Freelance & Personal Projects',
        desc: 'Built scalable web applications using the MERN stack, focusing on performance and user experience.',
        badge: 'Current',
        current: true,
      },
      {
        year: '2022',
        title: 'Web Development Intern',
        org: 'Tech Solutions Inc.',
        desc: 'Assisted in building responsive front-end interfaces using React and Tailwind CSS.',
        badge: 'Completed',
        current: false,
      },
    ],
  },
  {
    phase: 'Education',
    icon: <GraduationCap size={20} />,
    color: 'var(--neon-violet)',
    items: [
      {
        year: '2023 – 2025',
        title: 'Master of Computer Applications (MCA)',
        org: 'Bishop Heber College, Trichy',
        desc: 'Specializing in full-stack development, software architecture, and modern web technologies.',
        badge: 'Pursuing',
        current: true,
      },
      {
        year: '2020 – 2023',
        title: 'Bachelor of Computer Applications (BCA)',
        org: 'Rajah Serfoji Government College',
        desc: 'Foundation in programming, data structures, databases, and core computer science concepts.',
        badge: 'Completed',
        current: false,
      },
    ],
  },
];

const TimelineEntry = ({ item, color, index }: { item: any; color: string; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className="about-timeline-entry"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Left Rail: dot + connecting line */}
      <div className="about-timeline-entry__rail">
        <div className="about-timeline-entry__dot-wrap">
          <div
            className="about-timeline-entry__dot"
            style={{ background: color, boxShadow: `0 0 14px 4px ${color}55` }}
          >
            <div className="about-timeline-entry__dot-inner" />
          </div>
          {item.current && <div className="about-timeline-entry__pulse" style={{ background: color }} />}
        </div>
        <div className="about-timeline-entry__connector" />
      </div>

      {/* Content Card */}
      <div className="about-timeline-entry__card" style={{ '--entry-color': color } as any}>
        <div className="about-timeline-entry__title-row">
          <h4 className="about-timeline-entry__title">{item.title}</h4>
          {item.badge && (
            <span className="about-timeline-entry__badge" data-badge={item.badge}>
              {item.badge}
            </span>
          )}
        </div>
        <p className="about-timeline-entry__org">{item.org}</p>
        {item.cgpa && (
          <p className="about-timeline-entry__cgpa">
            <span className="about-timeline-entry__cgpa-label">CGPA</span>
            {item.cgpa}
          </p>
        )}
        <p className="about-timeline-entry__desc">{item.desc}</p>
      </div>
    </motion.div>
  );
};

const TimelineBlock = ({ block, blockIndex }: { block: typeof TIMELINE_DATA[0]; blockIndex: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="about-timeline-block"
      style={{ '--block-color': block.color } as any}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: blockIndex * 0.1 }}
    >
      {/* Phase header */}
      <div className="about-timeline-block__header">
        <div className="about-timeline-block__icon">
          {block.icon}
        </div>
        <h3 className="about-timeline-block__title" style={{ color: block.color }}>
          {block.phase}
        </h3>
      </div>

      {/* Entries */}
      <div className="about-timeline-block__entries" style={{ '--block-color': block.color } as any}>
        {block.items.map((item, i) => (
          <TimelineEntry key={i} item={item} color={block.color} index={i} />
        ))}
      </div>
    </motion.div>
  );
};

const PHASE_CONFIGS: Record<string, { icon: React.ReactNode; color: string }> = {
  'Education': { icon: <GraduationCap size={24} />, color: '#a78bfa' },
  'Experience': { icon: <Briefcase size={24} />, color: '#c4b5fd' },
};

const About = ({ info, timeline }: { info: any; timeline: any[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Group and format the database timeline items
  let displayTimeline: any[] = [];
  if (timeline && timeline.length > 0) {
    // Group items by phase
    const groups: Record<string, any[]> = {};
    timeline.forEach(item => {
      const phase = item.phase || 'Education Journey';
      if (!groups[phase]) {
        groups[phase] = [];
      }
      groups[phase].push({
        year: item.year || '',
        title: item.title || '',
        org: item.organization || '',
        desc: item.description || '',
        cgpa: item.cgpa || '',
        badge: item.badge || '',
        current: !!item.current,
      });
    });

    const phases = ['Experience', 'Education'];
    // Collect any other custom phases user might have added
    Object.keys(groups).forEach(p => {
      if (!phases.includes(p)) {
        phases.push(p);
      }
    });

    phases.forEach(phaseName => {
      if (groups[phaseName] && groups[phaseName].length > 0) {
        const config = PHASE_CONFIGS[phaseName] || { icon: <BookOpen size={20} />, color: 'var(--primary-light)' };
        displayTimeline.push({
          phase: phaseName,
          icon: config.icon,
          color: config.color,
          items: groups[phaseName],
        });
      }
    });
  } else {
    displayTimeline = TIMELINE_DATA;
  }

  return (
    <section id="about" className="section about">
      <div className="about__ambient" />

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="neon-divider" />
        </div>

        <div className="about__bento-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="bento-timeline-wrapper">
            <div className="about__timeline-grid">
              {displayTimeline.map((block, i) => (
                <TimelineBlock key={i} block={block} blockIndex={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
