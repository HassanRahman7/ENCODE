import React, { useState } from 'react';
import InputSurface from '../components/InputSurface';
import AIResponse from '../components/AIResponse';
import './Home.css';

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async (text) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            // Assuming backend is running on localhost:3000
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
            setError('Unable to analyze right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <header>
                <h1 className="glow-text">Informed</h1>
                <p className="subtitle">Your AI decision co-pilot</p>
            </header>

            <main>
                <InputSurface onAnalyze={handleAnalyze} loading={loading} />

                {error && <div className="error-message fade-in">{error}</div>}

                <AIResponse data={data} />
            </main>
        </div>
    );
};

export default Home;
