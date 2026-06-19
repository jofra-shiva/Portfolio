"use client";
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Code2, Star, X } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Projects.css';

const ProjectCard = ({ project, onClick, index }) => {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<any>(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 18;
    
    card.style.transition = 'transform 0.1s linear';
    card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <motion.div
      ref={cardRef}
      className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Image area */}
      <div className="project-card__img-wrap">
        {!imgError && project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="project-card__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="project-card__placeholder">
            <Code2 size={40} strokeWidth={1.5} />
          </div>
        )}

        {project.featured && (
          <span className="project-card__featured">
            <Star size={11} fill="currentColor" /> Featured
          </span>
        )}

        <div className="project-card__img-overlay">
          <span>View Details</span>
        </div>

        {/* Scan line on hover */}
        <div className="project-card__scan" />
      </div>

      {/* Body */}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {(project.techStack || project.tech || []).slice(0, 3).map((t, i) => (
            <span key={i} className="badge">{t}</span>
          ))}
          {(project.techStack || project.tech || [])?.length > 3 && (
            <span className="badge badge--more">+{(project.techStack || project.tech || []).length - 3}</span>
          )}
        </div>

        {/* Action links */}
        <div className="project-card__links" onClick={e => e.stopPropagation()}>
          {(project.githubLink || project.links?.github) && (
            <a href={project.githubLink || project.links?.github} target="_blank" rel="noreferrer" className="project-card__link">
              <FiGithub size={14} /> Code
            </a>
          )}
          {(project.liveLink || project.links?.demo) && (
            <a href={project.liveLink || project.links?.demo} target="_blank" rel="noreferrer" className="project-card__link project-card__link--live">
              <ExternalLink size={14} /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ projects, loading, info }) => {
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInst, setSwiperInst] = useState(null);
  const githubUrl = info?.github || 'https://github.com';
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="section projects">
      <div className="projects__bg-glow" />
      <div className="container">
        <div className="section-header" ref={ref}>
          <h2 className="section-title">
            <span className="gradient-text">Projects</span> I've Built
          </h2>
          <div className="neon-divider" />
        </div>

        {loading ? (
          <div className="spinner" />
        ) : projects.length > 0 ? (
          <>
            <motion.div
              className="projects__carousel"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Swiper
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                spaceBetween={30}
                loop={projects.length > 1}
                coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1.5, slideShadows: false }}
                autoplay={projects.length >= 2 ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                navigation={true}
                onSwiper={setSwiperInst}
                onSlideChange={(s) => setActiveIndex(s.realIndex % projects.length)}
                modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
                className="projects__swiper"
              >
                {(() => {
                  if (projects.length <= 1) return projects;
                  let display = [...projects];
                  while (display.length < 12) {
                    display = [...display, ...projects];
                  }
                  return display;
                })().map((p, i) => (
                  <SwiperSlide key={`${p._id || p.id || p.title}-${i}`}>
                    <ProjectCard project={p} onClick={setSelected} index={i % projects.length} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {projects.length > 1 && (
                <div className="projects__dots">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      className={`projects__dot ${i === activeIndex ? 'active' : ''}`}
                      onClick={() => swiperInst?.slideToLoop(i)}
                      aria-label={`Go to project ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="projects__cta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                <FiGithub size={18} /> View All on GitHub
              </a>
            </motion.div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <Code2 size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Projects are being curated. Stay tuned!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <motion.div
          className="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="project-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="project-modal__close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>

            <div className="project-modal__content">
              <div className="project-modal__gallery">
                {selected.images && selected.images.length > 0 ? (
                  <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]}>
                    {[selected.image, ...selected.images].filter(Boolean).map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} alt={selected.title} className="project-modal__img" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : selected.image ? (
                  <img src={selected.image} alt={selected.title} className="project-modal__img" />
                ) : (
                  <div className="project-card__placeholder"><Code2 size={48} /></div>
                )}
              </div>

              <div className="project-modal__details">
                <h3 className="project-modal__title">{selected.title}</h3>
                <div className="project-modal__tags">
                  {(selected.techStack || selected.tech || []).map((t, i) => (
                    <span key={i} className="badge">{t}</span>
                  ))}
                </div>
                <p className="project-modal__desc">{selected.longDescription || selected.description}</p>
                <div className="project-modal__links">
                  {(selected.githubLink || selected.links?.github) && (
                    <a href={selected.githubLink || selected.links?.github} target="_blank" rel="noreferrer" className="btn btn-outline">
                      <FiGithub size={16} /> Code
                    </a>
                  )}
                  {(selected.liveLink || selected.links?.demo) && (
                    <a href={selected.liveLink || selected.links?.demo} target="_blank" rel="noreferrer" className="btn btn-primary">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;
