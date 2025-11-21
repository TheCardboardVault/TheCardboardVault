import React from 'react';

const Hero = ({ onSearch }) => {
    return (
        <section className="hero-section container">
            <h1 className="hero-title animate-fade-in">
                Find the Best <span className="text-gradient">TCG Deals</span>
            </h1>
            <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Scraping top marketplaces to find you the best prices on Magic, Pokemon, and more.
            </p>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <form
                    onSubmit={(e) => { e.preventDefault(); onSearch(e.target.search.value); }}
                    className="search-container"
                >
                    <input
                        type="search"
                        name="search"
                        placeholder="Search for a card..."
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-primary search-btn">
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Hero;
