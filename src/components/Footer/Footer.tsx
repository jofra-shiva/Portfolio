import { ArrowUp, Mail } from 'lucide-react';
import { FiGithub, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import logoImg from '../../assets/logo.png';
import { getLenis } from '../../hooks/useLenis';
import './Footer.css';

const Footer = ({ info }) => {
  const scrollTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const year = new Date().getFullYear();

  const socials = [
    { icon: <FiGithub size={18} />, href: info?.github, label: 'GitHub' },
    { icon: <FiLinkedin size={18} />, href: info?.linkedin, label: 'LinkedIn' },
    { icon: <FiInstagram size={18} />, href: info?.instagram, label: 'Instagram' },
    { icon: <FiFacebook size={18} />, href: info?.facebook, label: 'Facebook' },
    { icon: <Mail size={18} />, href: info?.email ? `mailto:${info.email}` : null, label: 'Email' },
  ].filter(s => s.href);

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="footer__top-line" />

      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <img
              src={logoImg.src}
              alt={`${info?.name || 'Sivaprakash M'} — Portfolio Logo`}
              className="footer__logo"
              width={32}
              height={32}
            />
            <span className="footer__brand-name">{info?.name || 'Sivaprakash M'}</span>
          </div>

          {/* Center text */}
          <p className="footer__copy">
            © {year} {info?.name || 'Sivaprakash M'}. All rights reserved.
            <span className="footer__sep">|</span>
            <a href="/privacy" className="footer__link">Privacy Policy</a>
          </p>

          {/* Socials + scroll top */}
          <div className="footer__right">
            <div className="footer__socials">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noreferrer"
                  className="social-icon"
                  title={s.label}
                  aria-label={`${info?.name || 'Sivaprakash M'} on ${s.label}`}
                  style={{ width: 36, height: 36 }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <button
              className="footer__scroll-top"
              onClick={scrollTop}
              title="Back to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
