"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';

function AwardAccordion({ item, index }: { item: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:index*0.05}} style={{ marginBottom: '1.2rem' }}>
      <div 
        className="award-header"
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
        <div className="award-cat-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div className="award-date" style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '0.85rem', 
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontFamily: 'monospace'
          }}>
            {item.date}
          </div>
          <div className="award-title" style={{ fontWeight: 600, fontSize: '1.15rem', color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            {item.title}
          </div>
        </div>
        <motion.div className="award-cat-chevron" animate={{ rotate: isOpen ? 180 : 0 }} style={{ flexShrink: 0, marginLeft: '1rem', color: 'rgba(255,255,255,0.4)' }}>
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
            <div className="award-body" style={{ 
              padding: '1.5rem', 
              background: 'rgba(0,0,0,0.15)', 
              border: '1px solid rgba(255,255,255,0.04)', 
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              position: 'relative'
            }}>
              <div className="award-line-v" style={{ position: 'absolute', left: '32px', top: '0', bottom: '32px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              
              <div className="award-content" style={{ paddingLeft: '40px', position: 'relative' }}>
                <div className="award-tree-dash" style={{ position: 'absolute', left: '-12px', top: '12px', width: '10px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div className="award-tree-dot" style={{ position: 'absolute', left: '-14px', top: '9px', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', letterSpacing: '-0.2px' }}>
                  {item.organization || item.org}
                </div>
                
                <div style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 400 }}>
                  {item.description || item.desc}
                </div>
                
                {item.link && (
                  <div style={{ marginTop: '1rem' }}>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'} onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}>
                      <span>Verify Credential</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AwardsWindow({ achievements }: { achievements: any[] }) {
  return (
    <div className="awards-window-container">
      <style>{`
        .awards-window-container {
          padding: 2rem;
          height: 100%;
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .awards-window-container {
            padding: 1rem;
          }
          .award-header {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1rem !important;
          }
          .award-cat-info {
            flex-direction: column !important;
            justify-content: center !important;
            gap: 0.4rem !important;
          }
          .award-cat-chevron {
            margin-left: 0 !important;
            margin-top: 0.6rem !important;
          }
          .award-body {
            padding: 1rem !important;
          }
          .award-date {
            font-size: 0.75rem !important;
            margin-bottom: 0.2rem !important;
          }
          .award-title {
            font-size: 1.05rem !important;
          }
          .award-line-v, .award-tree-dash, .award-tree-dot {
            display: none !important;
          }
          .award-content {
            padding-left: 0 !important;
            text-align: center !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
      {achievements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', opacity: 0.5 }}>
            <Trophy size={48} strokeWidth={1} />
          </div>
          <p>No awards added yet.</p>
        </div>
      ) : (
        <div>
          {achievements.map((ach, i) => (
            <AwardAccordion key={ach.id || i} item={ach} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
