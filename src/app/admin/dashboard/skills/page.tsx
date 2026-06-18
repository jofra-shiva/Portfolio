"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend'
  });
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    try {
      const q = query(collection(db, 'skills'), orderBy('category', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(data);
    } catch (err) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', category: 'Frontend' });
  };

  const handleEdit = (skill) => {
    setIsEditing(true);
    setCurrentId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category || 'Frontend'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success('Skill deleted');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const skillData = {
        name: formData.name,
        category: formData.category
      };

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'skills', currentId), skillData);
        toast.success('Skill updated successfully');
      } else {
        await addDoc(collection(db, 'skills'), skillData);
        toast.success('Skill added successfully');
      }

      resetForm();
      fetchSkills();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? 'Failed to update' : 'Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Skills</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Skill' : 'Add New Skill'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Skill Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="e.g. React.js" required />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select name="category" className="form-input" value={formData.category} onChange={handleInputChange}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditing ? 'Update Skill' : 'Save Skill')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Skills</h3>
        {loading ? <p>Loading skills...</p> : (
          skills.length === 0 ? <p style={{ color: '#94a3b8' }}>No skills found. Add one above!</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{skill.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{skill.category}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => handleEdit(skill)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}>
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
