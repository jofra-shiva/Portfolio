"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.email === 'shivaprakash3115@gmail.com') {
        router.push('/admin/dashboard');
      } else {
        toast.error('Access Denied: Not an admin account');
        logout();
      }
    }
  }, [user, router, logout]);

  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.setAttribute('data-theme', originalTheme);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user.email === 'shivaprakash3115@gmail.com') {
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.error('Access Denied: Not an admin account');
        await logout();
      }
    } catch (err) {
      console.error(err);
      toast.error('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1"></div>
        <div className="login-bg__orb login-bg__orb--2"></div>
        <div className="login-bg__orb login-bg__orb--3"></div>
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <div className="login-logo">
            <img src={logoImg.src} alt="Logo" className="logo-inner" />
          </div>
          <h1>SHIVA'S Portal</h1>
          <p>Secure authentication for lead architect</p>
        </div>

        <div className="login-actions" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn-google" 
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {loading ? 'Authenticating...' : 'Sign in with Google'}
          </button>
        </div>

        <a href="/" className="login-back" style={{ marginTop: '2rem' }}>← Back to Portfolio</a>
      </div>
    </div>
  );
};

export default AdminLogin;
