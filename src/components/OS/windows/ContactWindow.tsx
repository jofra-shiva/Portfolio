"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { sendContact } from '../../../lib/db';

export default function ContactWindow({ info }: { info: any }) {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const correctedPhone = info?.phone === '+91 883893801' ? '+91 8838939801' : info?.phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await sendContact(form);
      await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      setSent(true);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleWhatsApp = () => {
    if (!form.name || !form.message) return toast.error('Fill name and message first');
    const phone = (correctedPhone || '918838939801').replace(/[^0-9]/g,'');
    const text = `New Portfolio Enquiry%0AName: ${form.name}%0AEmail: ${form.email||'N/A'}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
  };

  const socials = [
    { icon: <FiGithub size={16}/>, href: info?.github, label:'GitHub' },
    { icon: <FiLinkedin size={16}/>, href: info?.linkedin, label:'LinkedIn' },
    { icon: <FiInstagram size={16}/>, href: info?.instagram, label:'Instagram' },
    { icon: <FiFacebook size={16}/>, href: info?.facebook, label:'Facebook' },
    { icon: <FaWhatsapp size={16}/>, href: correctedPhone ? `https://wa.me/${correctedPhone.replace(/[^0-9]/g,'')}` : null, label:'WhatsApp' },
  ].filter(s => s.href);

  return (
    <div className="win-contact" style={{padding:'1.5rem'}}>
      <div className="win-contact__grid">
        {/* Form */}
        <div className="win-contact__form-card">
          <div className="win-contact__form-title"><Zap size={14} style={{color:'#6366f1'}}/> Send a Message</div>
          {sent ? (
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} style={{textAlign:'center',padding:'2rem',fontFamily:'var(--font-satoshi)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>✅</div>
              <div style={{color:'#22c55e',fontWeight:700,marginBottom:'0.5rem'}}>Message Sent!</div>
              <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.8rem'}}>I&apos;ll get back to you soon.</div>
              <button onClick={() => setSent(false)} style={{marginTop:'1rem',background:'rgba(99,102,241,0.2)',border:'1px solid rgba(99,102,241,0.4)',borderRadius:8,padding:'0.4rem 1rem',color:'white',cursor:'pointer',fontFamily:'var(--font-satoshi)',fontSize:'0.8rem'}}>Send Another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row" style={{marginBottom:'0.75rem'}}>
                <div className="form-group"><label className="form-label">Name *</label><input className="form-input" name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required id="contact-name" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required id="contact-email" /></div>
              </div>
              <div className="form-group" style={{marginBottom:'0.75rem'}}><label className="form-label">Subject</label><input className="form-input" name="subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Project inquiry" id="contact-subject" /></div>
              <div className="form-group" style={{marginBottom:'1rem'}}><label className="form-label">Message *</label><textarea className="form-input" name="message" rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me about your project..." required id="contact-message" /></div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{flex:1}} id="contact-submit">{loading ? 'Sending...' : <><Send size={13}/> Send</>}</button>
                <button type="button" onClick={handleWhatsApp} className="btn btn-whatsapp" style={{flex:1}} id="contact-whatsapp"><FaWhatsapp size={14}/> WhatsApp</button>
              </div>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="win-contact__info-card">
          <div className="win-contact__status">
            <div className="win-contact__status-dot"/>
            <span className="win-contact__status-text">Available for opportunities</span>
          </div>
          <div className="win-contact__info-title">Let&apos;s Talk</div>
          <div className="win-contact__info-sub">I&apos;m open for freelance, full-time roles, and collaborations.</div>

          {info?.email && (
            <div className="win-contact__detail">
              <div className="win-contact__detail-icon"><Mail size={14}/></div>
              <div><div className="win-contact__detail-label">Email</div><a href={`mailto:${info.email}`} className="win-contact__detail-value">{info.email}</a></div>
            </div>
          )}
          {correctedPhone && (
            <div className="win-contact__detail">
              <div className="win-contact__detail-icon"><Phone size={14}/></div>
              <div><div className="win-contact__detail-label">Phone</div><a href={`tel:${correctedPhone}`} className="win-contact__detail-value">{correctedPhone}</a></div>
            </div>
          )}
          {info?.location && (
            <div className="win-contact__detail">
              <div className="win-contact__detail-icon"><MapPin size={14}/></div>
              <div><div className="win-contact__detail-label">Location</div><span className="win-contact__detail-value">{info.location}</span></div>
            </div>
          )}

          {socials.length > 0 && (
            <div className="win-contact__socials">
              {socials.map((s,i) => (
                <a key={i} href={s.href!} target="_blank" rel="noreferrer" className="win-contact__social" title={s.label} aria-label={s.label}>{s.icon}</a>
              ))}
              {info?.resume && (
                <a href={info.resume} target="_blank" rel="noreferrer" className="win-contact__social" title="Download Resume" aria-label="Download Resume" style={{fontSize:'0.8rem',fontWeight:700,width:'auto',padding:'0 0.75rem'}}>📄 CV</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
