"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { Mail, Check, Trash2, MailOpen, Clock, User, Reply, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { read: true });
      fetchMessages();
      if (activeMessage?.id === id) {
        setActiveMessage({ ...activeMessage, read: true });
      }
    } catch (err) {
      toast.error('Failed to update message status');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      toast.success('Message deleted');
      if (activeMessage?.id === id) setActiveMessage(null);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleSelectMessage = (msg: any) => {
    setActiveMessage(msg);
    if (!msg.read) {
      markAsRead(msg.id, msg.read);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail color="#7c3aed" /> Inbox
          {messages.filter(m => !m.read).length > 0 && (
            <span style={{ fontSize: '0.9rem', background: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '1rem', color: 'white' }}>
              {messages.filter(m => !m.read).length} New
            </span>
          )}
        </h2>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '1.5rem', overflow: 'hidden' }}>
        
        {/* Left Pane - Message List */}
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, color: '#94a3b8' }}>
            All Messages
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading inbox...</div> : (
              filteredMessages.length === 0 ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No messages found.</div> : (
                filteredMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    onClick={() => handleSelectMessage(msg)}
                    style={{ 
                      padding: '1.25rem 1rem', 
                      borderBottom: '1px solid rgba(255,255,255,0.03)', 
                      cursor: 'pointer',
                      background: activeMessage?.id === msg.id ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                      borderLeft: `3px solid ${activeMessage?.id === msg.id ? '#7c3aed' : (msg.read ? 'transparent' : '#3b82f6')}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: msg.read ? 500 : 700, color: msg.read ? '#cbd5e1' : '#fff' }}>
                        {msg.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: msg.read ? '#64748b' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.subject || msg.message.substring(0, 40) + '...'}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Right Pane - Message Viewer */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeMessage ? (
            <>
              {/* Message Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                    {activeMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: '#fff' }}>{activeMessage.name}</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <a href={`mailto:${activeMessage.email}`} style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={14}/> {activeMessage.email}</a>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14}/> {new Date(activeMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={`mailto:${activeMessage.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <Reply size={16} /> Reply
                  </a>
                  <button onClick={() => deleteMessage(activeMessage.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {activeMessage.subject && (
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem', color: '#fff' }}>
                    Subject: {activeMessage.subject}
                  </div>
                )}
                {activeMessage.message}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
              <MailOpen size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem' }}>Select a message to read</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
