import React, { useState } from 'react';
import './InputSurface.css';

const InputSurface = ({ onAnalyze, loading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="input-surface glass-panel fade-in">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="ingredient-input"
                    placeholder="Paste ingredients here (e.g., Sugar, Palm Oil, Red 40)..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                    rows={4}
                />
                <div className="action-row">
                    <button
                        type="submit"
                        className={`analyze-btn ${loading ? 'loading' : ''}`}
                        disabled={loading || !text.trim()}
                    >
                        {loading ? 'Thinking...' : 'Analyze'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputSurface;
