"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TimelineAccordion({ item, index }: { item: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:index*0.05}} style={{ marginBottom: '1.2rem' }}>
      <div 
        className="timeline-cat-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          padding: '1.5rem', 
          background: isOpen ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: isOpen ? '16px 16px 0 0' : '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={e => e.currentTarget.style.background = isOpen ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)'}
      >
        <div className="timeline-cat-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '0.85rem', 
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontFamily: 'monospace'
          }}>
            {item.year}
          </div>
          <div style={{ fontWeight: 600, fontSize: '1.15rem', color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px' }}>
            {item.title}
          </div>
          {item.badge && (
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '0.3rem 0.8rem', 
              background: 'transparent', 
              color: 'rgba(255,255,255,0.6)', 
              borderRadius: '99px', 
              fontWeight: 600, 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {item.badge}
            </span>
          )}
        </div>
        <motion.div className="timeline-cat-chevron" animate={{ rotate: isOpen ? 180 : 0 }} style={{ flexShrink: 0, marginLeft: '1rem', color: 'rgba(255,255,255,0.4)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="timeline-content-inner" style={{ 
              padding: '1.5rem', 
              background: 'rgba(0,0,0,0.15)', 
              border: '1px solid rgba(255,255,255,0.04)', 
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              position: 'relative'
            }}>
              {/* Decorative tree line */}
              <div className="timeline-tree-line" style={{ position: 'absolute', left: '32px', top: '0', bottom: '32px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              
              <div className="timeline-text-content" style={{ paddingLeft: '40px', position: 'relative' }}>
                <div className="timeline-tree-dash" style={{ position: 'absolute', left: '-12px', top: '12px', width: '10px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div className="timeline-tree-dot" style={{ position: 'absolute', left: '-14px', top: '9px', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '-0.2px' }}>
                  {item.organization || item.org}
                </div>
                {item.cgpa && (
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontWeight: 500 }}>
                    CGPA <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item.cgpa}</span>
                  </div>
                )}
                <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 400 }}>
                  {item.description || item.desc}
                </div>
                
                {item.tech && item.tech.length > 0 && (
                  <div className="timeline-tech-flex" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {item.tech.map((t: string, i: number) => (
                      <span key={i} style={{ 
                        padding: '0.3rem 0.8rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.3px'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 600px) {
          .timeline-cat-header {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1rem !important;
          }
          .timeline-cat-info {
            flex-direction: column !important;
            justify-content: center !important;
            gap: 0.4rem !important;
          }
          .timeline-cat-info > div:nth-child(1) { font-size: 0.75rem !important; margin-bottom: 0.2rem; }
          .timeline-cat-info > div:nth-child(2) { font-size: 1.05rem !important; }
          .timeline-cat-info > span { font-size: 0.55rem !important; padding: 0.2rem 0.6rem !important; }
          .timeline-cat-chevron {
            margin-left: 0 !important;
            margin-top: 0.6rem !important;
          }
          .timeline-content-inner {
            padding: 1rem !important;
          }
          .timeline-tree-line, .timeline-tree-dash, .timeline-tree-dot {
            display: none !important;
          }
          .timeline-text-content {
            padding-left: 0 !important;
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .timeline-tech-flex {
            justify-content: center !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

export function ExperienceWindow({ timeline }: { timeline: any[] }) {
  const items = timeline.filter(t => (t.phase||'').toLowerCase().includes('experience') || (t.type||'').toLowerCase().includes('work') || (t.type||'').toLowerCase().includes('experience'));
  const display = items.length > 0 ? items : timeline;
  return (
    <div className="win-experience" style={{ height: '100%', overflowY: 'auto' }}>
      {display.length === 0
        ? <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No experience data yet</div>
        : <div>{display.map((item,i) => <TimelineAccordion key={item.id||i} item={item} index={i} />)}</div>
      }
    </div>
  );
}

export function EducationWindow({ timeline }: { timeline: any[] }) {
  const items = timeline.filter(t => (t.phase||'').toLowerCase().includes('education') || (t.type||'').toLowerCase().includes('edu'));
  const display = items.length > 0 ? items : timeline;
  return (
    <div className="win-education" style={{ height: '100%', overflowY: 'auto' }}>
      {display.length === 0
        ? <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No education data yet</div>
        : <div>{display.map((item,i) => <TimelineAccordion key={item.id||i} item={item} index={i} />)}</div>
      }
    </div>
  );
}
