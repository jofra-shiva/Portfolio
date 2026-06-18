"use client";
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Skills.css';

/* ─── Static skill data (always shown, DB can override) ─── */
const STATIC_SKILLS = {
  Frontend: {
    color: 'var(--neon-violet)',
    glow: 'var(--neon-violet-glow)',
    icon: '⚡',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 90 },
      { name: 'Tailwind CSS', level: 82 },
    ],
  },
  Backend: {
    color: 'var(--neon-cyan)',
    glow: 'var(--neon-cyan-glow)',
    icon: '🔧',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 83 },
      { name: 'REST APIs', level: 88 },
    ],
  },
  Database: {
    color: 'var(--success)',
    glow: 'var(--success-glow)',
    icon: '🗄️',
    skills: [
      { name: 'MongoDB', level: 82 },
      { name: 'MySQL', level: 78 },
    ],
  },
  Tools: {
    color: 'var(--gold)',
    glow: 'var(--gold-glow)',
    icon: '🛠️',
    skills: [
      { name: 'Git', level: 88 },
      { name: 'GitHub', level: 88 },
      { name: 'VS Code', level: 95 },
      { name: 'Postman', level: 80 },
    ],
  },
};

const SkillPill = ({ name }: { name: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      className="skill-pill"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
    >
      {name}
    </motion.div>
  );
};

const CategoryCard = ({
  category, data, index,
}: {
  category: string; data: typeof STATIC_SKILLS.Frontend; index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="skill-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ '--card-color': data.color, '--card-glow': data.glow } as any}
    >
      <div className="skill-card__badge">
        <div className="skill-card__badge-dot" />
        <span className="skill-card__badge-text">{category}</span>
      </div>

      <div className="skill-card__skills">
        {data.skills.map((skill) => (
          <SkillPill key={skill.name} name={skill.name} />
        ))}
      </div>
    </motion.div>
  );
};

const Skills = ({ skills: dbSkills }: { skills: any[] }) => {
  let allCategories = Object.entries(STATIC_SKILLS);

  if (dbSkills && dbSkills.length > 0) {
    const grouped = dbSkills.reduce((acc, skill) => {
      const cat = skill.category || 'Other';
      if (!acc[cat]) {
        const staticConfig = STATIC_SKILLS[cat as keyof typeof STATIC_SKILLS];
        acc[cat] = {
          color: staticConfig ? staticConfig.color : 'var(--neon-violet)',
          glow: staticConfig ? staticConfig.glow : 'var(--neon-violet-glow)',
          skills: []
        };
      }
      acc[cat].skills.push({ name: skill.name });
      return acc;
    }, {} as Record<string, any>);
    
    allCategories = Object.entries(grouped);
  }
  
  // Separate main grid categories from tools
  const mainCategories = allCategories.filter(([cat]) => cat !== 'Tools' && cat !== 'Ecosystem');
  const toolsCategory = allCategories.find(([cat]) => cat === 'Tools' || cat === 'Ecosystem');

  return (
    <section id="skills" className="section skills">
      <div className="skills__ambient" />

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="neon-divider" />
        </div>

        {/* Main 3-column grid for Frontend, Backend, Database */}
        <div className="skills__main-grid">
          {mainCategories.map(([cat, data], i) => (
            <CategoryCard key={cat} category={cat} data={data} index={i} />
          ))}
        </div>

        {/* Tools & Ecosystem section at the bottom */}
        {toolsCategory && (
          <div className="skills__tools">
            <h3 className="skills__tools-title">Ecosystem & Tools</h3>
            <div className="skills__tools-list">
              {toolsCategory[1].skills.map((skill) => (
                <SkillPill key={skill.name} name={skill.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
