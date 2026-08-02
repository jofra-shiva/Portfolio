"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CATS = [
  { id: 'Frontend', name: 'Frontend', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  { id: 'Backend', name: 'Backend', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { id: 'Database', name: 'Database', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
];

const STATIC_SKILLS: any = {
  Frontend: [
    { name: 'React.js' }, { name: 'JavaScript' }, { name: 'HTML5' }, { name: 'CSS3' }, { name: 'Tailwind CSS' },
  ],
  Backend: [
    { name: 'Node.js' }, { name: 'Express.js' }, { name: 'REST APIs' },
  ],
  Database: [
    { name: 'MongoDB' }, { name: 'MySQL' },
  ],
  Tools: [
    { name: 'Git' }, { name: 'GitHub' }, { name: 'VS Code' }, { name: 'Postman' },
  ]
};

const getIconUrl = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('react')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
  if (n.includes('node')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg';
  if (n.includes('express')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg';
  if (n.includes('tailwind')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg';
  if (n.includes('vs code') || n.includes('vscode')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg';
  if (n.includes('github')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg';
  if (n.includes('rest') || n.includes('api')) return 'https://cdn-icons-png.flaticon.com/512/8297/8297437.png';
  if (n.includes('mongo')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg';
  if (n.includes('mysql')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg';
  if (n.includes('js') || n.includes('javascript')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
  if (n.includes('html')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg';
  if (n.includes('css')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg';
  if (n.includes('git') && !n.includes('hub')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg';
  if (n.includes('postman')) return 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg';
  
  const iconName = n.replace(/[ .]/g, '-').replace('js','-js').replace('--','-');
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-original.svg`;
};

const SkillTreeNode = ({ cat, skills, idx }: { cat: any, skills: any[], idx: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!skills || skills.length === 0) return null;
  
  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.1}} style={{ marginBottom: '1rem' }}>
      <div 
        className="skill-cat-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', cursor: 'pointer',
          padding: '1.2rem 1.5rem', 
          background: isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '16px',
          transition: 'all 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        onMouseOut={e => e.currentTarget.style.background = isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
          <ChevronRight size={22} color={cat.color} />
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-start' }} className="skill-cat-title-wrapper">
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', letterSpacing: '0.5px', textAlign: 'left' }}>{cat.name}</span>
        </div>
        <span className="skill-cat-badge" style={{ background: cat.bgColor, color: cat.color, padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>
          {skills.length}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="tree-container" style={{ '--tree-color': cat.color } as any}>
              {skills.map((s: any, i: number) => {
                const isLast = i === skills.length - 1;
                const name = s.name || s.skill || 'Skill';
                return (
                  <div key={i} className={`tree-item ${isLast ? 'last' : ''}`}>
                    <motion.div 
                      className="skill-pill" 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.05 }}
                    >
                      <img src={getIconUrl(name)} alt={name} onError={e=>{(e.target as any).style.display='none'}} />
                      {name}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SkillsWindow({ skills }: { skills: any[] }) {
  const getSkillsByCategory = (catId: string) => {
    const dbMatched = skills.filter(s => {
      const cat = String(s.category || s.type || s.group || '').toLowerCase();
      if (catId === 'Frontend') return cat.includes('front') || cat.includes('ui') || cat === 'web';
      if (catId === 'Backend') return cat.includes('back') || cat.includes('server') || cat.includes('api') || cat.includes('node');
      if (catId === 'Database') return cat.includes('data') || cat.includes('db') || cat.includes('sql') || cat.includes('mongo');
      if (catId === 'Deployment') return cat.includes('deploy') || cat.includes('cloud') || cat.includes('devops') || cat.includes('aws') || cat.includes('host');
      if (catId === 'Tools') return cat.includes('tool') || cat.includes('ecosystem') || cat.includes('git') || cat === 'other' || cat === 'misc';
      return cat.includes(catId.toLowerCase());
    });
    
    const staticMatched = STATIC_SKILLS[catId] || [];
    const seen = new Set(dbMatched.map(s => String(s.name || s.skill || '').toLowerCase()));
    
    const merged = [...dbMatched];
    staticMatched.forEach((ss: any) => {
      if (!seen.has(ss.name.toLowerCase())) {
        merged.push(ss);
        seen.add(ss.name.toLowerCase());
      }
    });
    
    return merged;
  };

  const categorizedIds = new Set(CATS.map(c => getSkillsByCategory(c.id)).flat().map(s => s.id || s.name || s.skill));
  const uncategorized = skills.filter(s => !categorizedIds.has(s.id || s.name || s.skill));
  
  const ecosystemSkillsRaw = getSkillsByCategory('Tools').concat(getSkillsByCategory('Deployment')).concat(uncategorized);
  const ecosystemSkills: any[] = [];
  const ecoSeen = new Set();
  ecosystemSkillsRaw.forEach(s => {
    const key = String(s.name || s.skill || '').toLowerCase().trim();
    if (key && !ecoSeen.has(key)) {
      ecosystemSkills.push(s);
      ecoSeen.add(key);
    }
  });

  const ecosystemCat = { id: 'Ecosystem', name: 'Ecosystem & Tools', color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.1)' };

  return (
    <div className="win-skills win-skills-container">
      <style>{`
        .win-skills-container {
          padding: 2.5rem;
          height: 100%;
          overflow-y: auto;
          max-width: 900px;
          margin: 0 auto;
        }

        .skill-cat-header {
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .win-skills-container {
            padding: 1rem;
          }
          .skill-cat-header {
            padding: 1rem !important;
            gap: 0.5rem;
          }
          .skill-cat-title-wrapper {
            gap: 0.5rem !important;
          }
          .tree-container {
            display: flex !important;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            padding: 1.5rem 0 0.5rem 0 !important;
          }
          .tree-item {
            padding: 0 !important;
            display: inline-flex !important;
          }
          .tree-item::before, .tree-item::after {
            display: none !important;
          }
        }
        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          transition: all 0.2s;
        }
        .skill-pill img {
          width: 18px;
          height: 18px;
        }
        
        .tree-container {
          padding-top: 0;
          padding-bottom: 0.5rem;
        }
        .tree-item {
          position: relative;
          padding-left: 5.5rem;
          padding-top: 0.8rem;
          padding-bottom: 0.8rem;
          display: flex;
          align-items: center;
        }
        .tree-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 35px;
          width: 2rem;
          height: 50%;
          border-left: 2px solid var(--tree-color);
          border-bottom: 2px solid var(--tree-color);
          border-bottom-left-radius: 12px;
          opacity: 0.35;
        }
        .tree-item:first-child::before {
          top: -1rem;
          height: calc(50% + 1rem);
        }
        .tree-item:not(.last)::after {
          content: '';
          position: absolute;
          top: 50%;
          bottom: 0;
          left: 35px;
          border-left: 2px solid var(--tree-color);
          opacity: 0.35;
        }
        
        @media (max-width: 600px) {
          .tree-item {
            padding-left: 2.5rem;
          }
          .tree-item::before, .tree-item:not(.last)::after {
            left: 15px;
          }
          .skill-pill {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>

      {CATS.map((cat, idx) => (
        <SkillTreeNode key={cat.id} cat={cat} skills={getSkillsByCategory(cat.id)} idx={idx} />
      ))}
      <SkillTreeNode cat={ecosystemCat} skills={ecosystemSkills} idx={CATS.length} />
    </div>
  );
}
