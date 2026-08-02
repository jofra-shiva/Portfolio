"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Zap, FileText } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { sendContact } from '../../../lib/db';

export default function ContactWindow({ info }: { info: any }) {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const correctedPhone = info?.phone === '+91 883893801' ? '+91 8838939801' : info?.phone;

  const showPremiumToast = (title: string, message: string, type: 'success' | 'error') => {
    toast.custom((t) => (
      <div style={{
        opacity: t.visible ? 1 : 0, transition: 'opacity 0.3s ease',
        background: type === 'success' ? 'rgba(10, 25, 15, 0.95)' : 'rgba(25, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${type === 'success' ? 'rgba(0, 255, 128, 0.3)' : 'rgba(255, 60, 60, 0.3)'}`,
        boxShadow: `0 10px 40px ${type === 'success' ? 'rgba(0, 255, 128, 0.2)' : 'rgba(255, 60, 60, 0.2)'}`,
        padding: '1.2rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.2rem',
        color: 'white', maxWidth: '400px'
      }}>
        <div style={{ background: type === 'success' ? 'rgba(0, 255, 128, 0.1)' : 'rgba(255, 60, 60, 0.1)', padding: '0.8rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
          {type === 'success' ? <Send size={24} color="#00ff80" /> : <Zap size={24} color="#ff3c3c" />}
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: type === 'success' ? '#00ff80' : '#ff3c3c', letterSpacing: '0.5px' }}>{title}</div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem', lineHeight: 1.4 }}>{message}</div>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return showPremiumToast('Missing Details', 'Please fill in your name, email, and message.', 'error');
    setLoading(true);
    try {
      await sendContact(form);
      await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      setSent(true);
      showPremiumToast('Message Sent!', "I'll get back to you as soon as possible.", 'success');
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch { showPremiumToast('Failed to Send', 'An error occurred. Please try again or use WhatsApp.', 'error'); }
    finally { setLoading(false); }
  };

  const handleWhatsApp = () => {
    if (!form.name || !form.message) return showPremiumToast('Missing Details', 'Please enter your name and message to chat on WhatsApp.', 'error');
    const phone = (correctedPhone || '918838939801').replace(/[^0-9]/g,'');
    const text = `New Portfolio Enquiry%0AName: ${form.name}%0AEmail: ${form.email||'N/A'}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
  };

  const socials = [
    { icon: <FiGithub size={18}/>, href: info?.github, label:'GitHub' },
    { icon: <FiLinkedin size={18}/>, href: info?.linkedin, label:'LinkedIn' },
    { icon: <FiInstagram size={18}/>, href: info?.instagram, label:'Instagram' },
    { icon: <FiFacebook size={18}/>, href: info?.facebook, label:'Facebook' },
    { icon: <FaWhatsapp size={18}/>, href: correctedPhone ? `https://wa.me/${correctedPhone.replace(/[^0-9]/g,'')}` : null, label:'WhatsApp' },
  ].filter(s => s.href);

  return (
    <div className="contact-window-container">
      <style>{`
        .contact-window-container {
          padding: 2rem;
          height: 100%;
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .contact-window-container {
            padding: 1rem;
          }
          .premium-contact-card {
            padding: 1.5rem !important;
          }
        }

        .premium-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-contact-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .premium-form-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .premium-form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .premium-form-group {
          flex: 1 1 200px;
          display: flex;
          flex-direction: column;
          margin-bottom: 2rem;
        }

        .premium-form-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
        }

        .premium-form-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1rem 1.2rem;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
          width: 100%;
        }
        
        .premium-form-input:focus {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 255, 135, 0.5);
          box-shadow: 0 0 0 4px rgba(0, 255, 135, 0.1);
        }

        .premium-form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .premium-btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }

        .premium-btn {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        }

        .premium-btn-primary {
          background: linear-gradient(135deg, #00ff87, #60efff);
          color: #000;
          box-shadow: 0 4px 20px rgba(0, 255, 135, 0.3);
        }
        .premium-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 255, 135, 0.5);
        }

        .premium-btn-whatsapp {
          background: rgba(37, 211, 102, 0.1);
          border: 1px solid rgba(37, 211, 102, 0.3);
          color: #25D366;
        }
        .premium-btn-whatsapp:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(37, 211, 102, 0.2);
          border-color: rgba(37, 211, 102, 0.5);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.2);
        }

        .premium-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .premium-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 99px;
          color: #4ade80;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          width: fit-content;
        }

        .premium-status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 10px #4ade80;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        .premium-info-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .premium-info-sub {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .premium-detail {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .premium-detail-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          flex-shrink: 0;
          background: rgba(0, 255, 135, 0.05);
          border: 1px solid rgba(0, 255, 135, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00ff87;
        }

        .premium-detail-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .premium-detail-val {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.1rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          word-break: break-word;
        }
        a.premium-detail-val:hover {
          color: #00ff87;
        }

        .premium-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .premium-social {
          width: 46px;
          height: 46px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .premium-social.resume {
          width: auto;
          padding: 0 1.2rem;
          font-size: 0.9rem;
          font-weight: 700;
          gap: 0.5rem;
        }
        .premium-social:hover {
          background: rgba(0, 255, 135, 0.1);
          border-color: rgba(0, 255, 135, 0.3);
          color: #00ff87;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="premium-contact-grid">
        {/* Form Panel */}
        <motion.div className="premium-contact-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
          <h2 className="premium-info-title">Send a Message</h2>
          <p className="premium-info-sub">Fill out the form below and I'll get back to you as soon as possible.</p>
          
          {sent ? (
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} style={{textAlign:'center',padding:'3rem 1rem'}}>
              <div style={{color:'#4ade80', marginBottom:'1rem'}}>
                <Send size={48} />
              </div>
              <div style={{color:'#4ade80',fontWeight:700,fontSize:'1.5rem',marginBottom:'0.5rem'}}>Message Sent!</div>
              <div style={{color:'rgba(255,255,255,0.5)',marginBottom:'2rem'}}>I'll get back to you soon.</div>
              <button 
                onClick={() => setSent(false)} 
                className="premium-btn premium-btn-primary" 
                style={{width:'fit-content', margin:'0 auto', padding:'0.8rem 1.5rem'}}
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="premium-form-row">
                <div className="premium-form-group" style={{marginBottom: 0}}>
                  <label className="premium-form-label">Name *</label>
                  <input className="premium-form-input" name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required />
                </div>
                <div className="premium-form-group" style={{marginBottom: 0}}>
                  <label className="premium-form-label">Email *</label>
                  <input className="premium-form-input" type="email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="premium-form-group">
                <label className="premium-form-label">Subject</label>
                <input className="premium-form-input" name="subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Project inquiry" />
              </div>
              <div className="premium-form-group">
                <label className="premium-form-label">Message *</label>
                <textarea className="premium-form-input" name="message" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me about your project..." required />
              </div>
              
              <div className="premium-btn-group">
                <button type="submit" className="premium-btn premium-btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : <><Send size={16}/> Send</>}
                </button>
                <button type="button" onClick={handleWhatsApp} className="premium-btn premium-btn-whatsapp">
                  <FaWhatsapp size={18}/> WhatsApp
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Info Panel */}
        <motion.div className="premium-contact-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5, delay:0.1}}>
          
          <h2 className="premium-info-title">Let's Talk</h2>
          <p className="premium-info-sub">I'm open for freelance, full-time roles, and collaborations.</p>

          {info?.email && (
            <div className="premium-detail">
              <div className="premium-detail-icon"><Mail size={18}/></div>
              <div>
                <div className="premium-detail-label">Email</div>
                <a href={`mailto:${info.email}`} className="premium-detail-val">{info.email}</a>
              </div>
            </div>
          )}
          {correctedPhone && (
            <div className="premium-detail">
              <div className="premium-detail-icon"><Phone size={18}/></div>
              <div>
                <div className="premium-detail-label">Phone</div>
                <a href={`tel:${correctedPhone}`} className="premium-detail-val">{correctedPhone}</a>
              </div>
            </div>
          )}
          {info?.location && (
            <div className="premium-detail">
              <div className="premium-detail-icon"><MapPin size={18}/></div>
              <div>
                <div className="premium-detail-label">Location</div>
                <span className="premium-detail-val">{info.location}</span>
              </div>
            </div>
          )}

          {socials.length > 0 && (
            <div className="premium-socials">
              {socials.map((s,i) => (
                <a key={i} href={s.href!} target="_blank" rel="noreferrer" className="premium-social" title={s.label} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
              {info?.resume && (
                <a href={info.resume} target="_blank" rel="noreferrer" className="premium-social resume" title="Download Resume">
                  <FileText size={16} /> CV
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
