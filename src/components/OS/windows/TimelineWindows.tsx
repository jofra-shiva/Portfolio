"use client";
import { motion } from 'framer-motion';

function TimelineItem({ item, index }: { item: any; index: number }) {
  return (
    <motion.div className="win-timeline-item" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:index*0.08}}>
      <div className="win-timeline-item__card">
        <div className="win-timeline-item__year">
          {item.year}
          {item.badge && <span className="win-timeline-item__badge" data-badge={item.badge}>{item.badge}</span>}
        </div>
        <div className="win-timeline-item__title">{item.title}</div>
        <div className="win-timeline-item__org">{item.organization || item.org}</div>
        {item.cgpa && <div style={{fontSize:'0.72rem',color:'rgba(99,102,241,0.8)',marginBottom:'0.3rem',fontFamily:'var(--font-satoshi)',fontWeight:600}}>CGPA: {item.cgpa}</div>}
        <div className="win-timeline-item__desc">{item.description || item.desc}</div>
        {item.tech && <div className="win-timeline-item__tags">{(item.tech||[]).slice(0,6).map((t: string,i: number) => <span key={i} className="win-tag">{t}</span>)}</div>}
      </div>
    </motion.div>
  );
}

export function ExperienceWindow({ timeline }: { timeline: any[] }) {
  const items = timeline.filter(t => (t.phase||'').toLowerCase().includes('experience') || (t.type||'').toLowerCase().includes('work') || (t.type||'').toLowerCase().includes('experience'));
  const display = items.length > 0 ? items : timeline;
  return (
    <div className="win-experience" style={{padding:'1.5rem'}}>
      {display.length === 0
        ? <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No experience data yet</div>
        : <div className="win-timeline">{display.map((item,i) => <TimelineItem key={item.id||i} item={item} index={i} />)}</div>
      }
    </div>
  );
}

export function EducationWindow({ timeline }: { timeline: any[] }) {
  const items = timeline.filter(t => (t.phase||'').toLowerCase().includes('education') || (t.type||'').toLowerCase().includes('edu'));
  const display = items.length > 0 ? items : timeline;
  return (
    <div className="win-education" style={{padding:'1.5rem'}}>
      {display.length === 0
        ? <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No education data yet</div>
        : <div className="win-timeline">{display.map((item,i) => <TimelineItem key={item.id||i} item={item} index={i} />)}</div>
      }
    </div>
  );
}
