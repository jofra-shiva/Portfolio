"use client";
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ExternalLink, Search } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ProjectsWindow({ projects }: { projects: any[] }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const CATS = ['All', 'Web', 'Mobile'];
  const [selected, setSelected] = useState<any>(null);

  const sortedProjects = [...projects].reverse();
  const getGithubLink = (pr: any) => pr.githubLink || pr?.links?.github || pr.githubUrl || pr.github || pr.repo || pr.source || pr.sourceCode || pr.sourcecode || pr.githublink || pr.code;
  const getLiveLink = (pr: any) => pr.liveLink || pr?.links?.demo || pr.liveUrl || pr.live || pr.demo || pr.link || pr.url || pr.livelink || pr.demoUrl || pr.website;

  const filtered = sortedProjects.filter(pr => {
    const ms = !search || (pr.title || '').toLowerCase().includes(search.toLowerCase()) || (pr.description || '').toLowerCase().includes(search.toLowerCase());
    const mc = cat === 'All' || (pr.category || '') === cat || (pr.tech || pr.technologies || []).some((t: string) => t.toLowerCase().includes(cat.toLowerCase()));
    return ms && mc;
  });

  return (
    <div className="win-projects" style={{ position: 'relative' }}>
      <style>{`
        .project-swiper {
          --swiper-navigation-color: #3b82f6;
          --swiper-pagination-color: #3b82f6;
          --swiper-navigation-size: 28px;
          padding-bottom: 30px;
        }
        .project-swiper .swiper-button-next, .project-swiper .swiper-button-prev {
          transition: all 0.2s;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .project-swiper .swiper-button-next:hover, .project-swiper .swiper-button-prev:hover {
          transform: scale(1.1);
        }
        .project-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.2);
          opacity: 1;
        }
        .project-swiper .swiper-pagination-bullet-active {
          background: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
      <AnimatePresence>
        {selected && (
          <motion.div 
            key="details-modal"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'absolute', inset: 0, zIndex: 100, 
              background: 'rgba(10, 15, 30, 0.7)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' 
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                background: '#171821',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                width: '100%', maxWidth: '850px',
                maxHeight: '100%',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button 
                  onClick={() => setSelected(null)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '38px', height: '38px', transition: 'all 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)', e.currentTarget.style.color = '#fff')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)', e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div style={{ padding: '0 2rem 2rem 2rem', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
                
                {((selected.images && selected.images.length > 0) || selected.image) && (
                  <div style={{ flex: '1 1 300px', overflow: 'hidden', borderRadius: '16px', background: '#0f1015' }}>
                    {selected.images && selected.images.length > 0 ? (
                      <Swiper 
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation 
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        loop={true}
                        className="project-swiper"
                        style={{ width: '100%', height: '100%', minHeight: '300px' }}
                      >
                        {Array.from(new Set([selected.image, ...selected.images].filter(Boolean))).map((img: any, i: number) => (
                          <SwiperSlide key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', paddingBottom: '20px' }}>
                            <img 
                              src={img} 
                              alt={`${selected.title} preview ${i + 1}`} 
                              style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain' }} 
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <img 
                        src={selected.image} 
                        alt={selected.title} 
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }} 
                      />
                    )}
                  </div>
                )}
                
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                    {selected.title || selected.name || 'Project'}
                  </h2>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {(selected.tech || selected.technologies || []).map((t: string, i: number) => (
                      <span key={i} style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>
                    {selected.longDesc || selected.description || selected.shortDesc}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {getGithubLink(selected) && (
                      <a href={getGithubLink(selected)} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.8rem 1.8rem', borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                        <FiGithub size={20} /> Code
                      </a>
                    )}
                    {getLiveLink(selected) && (
                      <a href={getLiveLink(selected)} target="_blank" rel="noreferrer" style={{ background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', color: 'white', padding: '0.8rem 2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.6)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)'; }}>
                        <ExternalLink size={20} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div className="win-projects__toolbar">
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                <input className="win-projects__search" style={{ paddingLeft: '2.2rem' }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search projects" id="projects-search" />
              </div>
              <div className="win-projects__filter" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {CATS.map(c => <button key={c} className={`win-filter-btn${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>)}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', margin: '-0.5rem' }}>
              <div style={{ padding: '0.5rem' }}>
                <LayoutGroup>
                  <motion.div className="win-projects__grid" layout>
                    <AnimatePresence mode="popLayout">
                      {filtered.length === 0
                        ? <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No projects found</motion.div>
                        : filtered.map((pr, i) => {
                          const displayImg = pr.image || (pr.images && pr.images.length > 0 ? pr.images[0] : null);
                          return (
                          <motion.div key={pr.id||i} layout className="win-project-card" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{delay:i*0.04}} onClick={() => setSelected(pr)}>
                            {displayImg
                              ? <img src={displayImg} alt={pr.title} className="win-project-card__image" loading="lazy" onError={e=>{(e.target as any).style.display='none'}} />
                              : <div className="win-project-card__image" style={{background:`linear-gradient(135deg,hsl(${i*60%360},60%,25%),hsl(${(i*60+120)%360},60%,20%))`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>💻</div>
                            }
                            <div className="win-project-card__body">
                              <div className="win-project-card__title">{pr.title||pr.name||'Project'}</div>
                              <div className="win-project-card__desc">{pr.description||pr.shortDesc||'A web application'}</div>
                              <div className="win-project-card__tags">
                                {(pr.tech||pr.technologies||[]).slice(0,4).map((t: string,ti: number)=><span key={ti} className="win-tag">{t}</span>)}
                              </div>
                              <div className="win-project-card__links">
                                {getLiveLink(pr) && <a href={getLiveLink(pr)} target="_blank" rel="noreferrer" className="win-project-card__link" onClick={e => e.stopPropagation()}><ExternalLink size={11}/> Live</a>}
                                {getGithubLink(pr) && <a href={getGithubLink(pr)} target="_blank" rel="noreferrer" className="win-project-card__link" onClick={e => e.stopPropagation()}><FiGithub size={11}/> Code</a>}
                                {!getLiveLink(pr) && !getGithubLink(pr) && <span className="win-project-card__link" style={{color:'rgba(255,255,255,0.9)',cursor:'pointer'}}>See more →</span>}
                              </div>
                            </div>
                          </motion.div>
                          );
                        })
                      }
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              </div>
            </div>
      </div>
    </div>
  );
}

