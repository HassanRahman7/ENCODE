import React from 'react';
import './AIResponse.css';

const AIResponse = ({ data }) => {
    if (!data) return null;

    const { highLevelInsight, whyItMatters, tradeOffs, uncertainty, guidance } = data;

    return (
        <div className="ai-response fade-in">
            <div className="insight-card glass-panel">
                <div className="section header-section">
                    <h2>What might matter to you</h2>
                    <p className="highlight-text">{highLevelInsight}</p>
                </div>

                <div className="section">
                    <h3>Why it matters</h3>
                    <p>{whyItMatters}</p>
                </div>

                <div className="grid-row">
                    <div className="section tile warning-tile">
                        <h3>Trade-offs</h3>
                        <p>{tradeOffs}</p>
                    </div>
                    <div className="section tile unknown-tile">
                        <h3>What we’re not sure about</h3>
                        <p>{uncertainty}</p>
                    </div>
                </div>

                <div className="section guidance-section">
                    <h3>Gentle guidance</h3>
                    <p>{guidance}</p>
                </div>
            </div>
        </div>
    );
};

export default AIResponse;
