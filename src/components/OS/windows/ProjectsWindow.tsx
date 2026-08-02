"use client";
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ExternalLink, Search } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';

export default function ProjectsWindow({ projects }: { projects: any[] }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const CATS = ['All', 'Web', 'Mobile', 'AI/ML', 'Backend', 'Other'];

  const filtered = projects.filter(pr => {
    const ms = !search || (pr.title || '').toLowerCase().includes(search.toLowerCase()) || (pr.description || '').toLowerCase().includes(search.toLowerCase());
    const mc = cat === 'All' || (pr.category || '') === cat || (pr.tech || pr.technologies || []).some((t: string) => t.toLowerCase().includes(cat.toLowerCase()));
    return ms && mc;
  });

  return (
    <div className="win-projects">
      <div className="win-projects__toolbar">
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
          <input className="win-projects__search" style={{ paddingLeft: '2.2rem' }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search projects" id="projects-search" />
        </div>
        <div className="win-projects__filter">
          {CATS.map(c => <button key={c} className={`win-filter-btn${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>
      <LayoutGroup>
        <motion.div className="win-projects__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0
              ? <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No projects found</motion.div>
              : filtered.map((pr, i) => (
                <motion.div key={pr.id||i} layout className="win-project-card" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{delay:i*0.04}} whileHover={{y:-6}}>
                  {pr.image
                    ? <img src={pr.image} alt={pr.title} className="win-project-card__image" loading="lazy" onError={e=>{(e.target as any).style.display='none'}} />
                    : <div className="win-project-card__image" style={{background:`linear-gradient(135deg,hsl(${i*60%360},60%,25%),hsl(${(i*60+120)%360},60%,20%))`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>💻</div>
                  }
                  <div className="win-project-card__body">
                    <div className="win-project-card__title">{pr.title||pr.name||'Project'}</div>
                    <div className="win-project-card__desc">{pr.description||pr.shortDesc||'A web application'}</div>
                    <div className="win-project-card__tags">
                      {(pr.tech||pr.technologies||[]).slice(0,4).map((t: string,ti: number)=><span key={ti} className="win-tag">{t}</span>)}
                    </div>
                    <div className="win-project-card__links">
                      {pr.liveUrl && <a href={pr.liveUrl} target="_blank" rel="noreferrer" className="win-project-card__link"><ExternalLink size={11}/> Live</a>}
                      {pr.githubUrl && <a href={pr.githubUrl} target="_blank" rel="noreferrer" className="win-project-card__link"><FiGithub size={11}/> Code</a>}
                      {!pr.liveUrl && !pr.githubUrl && <span className="win-project-card__link" style={{color:'rgba(255,255,255,0.3)',cursor:'default'}}>Private</span>}
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}

