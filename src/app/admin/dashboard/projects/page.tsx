"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { uploadFile, deleteFile } from '../../../../lib/storage';
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    github: '',
    demo: '',
    order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('order', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setImageFile(null);
    setGalleryFiles([]);
    setExistingImages([]);
    setFormData({ title: '', description: '', tech: '', github: '', demo: '', order: projects.length });
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech,
      github: project.links?.github || '',
      demo: project.links?.demo || '',
      order: project.order || 0
    });
    setImageFile(null);
    setGalleryFiles([]);
    setExistingImages(project.images || []);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      if (imageUrl) {
        await deleteFile(imageUrl).catch(e => console.warn("Failed to delete image, continuing with doc deletion", e));
      }
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        const path = `projects/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
      }

      let uploadedImages = [...existingImages];
      for (const file of galleryFiles) {
        const path = `projects/gallery_${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);
        uploadedImages.push(url);
      }

      const techArray = formData.tech.split(',').map(t => t.trim()).filter(t => t);
      const projectData = {
        title: formData.title,
        description: formData.description,
        tech: techArray,
        order: Number(formData.order),
        links: {
          github: formData.github,
          demo: formData.demo
        },
        images: uploadedImages
      };

      if (imageUrl) {
        projectData['image'] = imageUrl;
      }

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'projects', currentId), projectData);
        toast.success('Project updated successfully');
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        toast.success('Project added successfully');
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? 'Failed to update' : 'Failed to add project');
    } finally {
      setUploading(false);
    }
  };

  const handleImportOldProjects = async () => {
    const oldProjects = [{"title":"AVSECO Smart ERP","description":"AVSECO Smart ERP System","tech":["React"],"order":0,"links":{"github":"https://github.com/sivaprakashakintern/avseco_f","demo":"https://avseco-f.vercel.app/"},"image":"https://res.cloudinary.com/dry4twzvw/image/upload/v1777533573/portfolio_uploads/file-1777533570512-900933789.png"},{"title":"Emo News","description":"Emotional based to showing news","tech":["React","Express","MongoDB"],"order":1,"links":{"github":"https://github.com/jofra-shiva/EmoNews","demo":"https://emo-news-6tz6.vercel.app/overview"},"image":"https://res.cloudinary.com/dry4twzvw/image/upload/v1777527061/portfolio_uploads/file-1777527061888-364856395.png"},{"title":"LeoChat","description":"LeoChat is a simple, flexible, and accessible chat platform designed to make communication seamless without unnecessary dependencies.","tech":["React","Express","MongoDB"],"order":2,"links":{"github":"https://github.com/jofra-shiva/chat","demo":"https://leochat.vercel.app/"},"image":"https://res.cloudinary.com/dry4twzvw/image/upload/v1777534622/portfolio_uploads/file-1777534623592-955971477.png"},{"title":"JD Game","description":"JD Game is a lightweight, interactive game project designed to deliver engaging gameplay with simple mechanics, clean design, and smooth user experience—built to showcase core game development skills and logic implementation in a practical, playable format","tech":["Java","Mysql"],"order":3,"links":{"github":"https://github.com/jofra-shiva/JD_GAME","demo":""},"image":"https://res.cloudinary.com/dry4twzvw/image/upload/v1777534888/portfolio_uploads/file-1777534889761-526194629.png"}];
    setUploading(true);
    try {
      for (const p of oldProjects) {
        await addDoc(collection(db, 'projects'), p);
      }
      toast.success('Successfully imported old projects!');
      fetchProjects();
    } catch (e) {
      toast.error('Import failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Manage Projects</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isEditing && (
            <button className="btn btn-outline" onClick={handleImportOldProjects} style={{ padding: '0.5rem 1rem' }} disabled={uploading}>
              Import Old Projects
            </button>
          )}
          {!isEditing && (
            <button className="btn btn-primary" onClick={resetForm} style={{ padding: '0.5rem 1rem' }}>
              <Plus size={16} /> Add New
            </button>
          )}
        </div>
      </div>

      <div className="dash-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label className="form-label">Title</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" rows={3} value={formData.description} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="form-label">Technologies (comma separated)</label>
            <input type="text" name="tech" className="form-input" value={formData.tech} onChange={handleInputChange} placeholder="React, Node.js, MongoDB" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">GitHub URL</label>
              <input type="url" name="github" className="form-input" value={formData.github} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Live Demo URL</label>
              <input type="url" name="demo" className="form-input" value={formData.demo} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <label className="form-label">Project Image (Thumbnail)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ImageIcon size={16} />
                <span>{imageFile ? imageFile.name : 'Choose Thumbnail'}</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
              {isEditing && !imageFile && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Leave empty to keep existing</span>}
            </div>
          </div>

          <div>
            <label className="form-label">Gallery Images (Multiple)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', alignSelf: 'flex-start' }}>
                <Plus size={16} />
                <span>Add Gallery Images</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => {
                  if (e.target.files) {
                    setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                  }
                }} />
              </label>

              {/* Preview newly added gallery files */}
              {galleryFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {galleryFiles.map((file, i) => (
                    <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                      <img src={URL.createObjectURL(file)} alt="new" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.25rem' }} />
                      <button type="button" onClick={() => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview existing gallery images in edit mode */}
              {isEditing && existingImages.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>Existing Gallery Images:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {existingImages.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <img src={img} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.25rem' }} />
                        <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? <><Loader2 size={16} className="dash-loading-spinner"/> Saving...</> : (isEditing ? 'Update Project' : 'Save Project')}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-card">
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Existing Projects</h3>
        {loading ? <p>Loading projects...</p> : (
          projects.length === 0 ? <p style={{ color: '#94a3b8' }}>No projects found. Add one above!</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map(project => (
                <div key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {project.image ? (
                      <img src={project.image} alt={project.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} color="#64748b"/></div>
                    )}
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0' }}>{project.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{Array.isArray(project.tech) ? project.tech.join(', ') : project.tech}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(project)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(project.id, project.image)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
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
