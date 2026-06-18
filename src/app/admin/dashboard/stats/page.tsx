"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: 0,
    suffix: '+',
    icon: 'Code2',
    color: '#8b5cf6',
    order: 0
  });
  const [saving, setSaving] = useState(false);

  const fetchStats = async () => {
    try {
      const q = query(collection(db, 'stats'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStats(data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      label: '',
      value: 0,
      suffix: '+',
      icon: 'Code2',
      color: '#8b5cf6',
      order: stats.length
    });
  };

  const handleEdit = (stat) => {
    setIsEditing(true);
    setCurrentId(stat.id);
    setFormData({
      label: stat.label,
      value: stat.value || 0,
      suffix: stat.suffix || '',
      icon: stat.icon || 'Code2',
      color: stat.color || '#8b5cf6',
      order: stat.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    try {
      await deleteDoc(doc(db, 'stats', id));
      toast.success('Statistic deleted');
      fetchStats();
    } catch (err) {
      toast.error('Failed to delete statistic');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const statData = {
        label: formData.label,
        value: Number(formData.value),
        suffix: formData.suffix,
        icon: formData.icon,
        color: formData.color,
        order: Number(formData.order)
      };

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'stats', currentId), statData);
        toast.success('Statistic updated successfully');
      } else {
        await addDoc(collection(db, 'stats'), statData);
        toast.success('Statistic added successfully');
      }

      resetForm();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? 'Failed to update' : 'Failed to add statistic');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Stats</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Statistic' : 'Add New Statistic'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Stat Label</label>
              <input type="text" name="label" className="form-input" value={formData.label} onChange={handleInputChange} placeholder="e.g. GitHub Commits" required />
            </div>
            <div>
              <label className="form-label">Value</label>
              <input type="number" name="value" className="form-input" value={formData.value} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="form-label">Suffix</label>
              <input type="text" name="suffix" className="form-input" value={formData.suffix} onChange={handleInputChange} placeholder="e.g. +, %, Yrs" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Icon</label>
              <select name="icon" className="form-input" value={formData.icon} onChange={handleInputChange}>
                <option value="Layers">Layers</option>
                <option value="GitBranch">GitBranch</option>
                <option value="Code2">Code2</option>
                <option value="Zap">Zap</option>
                <option value="GraduationCap">GraduationCap</option>
                <option value="Trophy">Trophy</option>
                <option value="Award">Award</option>
                <option value="Star">Star</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Heart">Heart</option>
              </select>
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
              {saving ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditing ? 'Update Stat' : 'Save Stat')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Stats</h3>
        {loading ? <p>Loading statistics...</p> : (
          stats.length === 0 ? <p style={{ color: '#94a3b8' }}>No stats found. Add one above!</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {stats.map(stat => (
                <div key={stat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: `1px solid ${stat.color}30` }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: stat.color, fontWeight: 600 }}>{stat.icon}</span>
                    <h3 style={{ margin: '0.2rem 0', color: '#f1f5f9', display: 'flex', alignItems: 'baseline', gap: '0.1rem' }}>
                      {stat.value}
                      <span style={{ fontSize: '1.2rem', color: stat.color }}>{stat.suffix}</span>
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{stat.label}</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Order: {stat.order}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => handleEdit(stat)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(stat.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}>
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
