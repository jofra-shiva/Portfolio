"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    stars: 5,
    avatar: '',
    color: '#8b5cf6',
    order: 0
  });
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      role: '',
      text: '',
      stars: 5,
      avatar: '',
      color: '#8b5cf6',
      order: testimonials.length
    });
  };

  const handleEdit = (test) => {
    setIsEditing(true);
    setCurrentId(test.id);
    setFormData({
      name: test.name || '',
      role: test.role || '',
      text: test.text || '',
      stars: test.stars || 5,
      avatar: test.avatar || '',
      color: test.color || '#8b5cf6',
      order: test.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (err) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Auto generate avatar initials from name if not provided
      let initials = formData.avatar.trim();
      if (!initials && formData.name) {
        initials = formData.name
          .split(' ')
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
      }

      const testData = {
        name: formData.name,
        role: formData.role,
        text: formData.text,
        stars: Number(formData.stars),
        avatar: initials,
        color: formData.color,
        order: Number(formData.order)
      };

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'testimonials', currentId), testData);
        toast.success('Testimonial updated successfully');
      } else {
        await addDoc(collection(db, 'testimonials'), testData);
        toast.success('Testimonial added successfully');
      }

      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? 'Failed to update' : 'Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Testimonials</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Author Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="e.g. Jane Doe" required />
            </div>
            <div>
              <label className="form-label">Author Designation / Role</label>
              <input type="text" name="role" className="form-input" value={formData.role} onChange={handleInputChange} placeholder="e.g. Senior Software Engineer" required />
            </div>
            <div>
              <label className="form-label">Rating (Stars)</label>
              <select name="stars" className="form-input" value={formData.stars} onChange={handleInputChange}>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Recommendation Text</label>
            <textarea name="text" className="form-input" rows={4} value={formData.text} onChange={handleInputChange} placeholder="Write the recommendation text here..." required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Avatar Initials (optional)</label>
              <input type="text" name="avatar" className="form-input" value={formData.avatar} onChange={handleInputChange} placeholder="e.g. JD (Auto-generated if empty)" maxLength={3} />
            </div>
            <div>
              <label className="form-label">Theme Color</label>
              <select name="color" className="form-input" value={formData.color} onChange={handleInputChange}>
                <option value="#8b5cf6">Purple (#8b5cf6)</option>
                <option value="#00d2ff">Cyan (#00d2ff)</option>
                <option value="#10b981">Green (#10b981)</option>
                <option value="#f59e0b">Yellow (#f59e0b)</option>
                <option value="#ec4899">Pink (#ec4899)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Sort Order</label>
              <input type="number" name="order" className="form-input" value={formData.order} onChange={handleInputChange} min="0" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditing ? 'Update Testimonial' : 'Save Testimonial')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Testimonials</h3>
        {loading ? <p>Loading testimonials...</p> : (
          testimonials.length === 0 ? <p style={{ color: '#94a3b8' }}>No testimonials found. Add one above!</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {testimonials.map(test => (
                <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: `1px solid ${test.color}30` }}>
                  <div style={{ flex: 1, marginRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${test.color}20`,
                        border: `1px solid ${test.color}40`,
                        color: test.color,
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {test.avatar}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#f1f5f9' }}>{test.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{test.role}</p>
                      </div>
                    </div>
                    <div style={{ color: '#eab308', display: 'flex', gap: '2px', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                      {'★'.repeat(test.stars || 5)}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4', fontStyle: 'italic' }}>
                      "{test.text}"
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Order: {test.order}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => handleEdit(test)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(test.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}>
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
