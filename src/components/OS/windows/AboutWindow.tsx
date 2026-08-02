"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { title: 'Who I Am', icon: '👤', content: 'A passionate Full Stack Developer from Tamil Nadu, India. I craft immersive web experiences with the MERN stack, blending clean code with stunning UI.' },
  { title: 'Mission', icon: '🎯', content: 'To build scalable, beautiful digital products that make a real difference. I believe great software is both technically excellent and a joy to use.' },
  { title: 'Current Focus', icon: '🔥', content: 'Pursuing MCA at Bishop Heber College. Actively building full-stack applications, exploring AI integrations, and contributing to open source.' },
  { title: 'Interests', icon: '💡', content: 'Web development, UI/UX design, artificial intelligence, competitive programming, and exploring new technologies on the cutting edge.' },
  { title: 'Goals', icon: '🚀', content: 'To join a world-class tech team, build products used by millions, and contribute meaningfully to the developer community through open source.' },
  { title: 'Future Vision', icon: '🌟', content: 'To become a tech lead who builds impactful products at scale, while mentoring the next generation of developers from India to the world.' },
];

export default function AboutWindow({ info }: { info: any }) {
  const [active, setActive] = useState<number | null>(null);
  const name = info?.name || 'Sivaprakash M';
  const bio = info?.bio || 'Full Stack Developer · MCA Student · MERN Stack · Open Source';

  return (
    <div className="win-about">
      <div className="win-about__mindmap">
        <motion.div className="win-about__center" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:300,damping:25}}>
          {info?.avatar && <img src={info.avatar} alt={name} style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',marginBottom:6}} />}
          <div className="win-about__center-name">{name}</div>
          <div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.5)',marginTop:4,textAlign:'center'}}>{info?.title || 'Full Stack Dev'}</div>
        </motion.div>

        <div className="win-about__nodes">
          {NODES.map((node, i) => (
            <motion.div
              key={i}
              className="win-about__node"
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.07}}
              onClick={() => setActive(active === i ? null : i)}
              id={`about-node-${i}`}
              role="button"
              tabIndex={0}
              aria-expanded={active === i}
              onKeyDown={e => e.key === 'Enter' && setActive(active === i ? null : i)}
            >
              <div className="win-about__node-title">{node.icon} {node.title}</div>
              <motion.div
                className="win-about__node-content"
                initial={false}
                animate={{ height: active === i ? 'auto' : '2.8rem', overflow: 'hidden' }}
                style={{ display: '-webkit-box', WebkitLineClamp: active === i ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: active === i ? 'visible' : 'hidden' }}
              >
                {active === i ? node.content : (info && node.title === 'Who I Am' ? (bio || node.content) : node.content)}
              </motion.div>
              {active !== i && <div style={{fontSize:'0.7rem',color:'rgba(99,102,241,0.7)',marginTop:4,fontFamily:'var(--font-satoshi)'}}>Click to expand →</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
