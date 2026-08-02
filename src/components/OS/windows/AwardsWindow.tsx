"use client";
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const TROPHIES = ['🏆','🥇','🎖️','🏅','⭐','🎗️','🌟','💎'];

export default function AwardsWindow({ achievements }: { achievements: any[] }) {
  return (
    <div className="win-awards" style={{padding:'1.5rem'}}>
      {achievements.length === 0
        ? (
          <div style={{textAlign:'center',padding:'4rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🏆</div>
            <p>Awards and recognitions loading...</p>
          </div>
        )
        : (
          <div className="win-awards__grid">
            {achievements.map((ach,i) => (
              <motion.div key={ach.id||i} className="win-award-card" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,type:'spring',stiffness:280,damping:24}} whileHover={{y:-8,scale:1.02}}>
                <motion.span className="win-award-card__trophy" animate={{rotate:[0,10,-10,0]}} transition={{duration:2,delay:i*0.3,repeat:Infinity,repeatDelay:4}}>
                  {TROPHIES[i % TROPHIES.length]}
                </motion.span>
                <div className="win-award-card__title">{ach.title}</div>
                {ach.organization && <div className="win-award-card__org">{ach.organization}</div>}
                {ach.date && <div className="win-award-card__date">{ach.date}</div>}
                {ach.description && <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.4)',marginTop:'0.5rem',lineHeight:1.5}}>{ach.description}</div>}
                {ach.link && (
                  <a href={ach.link} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:'0.75rem',fontSize:'0.7rem',color:'rgba(99,102,241,0.8)',textDecoration:'none',fontFamily:'var(--font-satoshi)',fontWeight:600}} aria-label={`Verify ${ach.title}`}>
                    Verify <ExternalLink size={10} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )
      }
    </div>
  );
}
