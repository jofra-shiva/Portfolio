"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    link: '',
    icon: 'Trophy',
    order: 0
  });
  const [saving, setSaving] = useState(false);

  const fetchAchievements = async () => {
    try {
      const q = query(collection(db, 'achievements'), orderBy('order', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAchievements(data);
    } catch (err) {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements().then(async () => {
      // Temporary seed logic
      const q = query(collection(db, 'achievements'));
      const snap = await getDocs(q);
      if (snap.empty) {
        toast.success("Seeding initial achievements...");
        const seedData = [
          {
            title: "Web Design",
            organization: "Hindustan Arts and Science College",
            date: "2026-03",
            description: "Achieved 2nd Prize in an intercollegiate competition hosted by Hindustan Arts and Science College. Competed with students from multiple colleges and delivered a commendable performance, highlighting analytical thinking and problem-solving ability.",
            icon: "Trophy",
            order: 1
          },
          {
            title: "Web Development",
            organization: "American College",
            date: "2024-10",
            description: "Achieved 1st Prize in an intercollegiate competition hosted by American College. Competed against students from multiple colleges and delivered an outstanding performance, highlighting strong analytical thinking, creativity, and execution skills.",
            icon: "Trophy",
            order: 0
          }
        ];
        for (const ach of seedData) {
          await addDoc(collection(db, 'achievements'), ach);
        }
        fetchAchievements();
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      organization: '',
      date: '',
      description: '',
      link: '',
      icon: 'Trophy',
      order: achievements.length
    });
  };

  const handleEdit = (ach) => {
    setIsEditing(true);
    setCurrentId(ach.id);
    setFormData({
      title: ach.title || '',
      organization: ach.organization || '',
      date: ach.date || '',
      description: ach.description || '',
      link: ach.link || '',
      icon: ach.icon || 'Trophy',
      order: ach.order || 0
    });
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.9rem' }}>Are you sure you want to delete this achievement?</span>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(db, 'achievements', id));
                toast.success('Achievement deleted');
                fetchAchievements();
              } catch (err) {
                toast.error('Failed to delete achievement');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const achData = {
        title: formData.title,
        organization: formData.organization,
        date: formData.date,
        description: formData.description,
        link: formData.link,
        icon: formData.icon,
        order: Number(formData.order)
      };

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'achievements', currentId), achData);
        toast.success('Achievement updated successfully');
      } else {
        await addDoc(collection(db, 'achievements'), achData);
        toast.success('Achievement added successfully');
      }

      resetForm();
      fetchAchievements();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? 'Failed to update' : 'Failed to add achievement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Achievements</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Award/Certificate Title</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} placeholder="e.g. Best Innovator Award" required />
            </div>
            <div>
              <label className="form-label">Organization</label>
              <input type="text" name="organization" className="form-input" value={formData.organization} onChange={handleInputChange} placeholder="e.g. Google, College" required />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input type="text" name="date" className="form-input" value={formData.date} onChange={handleInputChange} placeholder="e.g. Oct 2025" required />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" rows={2} value={formData.description} onChange={handleInputChange} placeholder="Describe the recognition or what it was awarded for..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Credential Link (URL, optional)</label>
              <input type="url" name="link" className="form-input" value={formData.link} onChange={handleInputChange} placeholder="https://example.com/certificate" />
            </div>
            <div>
              <label className="form-label">Icon</label>
              <select name="icon" className="form-input" value={formData.icon} onChange={handleInputChange}>
                <option value="Trophy">Trophy</option>
                <option value="Award">Award</option>
                <option value="Medal">Medal</option>
                <option value="BookOpen">BookOpen</option>
                <option value="Star">Star</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>
            <div>
              <label className="form-label">Sort Order</label>
              <input type="number" name="order" className="form-input" value={formData.order} onChange={handleInputChange} min="0" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditing ? 'Update Achievement' : 'Save Achievement')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Achievements</h3>
        {loading ? <p>Loading achievements...</p> : (
          achievements.length === 0 ? <p style={{ color: '#94a3b8' }}>No achievements found. Add one above!</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#eab308' }}>🏆 {ach.icon || 'Trophy'}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{ach.date}</span>
                    </div>
                    <h4 style={{ margin: '0.3rem 0 0.1rem 0', color: '#f1f5f9' }}>{ach.title}</h4>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: '#94a3b8' }}>{ach.organization}</p>
                    {ach.description && <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{ach.description}</p>}
                    {ach.link && <a href={ach.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#00d2ff', textDecoration: 'none', display: 'inline-block', marginTop: '0.3rem' }}>Verify Credential →</a>}
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Order: {ach.order}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => handleEdit(ach)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(ach.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
