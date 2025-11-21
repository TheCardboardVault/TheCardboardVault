import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const THEMES = [
    { id: 'default', name: 'Default (Indigo)', color: '#6366f1' },
    { id: 'emerald', name: 'Emerald', color: '#10b981' },
    { id: 'rose', name: 'Rose', color: '#f43f5e' },
    { id: 'amber', name: 'Amber', color: '#f59e0b' },
    { id: 'cyan', name: 'Cyan', color: '#06b6d4' },
];

const Settings = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [theme, setTheme] = useState(user?.theme || 'default');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Apply theme preview immediately when selected
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const updates = {
            username,
            theme
        };

        if (password) {
            updates.password = password;
        }

        const result = await updateProfile(updates);

        if (result.success) {
            setSuccess('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(result.error);
            // Revert theme if failed
            document.documentElement.setAttribute('data-theme', user.theme || 'default');
            setTheme(user.theme || 'default');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2 className="modal-title text-gradient">Settings</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Customize your experience</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password (Optional)</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            minLength="6"
                        />
                    </div>

                    {password && (
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Theme Color</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {THEMES.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setTheme(t.id)}
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        background: t.color,
                                        border: theme === t.id ? '3px solid white' : '2px solid transparent',
                                        cursor: 'pointer',
                                        boxShadow: theme === t.id ? `0 0 0 2px ${t.color}` : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    title={t.name}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
