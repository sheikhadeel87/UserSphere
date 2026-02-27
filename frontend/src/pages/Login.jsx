import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isSignup ? '/auth/register' : '/auth/login';
        const body = isSignup ? formData : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Authentication failed');
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--body-bg)' }}>
            <div style={{ background: 'var(--card)', padding: 32, borderRadius: 16, width: 360, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

                <h2 style={{ margin: '0 0 24px 0', fontSize: 28, textAlign: 'center', color: 'var(--text)' }}>{isSignup ? 'Sign Up' : 'Login'}</h2>
                {error && <p style={{ color: 'var(--danger)', marginBottom: 16, }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid var(--line)' }} required />
                        )}
                        <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid var(--line)' }} required />
                        <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid var(--line)' }} required />
                        <button type="submit" style={{ width: '100%', padding: 12, background: 'var(--btn-gradient)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                            {isSignup ? 'Sign Up' : 'Login'}
                        </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)'  }}>
                    {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                    <span onClick={() => setIsSignup(!isSignup)} style={{color: 'var(--accent)', cursor: 'pointer'}}>
                        {isSignup ? 'Login' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;