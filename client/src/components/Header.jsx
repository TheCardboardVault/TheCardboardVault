import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onLoginClick, onRegisterClick, onSettingsClick }) => {
    const { user, logout, claimReward } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="app-header">
            <div className="logo text-gradient">
                The Cardboard Vault
            </div>

            <div className="flex-center" style={{ gap: 'var(--spacing-md)' }}>
                <nav className="nav-links">
                    <a href="#" className="nav-link">Deals</a>
                    <a href="#" className="nav-link">About</a>
                </nav>

                {user ? (
                    <div className="user-menu">
                        <button
                            className="user-menu-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 14a6 6 0 0112 0v2H4v-2z" />
                            </svg>
                            <span style={{ fontWeight: 500 }}>{user.username}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{
                                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}>
                                <path d="M4 6l4 4 4-4z" />
                            </svg>
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 50
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="user-menu-dropdown">
                                    <div style={{ padding: '0.75rem 1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                        {user.username}
                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                                            💎 {user.points || 0} Points
                                        </div>
                                    </div>
                                    <div className="user-menu-divider" />
                                    <button className="user-menu-item" onClick={async () => {
                                        const result = await claimReward('daily_login');
                                        if (result.success) {
                                            alert(result.message);
                                        } else {
                                            alert(result.error);
                                        }
                                    }}>
                                        <span>🎁</span> Daily Reward
                                    </button>
                                    <button className="user-menu-item">
                                        <span>👤</span> Profile
                                    </button>
                                    <button className="user-menu-item" onClick={() => {
                                        setShowUserMenu(false);
                                        onSettingsClick();
                                    }}>
                                        <span>⚙️</span> Settings
                                    </button>
                                    <div className="user-menu-divider"></div>
                                    <button
                                        className="user-menu-item"
                                        onClick={() => {
                                            logout();
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v1h-2V3H5v10h6v-1h2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" />
                                            <path d="M11 8l3-3v2h4v2h-4v2l-3-3z" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onLoginClick}
                            className="btn btn-ghost"
                        >
                            Login
                        </button>
                        <button
                            onClick={onRegisterClick}
                            className="btn btn-primary"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
