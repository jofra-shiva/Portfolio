"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { LayoutDashboard, User, FolderKanban, Code2, MessageSquare, LogOut, Loader2, BarChart3, Milestone, Trophy, Quote } from 'lucide-react';
import './DashboardLayout.css';
import logoImg from '../../../assets/logo.png';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Force light theme or dark theme consistently for dashboard
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin');
      } else if (user.email !== 'shivaprakash3115@gmail.com') {
        logout();
        router.push('/admin');
      }
    }
  }, [user, loading, router, logout]);

  if (loading || !user) {
    return (
      <div className="dash-loading">
        <Loader2 className="dash-loading-spinner" size={40} />
        <p>Verifying Access...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Home', path: '/admin/dashboard/home', icon: <User size={18} /> },
    { name: 'About', path: '/admin/dashboard/about', icon: <Milestone size={18} /> },
    { name: 'Skills', path: '/admin/dashboard/skills', icon: <Code2 size={18} /> },
    { name: 'Projects', path: '/admin/dashboard/projects', icon: <FolderKanban size={18} /> },
    { name: 'Awards', path: '/admin/dashboard/achievements', icon: <Trophy size={18} /> },
    { name: 'Messages', path: '/admin/dashboard/messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <img src={logoImg.src} alt="Logo" className="dash-logo" />
          <h2>SHIVA'S Portal</h2>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`dash-nav-item ${pathname === item.path ? 'dash-nav-item--active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <div className="dash-avatar">S</div>
            <div className="dash-user-info">
              <span className="dash-user-name">Admin</span>
              <span className="dash-user-email">{user.email}</span>
            </div>
          </div>
          <button onClick={logout} className="dash-logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dash-main">
        <header className="dash-header">
          <h1>
            {navItems.find(item => item.path === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="dash-header-actions">
            <a href="/" target="_blank" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
              View Live Site
            </a>
          </div>
        </header>
        
        <div className="dash-content-scroll">
          <div className="dash-content-inner">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
