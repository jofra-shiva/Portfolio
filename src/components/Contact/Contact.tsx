"use client";
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Zap } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { sendContact } from '../../lib/db';
import './Contact.css';

const Contact = ({ info }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message)
      return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await sendContact(form);
      
      // Trigger the automated email response
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const correctedPhone = info?.phone === '+91 883893801' ? '+91 8838939801' : info?.phone;

  const handleWhatsApp = () => {
    if (!form.name || !form.message) return toast.error('Fill name and message first');
    const phone = (correctedPhone || '918838939801').replace(/[^0-9]/g, '');
    const text = `New Portfolio Enquiry%0AName: ${form.name}%0AEmail: ${form.email || 'N/A'}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const contactItems = [
    { icon: <Mail size={18} />, label: 'Email', value: info?.email, href: `mailto:${info?.email}` },
    { icon: <Phone size={18} />, label: 'Phone', value: correctedPhone, href: `tel:${correctedPhone}` },
    { icon: <MapPin size={18} />, label: 'Location', value: info?.location },
  ].filter(c => c.value);

  const socials = [
    { icon: <FiGithub size={20} />, href: info?.github, label: 'GitHub' },
    { icon: <FiLinkedin size={20} />, href: info?.linkedin, label: 'LinkedIn' },
    { icon: <FiInstagram size={20} />, href: info?.instagram, label: 'Instagram' },
    { icon: <FiFacebook size={20} />, href: info?.facebook, label: 'Facebook' },
  ].filter(s => s.href);

  return (
    <section id="contact" className="section contact">
      <div className="contact__bg-glow" />

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <div className="neon-divider" />
        </div>

        <div className="contact__grid" ref={ref}>
          {/* === FORM === */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="contact__form-card">
              <div className="contact__form-topbar" />
              <h3 className="contact__form-title">
                <Zap size={18} style={{ color: 'var(--neon-violet)' }} />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      className="form-input"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>

                <div className="contact__btn-group">
                  <button
                    type="submit"
                    className="btn btn-primary contact__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="contact__spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="btn btn-whatsapp"
                    style={{ flex: 1 }}
                  >
                    <FaWhatsapp size={16} />
                    WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* === INFO === */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="contact__info-card">
              <h3 className="contact__info-title">Let's Talk</h3>
              <p className="contact__info-sub">
                I'm currently open for freelance work and full-time positions. My inbox is always open!
              </p>

              <div className="contact__details">
                {contactItems.map((item, i) => (
                  <div key={i} className="contact__detail">
                    <div className="contact__detail-icon">{item.icon}</div>
                    <div>
                      <div className="contact__detail-label">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="contact__detail-value">{item.value}</a>
                      ) : (
                        <span className="contact__detail-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>



              {/* Socials */}
              {socials.length > 0 && (
                <div className="contact__socials">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon"
                      title={s.label}
                      aria-label={`Visit ${info?.name || 'Sivaprakash'} on ${s.label}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
