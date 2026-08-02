"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const CATS = ['All','Frontend','Backend','Database','Cloud','AI/ML','Tools','Programming'];

function SkillCard({ skill, index }: { skill: any; index: number }) {
  const name = skill.name || skill.skill || 'Skill';
  const level = Number(skill.level || skill.proficiency || 80);
  return (
    <motion.div className="win-skill-card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:index*0.04}}>
      <div className="win-skill-card__icon">
        <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase().replace(/[ .]/g,'-').replace('js','-js').replace('--','-')}/`+`${name.toLowerCase().replace(/[ .]/g,'-').replace('js','-js').replace('--','-')}-original.svg`} alt={name} width={22} height={22} onError={e=>{(e.target as any).style.display='none'}} />
      </div>
      <div className="win-skill-card__name">{name}</div>
      <div className="win-skill-bar">
        <motion.div className="win-skill-bar__fill" initial={{scaleX:0}} animate={{scaleX:level/100}} transition={{duration:0.8,delay:index*0.04+0.2,ease:'easeOut'}} />
      </div>
      <div style={{fontFamily:'var(--font-satoshi)',fontSize:'0.65rem',color:'rgba(255,255,255,0.35)',textAlign:'right'}}>{level}%</div>
    </motion.div>
  );
}

export default function SkillsWindow({ skills }: { skills: any[] }) {
  const [tab, setTab] = useState('All');
  const disp = skills.filter(s => tab === 'All' || (s.category||'').toLowerCase().includes(tab.toLowerCase()));
  return (
    <div className="win-skills">
      <div className="win-skills__tabs">
        {CATS.map(c => <button key={c} className={`win-skill-tab${tab===c?' active':''}`} onClick={() => setTab(c)} id={`skill-tab-${c.toLowerCase()}`}>{c}</button>)}
      </div>
      {disp.length === 0
        ? <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.3)',fontFamily:'var(--font-satoshi)'}}>No skills in this category</div>
        : <div className="win-skills__grid">{disp.map((s,i) => <SkillCard key={s.id||i} skill={s} index={i} />)}</div>
      }
    </div>
  );
}
