"use client";
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import profileImg from '../../../assets/jofra.jpeg';

export default function AboutWindow({ info }: { info: any }) {
  const name = info?.name || 'Sivaprakash M';
  const bio = info?.bio || "I'm a passionate Full Stack Developer who loves building modern, scalable, and user-friendly web applications. I enjoy turning complex problems into simple, beautiful, and intuitive solutions.";

  return (
    <div className="win-about-clean" style={{ height: '100%', overflowY: 'auto', padding: '2rem 1rem' }}>
      <style>{`
        .about-container {
          display: flex;
          gap: 4rem;
          max-width: 1000px;
          margin: 0 auto;
          align-items: flex-start;
          margin-bottom: 4rem;
        }
        .about-left {
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .about-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        
        .about-right {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .about-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          margin-top: 0;
        }
        .about-bio {
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          font-size: 1.15rem;
          margin-bottom: 2.5rem;
        }

        .about-resume-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          width: fit-content;
        }
        .about-resume-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .about-container {
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }
          .about-left {
            flex: 0 0 auto;
            width: 100%;
            max-width: 280px;
          }
          .about-title {
            font-size: 2rem;
            text-align: center;
          }
          .about-bio {
            font-size: 1.05rem;
            text-align: center;
          }
          .about-right {
            align-items: center;
          }
        }
        
        @media (max-width: 480px) {
          .about-left {
            max-width: 220px;
          }
          .about-title {
            font-size: 1.75rem;
          }
          .about-bio {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="about-container">
        <motion.div className="about-left" initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{duration:0.6}}>
          <img src={profileImg.src} alt={name} className="about-image" />
        </motion.div>

        <motion.div className="about-right" initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:0.6, delay:0.2}}>
          <h1 className="about-title">About Me</h1>
          <p className="about-bio">{bio}</p>
          
          <a href={info?.resume || '/resume.pdf'} target="_blank" rel="noreferrer" className="about-resume-btn">
            <Download size={18} />
            Download Resume
          </a>
        </motion.div>
      </div>
    </div>
  );
}
