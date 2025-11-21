import React from 'react';

const DealGrid = ({ deals, loading }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div className="animate-fade-in">Searching marketplaces for the best deals...</div>
            </div>
        );
    }

    if (!deals || deals.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p>No deals found. Try searching for a different card!</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
                {deals.length === 1 ? 'Best Deal' : `${deals.length} Deals Found`}
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {deals.map((deal, index) => {
                    const isBestDeal = index === 0;

                    return (
                        <a key={deal._id || index}
                            href={deal.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-panel animate-fade-in"
                            style={{
                                display: 'block',
                                overflow: 'hidden',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                animationDelay: `${index * 0.05}s`,
                                border: isBestDeal ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                boxShadow: isBestDeal ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = isBestDeal
                                    ? '0 8px 30px rgba(99, 102, 241, 0.4)'
                                    : '0 8px 20px rgba(0, 0, 0, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isBestDeal
                                    ? '0 0 20px rgba(99, 102, 241, 0.3)'
                                    : 'none';
                            }}
                        >
                            <div style={{
                                height: '200px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src={deal.imageUrl}
                                    alt={deal.cardName}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/400x600/1e293b/ffffff?text=No+Image';
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.8)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    {deal.source}
                                </div>
                                {isBestDeal && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.5)'
                                    }}>
                                        ⭐ Best Deal
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{
                                    margin: '0 0 0.5rem',
                                    fontSize: '1.1rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {deal.cardName}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '1rem'
                                }}>
                                    <span style={{
                                        fontSize: isBestDeal ? '1.5rem' : '1.25rem',
                                        fontWeight: '700',
                                        color: isBestDeal ? 'var(--primary)' : 'var(--text-main)'
                                    }}>
                                        ${deal.price.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        View Deal &rarr;
                                    </span>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default DealGrid;
