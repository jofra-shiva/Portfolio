"use client";
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Loader2, Save, Edit2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile } from '../../../../lib/storage';

export default function InfoManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sivaprakash M',
    title: 'Full Stack Developer',
    bio: '',
    yearsExp: 'Fresher',
    degree: 'MCA',
    projectsCount: '4+',
    commitsCount: '500+',
    email: '',
    github: '',
    linkedin: '',
    leetcode: '',
    phone: '',
    location: '',
    instagram: '',
    whatsapp: '',
    facebook: '',
    resume: '',
    typingTexts: 'Full Stack Architect, Systems Designer, MERN Stack Specialist, Creative Technologist',
    themeName: 'purple'
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, 'portfolioInfo', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const formattedData = {
            ...formData,
            ...data,
            typingTexts: Array.isArray(data.typingTexts) ? data.typingTexts.join(', ') : data.typingTexts || formData.typingTexts
          };
          setFormData(formattedData);
          setOriginalData(formattedData);

          // Apply initial color theme preview
          if (data.themeName) {
            document.documentElement.setAttribute('data-color-theme', data.themeName);
          }
        }
      } catch (err) {
        toast.error('Failed to load info');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'themeName') {
      document.documentElement.setAttribute('data-color-theme', e.target.value);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      document.documentElement.setAttribute('data-color-theme', originalData.themeName || 'purple');
    }
    setIsEditing(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    setUploadingResume(true);
    const loadingToast = toast.loading('Uploading resume...');
    try {
      const fileExt = file.name.split('.').pop();
      const storagePath = `resumes/resume_${Date.now()}.${fileExt}`;
      const downloadUrl = await uploadFile(file, storagePath);
      
      setFormData(prev => ({ ...prev, resume: downloadUrl }));
      toast.success('Resume uploaded successfully!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload resume', { id: loadingToast });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const textsArray = formData.typingTexts.split(',').map(t => t.trim()).filter(t => t);
      const dataToSave = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        resume: formData.resume,
        typingTexts: textsArray,
        themeName: formData.themeName || 'purple'
      };
      
      await setDoc(doc(db, 'portfolioInfo', 'main'), dataToSave, { merge: true });
      setOriginalData(formData);
      setIsEditing(false);
      toast.success('Home Section saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading portfolio info...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Home Section</h2>
        {!isEditing && (
          <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <Edit2 size={16} /> Edit Home Info
          </button>
        )}
      </div>

      <div className="dash-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} disabled={!isEditing} required />
            </div>
            <div>
              <label className="form-label">Main Title</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} disabled={!isEditing} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Color Theme</label>
              <select name="themeName" className="form-input" value={formData.themeName || 'purple'} onChange={handleInputChange} disabled={!isEditing}>
                <option value="purple">Cyberpunk Purple (Default)</option>
                <option value="blue">Neon Blue (Cyan/Blue)</option>
                <option value="green">Emerald Cyber (Green/Gold)</option>
                <option value="orange">Sunset Glow (Orange/Pink)</option>
                <option value="rose">Rose & Magenta (Crimson/Violet)</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1.2rem', display: 'block' }}>Changing this updates the live color scheme instantly!</span>
            </div>
          </div>

          <div>
            <label className="form-label">Typing Texts (comma separated)</label>
            <input type="text" name="typingTexts" className="form-input" value={formData.typingTexts} onChange={handleInputChange} disabled={!isEditing} />
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>These appear in the typing animation in the Hero section</span>
          </div>

          <div>
            <label className="form-label">Biography</label>
            <textarea name="bio" className="form-input" rows={4} value={formData.bio} onChange={handleInputChange} disabled={!isEditing} required />
          </div>



          <h3 style={{ margin: '1rem 0 0 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Resume</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Resume URL</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <input type="text" name="resume" className="form-input" value={formData.resume || ''} onChange={handleInputChange} disabled={!isEditing} style={{ flex: 1 }} placeholder="e.g. /resume.pdf or Google Drive link" />
                {isEditing && (
                  <label className="btn btn-outline btn-sm" style={{ margin: 0, cursor: 'pointer', display: 'flex', gap: '0.25rem', alignItems: 'center', height: '100%', padding: '0.75rem 1.2rem', borderRadius: '0.5rem', justifyContent: 'center' }}>
                    {uploadingResume ? (
                      <Loader2 size={16} className="dash-loading-spinner" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingResume}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : <><Save size={16} /> Save Changes</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleCancel} disabled={saving}>
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
