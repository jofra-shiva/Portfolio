"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AboutManager() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // About Info State
  const [infoSaving, setInfoSaving] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [originalInfo, setOriginalInfo] = useState(null);
  const [infoData, setInfoData] = useState({
    aboutBio: '',
    phone: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    leetcode: '',
    instagram: '',
    whatsapp: '',
    facebook: ''
  });

  // Timeline Form State
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    phase: 'Education',
    year: '',
    title: '',
    organization: '',
    description: '',
    cgpa: '',
    badge: '',
    current: false,
    order: 0
  });
  const [savingTimeline, setSavingTimeline] = useState(false);

  // Year range selectors
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i); // last 30 years

  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [badgeOption, setBadgeOption] = useState('');

  const buildYearString = (start: string, end: string) => {
    if (!start && !end) return '';
    if (!end || end === '') return start;
    if (end === 'Present') return `${start} – Present`;
    return `${start} – ${end}`;
  };

  const fetchData = async () => {
    try {
      // Fetch About Info
      const docRef = doc(db, 'portfolioInfo', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const formattedData = {
          ...infoData,
          ...data
        };
        setInfoData(formattedData);
        setOriginalInfo(formattedData);
      }

      // Fetch Timeline
      const q = query(collection(db, 'timeline'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Temporary one-time cleanup and seed of real data
      const needsRealData = !data.some(d => (d as any).organization?.includes('AK Technologies'));
      if (needsRealData) {
        // wipe everything
        for (const d of data) {
          await deleteDoc(doc(db, 'timeline', d.id));
        }
        
        const realData = [
          { phase: 'Education', year: '2023 – 2025', title: 'Master of Computer Applications (MCA)', organization: 'Bishop Heber College, Trichy', description: 'Specializing in full-stack development, software architecture, and modern web technologies.', badge: 'Pursuing', current: true, order: 1 },
          { phase: 'Education', year: '2020 – 2023', title: 'Bachelor of Computer Applications (BCA)', organization: 'Rajah Serfoji Government College', description: 'Foundation in programming, data structures, databases, and core computer science concepts.', badge: 'Completed', current: false, order: 2 },
          { phase: 'Experience', year: 'Ongoing', title: 'Frontend Developer', organization: 'AK Technologies • Coimbatore', description: 'AVSECO ERP company project', badge: 'ONGOING', current: true, order: 3 },
          { phase: 'Experience', year: 'Past', title: 'Web developer', organization: 'Hazzino Technologies • Theni', description: 'Worked at Hazzino as a developer and built a project called Emo News, a dynamic news platform with API integration and responsive UI. Also handled frontend, backend, and performance optimization tasks.', badge: '', current: false, order: 4 }
        ];
        
        for(const item of realData) { await addDoc(collection(db, 'timeline'), item); }
        
        const newSnapshot = await getDocs(q);
        setTimeline(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        toast.success('Real data applied and duplicates fixed!');
      } else {
        setTimeline(data);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- About Info Handlers ---
  const handleInfoChange = (e) => {
    setInfoData({ ...infoData, [e.target.name]: e.target.value });
  };

  const handleCancelInfo = () => {
    if (originalInfo) setInfoData(originalInfo);
    setIsEditingInfo(false);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    try {
      const dataToSave = {
        aboutBio: infoData.aboutBio,
        phone: infoData.phone,
        location: infoData.location,
        email: infoData.email,
        github: infoData.github,
        linkedin: infoData.linkedin,
        leetcode: infoData.leetcode,
        instagram: infoData.instagram,
        whatsapp: infoData.whatsapp,
        facebook: infoData.facebook
      };
      await setDoc(doc(db, 'portfolioInfo', 'main'), dataToSave, { merge: true });
      setOriginalInfo(infoData);
      setIsEditingInfo(false);
      toast.success('About Info saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save info');
    } finally {
      setInfoSaving(false);
    }
  };

  // --- Timeline Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);
    setFormData({ ...formData, [name]: finalValue });
  };

  const resetForm = () => {
    setIsEditingTimeline(false);
    setCurrentId(null);
    setStartYear('');
    setEndYear('');
    setBadgeOption('');
    setFormData({
      phase: 'Education',
      year: '',
      title: '',
      organization: '',
      description: '',
      cgpa: '',
      badge: '',
      current: false,
      order: 0
    });
  };

  const handleEdit = (item) => {
    setIsEditingTimeline(true);
    setCurrentId(item.id);
    // Try to parse the year string back into start/end
    const yearStr = item.year || '';
    const parts = yearStr.split(/\s*[–-]\s*/);
    setStartYear(parts[0]?.trim() || '');
    setEndYear(parts[1]?.trim() || '');
    // Parse badge back into dropdown
    const badge = item.badge || '';
    const knownBadges = ['Pursuing', 'Completed', 'Ongoing'];
    setBadgeOption(knownBadges.includes(badge) ? badge : badge ? 'Others' : '');
    setFormData({
      phase: item.phase || 'Education',
      year: yearStr,
      title: item.title || '',
      organization: item.organization || '',
      description: item.description || '',
      cgpa: item.cgpa || '',
      badge: badge,
      current: !!item.current,
      order: item.order || 0
    });
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'timeline', itemToDelete));
      toast.success('Timeline item deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete timeline item');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Listen for Enter to confirm deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (deleteModalOpen) {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmDelete();
        } else if (e.key === 'Escape') {
          setDeleteModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteModalOpen, itemToDelete]);

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    setSavingTimeline(true);
    try {
      const itemData: any = {
        phase: formData.phase,
        year: formData.year,
        title: formData.title,
        organization: formData.organization,
        description: formData.description,
        badge: formData.badge,
        current: formData.current,
        // Auto-sort: newer start years = smaller order number = shows higher
        order: startYear ? (currentYear - Number(startYear)) : Number(formData.order)
      };
      // Only include cgpa for Education entries
      if (formData.phase === 'Education') {
        itemData.cgpa = formData.cgpa || '';
      }

      if (isEditingTimeline && currentId) {
        await updateDoc(doc(db, 'timeline', currentId), itemData);
        toast.success('Timeline item updated successfully');
      } else {
        await addDoc(collection(db, 'timeline'), itemData);
        toast.success('Timeline item added successfully');
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(isEditingTimeline ? 'Failed to update' : 'Failed to add timeline item');
    } finally {
      setSavingTimeline(false);
    }
  };

  if (loading) {
    return <p>Loading About Data...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ABOUT INFO SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>About Details & Social Links</h2>
          {!isEditingInfo && (
            <button type="button" className="btn btn-primary" onClick={() => setIsEditingInfo(true)}>
              <Edit2 size={16} /> Edit Info
            </button>
          )}
        </div>
        
        <div className="dash-card">
          <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <h3 style={{ margin: '1rem 0 0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Contact Info & Social Links</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Phone Number</label>
                <input type="text" name="phone" className="form-input" value={infoData.phone || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input type="text" name="location" className="form-input" value={infoData.location || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
            </div>

            <h3 style={{ margin: '0.5rem 0 0 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Social Links</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" value={infoData.email || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
              <div>
                <label className="form-label">GitHub URL</label>
                <input type="url" name="github" className="form-input" value={infoData.github || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">LinkedIn URL</label>
                <input type="url" name="linkedin" className="form-input" value={infoData.linkedin || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
              <div>
                <label className="form-label">LeetCode URL</label>
                <input type="url" name="leetcode" className="form-input" value={infoData.leetcode || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Instagram URL</label>
                <input type="url" name="instagram" className="form-input" value={infoData.instagram || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
              <div>
                <label className="form-label">WhatsApp Link or Phone</label>
                <input type="text" name="whatsapp" className="form-input" value={infoData.whatsapp || ''} onChange={handleInfoChange} disabled={!isEditingInfo} placeholder="e.g. https://wa.me/918838939801" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Facebook URL</label>
                <input type="url" name="facebook" className="form-input" value={infoData.facebook || ''} onChange={handleInfoChange} disabled={!isEditingInfo} />
              </div>
            </div>

            {isEditingInfo && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={infoSaving}>
                  {infoSaving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : <><Save size={16} /> Save Details</>}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCancelInfo} disabled={infoSaving}>
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      {/* TIMELINE MANAGER SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Manage About Timeline</h2>
          {!isEditingTimeline && (
            <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
              <Plus size={16} /> Add New Entry
            </button>
          )}
        </div>

        <div className="dash-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>{isEditingTimeline ? 'Edit Timeline Item' : 'Add New Timeline Item'}</h3>
          <form onSubmit={handleTimelineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Timeline Phase</label>
                <select name="phase" className="form-input" value={formData.phase} onChange={handleInputChange}>
                  <option value="Education">Education</option>
                  <option value="Experience">Experience</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label">Start Year</label>
                <select
                  className="form-input"
                  value={startYear}
                  onChange={(e) => {
                    setStartYear(e.target.value);
                    setFormData({ ...formData, year: buildYearString(e.target.value, endYear) });
                  }}
                  required
                >
                  <option value="">-- Start Year --</option>
                  {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label">End Year</label>
                <select
                  className="form-input"
                  value={endYear}
                  onChange={(e) => {
                    setEndYear(e.target.value);
                    setFormData({ ...formData, year: buildYearString(startYear, e.target.value) });
                  }}
                >
                  <option value="">-- End Year --</option>
                  <option value="Present">Present</option>
                  {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Badge Label</label>
                <select
                  className="form-input"
                  value={badgeOption}
                  onChange={(e) => {
                    setBadgeOption(e.target.value);
                    if (e.target.value !== 'Others') {
                      setFormData({ ...formData, badge: e.target.value });
                    } else {
                      setFormData({ ...formData, badge: '' });
                    }
                  }}
                >
                  <option value="">-- Select Badge --</option>
                  <option value="Pursuing">Pursuing</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Others">Others</option>
                </select>
                {badgeOption === 'Others' && (
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '0.5rem' }}
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Enter custom badge label..."
                  />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Event/Degree Title</label>
                <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} placeholder="e.g. Master of Computer Applications (MCA)" required />
              </div>
              <div>
                <label className="form-label">Organization/Institution</label>
                <input type="text" name="organization" className="form-input" value={formData.organization} onChange={handleInputChange} placeholder="e.g. Bishop Heber College, Trichy" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: formData.phase === 'Education' ? '1fr auto' : '1fr', gap: '1rem', alignItems: 'start' }}>
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" rows={3} value={formData.description} onChange={handleInputChange} placeholder={formData.phase === 'Education' ? 'Describe your courses, specialization, or key learnings...' : 'Describe your role, responsibilities, and key achievements...'} required />
              </div>
              {formData.phase === 'Education' && (
                <div style={{ minWidth: '140px' }}>
                  <label className="form-label">CGPA / Grade</label>
                  <input
                    type="text"
                    name="cgpa"
                    className="form-input"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    placeholder="e.g. 8.5 / 10"
                  />
                  <p style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.3rem' }}>Optional — shown on portfolio</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="current" name="current" checked={formData.current} onChange={handleInputChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="current" style={{ color: '#f1f5f9', cursor: 'pointer', userSelect: 'none' }}>Is Current / Active (shows pulse animation)</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={savingTimeline}>
                {savingTimeline ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditingTimeline ? 'Update Item' : 'Save Item')}
              </button>
              {isEditingTimeline && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="dash-card">
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Timeline Entries</h3>
          {timeline.length === 0 ? <p style={{ color: '#94a3b8' }}>No timeline entries found. Add one above!</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* EDUCATION SECTION */}
              <div>
                <h4 style={{ color: '#a78bfa', fontSize: '1.1rem', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(167, 139, 250, 0.2)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  Education
                </h4>
                {timeline.filter(i => i.phase === 'Education').length === 0 ? <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No education entries found.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {timeline.filter(i => i.phase === 'Education').map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.year}</span>
                            {item.badge && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', background: 'rgba(167, 139, 250, 0.1)', color: '#c4b5fd', border: '1px solid rgba(167, 139, 250, 0.2)' }}>{item.badge}</span>}
                            {item.current && <span style={{ fontSize: '0.7rem', color: '#eab308' }}>★ Active</span>}
                          </div>
                          <h4 style={{ margin: '0.4rem 0 0.2rem 0', color: '#f1f5f9' }}>{item.title}</h4>
                          <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', color: '#64748b' }}>{item.organization}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', maxWidth: '800px' }}>{item.description}</p>
                          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                            Order: {item.order} 
                            {item.cgpa && <span style={{ marginLeft: '1rem', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', padding: '0.1rem 0.3rem', borderRadius: '0.2rem' }}>CGPA: {item.cgpa}</span>}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteClick(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EXPERIENCE SECTION */}
              <div>
                <h4 style={{ color: '#00d2ff', fontSize: '1.1rem', margin: '0 0 1rem 0', borderBottom: '1px solid rgba(0, 210, 255, 0.2)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Experience
                </h4>
                {timeline.filter(i => i.phase === 'Experience').length === 0 ? <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No experience entries found.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {timeline.filter(i => i.phase === 'Experience').map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.year}</span>
                            {item.badge && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>{item.badge}</span>}
                            {item.current && <span style={{ fontSize: '0.7rem', color: '#eab308' }}>★ Active</span>}
                          </div>
                          <h4 style={{ margin: '0.4rem 0 0.2rem 0', color: '#f1f5f9' }}>{item.title}</h4>
                          <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', color: '#64748b' }}>{item.organization}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', maxWidth: '800px' }}>{item.description}</p>
                          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Order: {item.order}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteClick(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {deleteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="dash-card" style={{ maxWidth: '400px', width: '90%', background: '#0f172a', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Delete Timeline Item</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>Cancel (Esc)</button>
              <button className="btn btn-primary" onClick={confirmDelete} disabled={isDeleting} style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}>
                {isDeleting ? <><Loader2 size={16} className="dash-loading-spinner"/> Deleting...</> : 'Delete (Enter)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
