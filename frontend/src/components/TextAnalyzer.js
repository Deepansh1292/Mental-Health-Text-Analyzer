import React, { useState, useEffect } from 'react';
import { analyzeText } from '../utils/api';
import '../styles/TextAnalyzer.css';

const modelIcons = {
    ensemble: '🧬',
    'cnn-bilstm': '🧠',
    'logistic-regression': '📈',
};

const TextAnalyzer = () => {
    const [text, setText] = useState('');
    const [selectedModels, setSelectedModels] = useState({
        ensemble: true,
        'cnn-bilstm': false,
        'logistic-regression': false
    });
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [charCount, setCharCount] = useState(0);

    // Create background particles
    useEffect(() => {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 4px and 8px
            const size = Math.random() * 4 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation duration between 15s and 25s
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
            
            document.querySelector('.background-animation').appendChild(particle);
            
            // Remove particle after animation completes
            setTimeout(() => {
                particle.remove();
            }, 25000);
        };

        // Create initial particles
        for (let i = 0; i < 20; i++) {
            createParticle();
        }

        // Create new particles periodically
        const interval = setInterval(() => {
            createParticle();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleModelChange = (model) => {
        setSelectedModels(prev => ({
            ...prev,
            [model]: !prev[model]
        }));
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setCharCount(newText.length);
    };

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        }

        setLoading(true);
        setError(null);
        const newResults = {};

        try {
            for (const [model, isSelected] of Object.entries(selectedModels)) {
                if (isSelected) {
                    const response = await analyzeText(text, model);
                    newResults[model] = response;
                }
            }
            setResults(newResults);
        } catch (err) {
            setError('Error analyzing text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getRiskClass = (riskLevel) => {
        switch (riskLevel) {
            case 'high':
                return 'risk-high';
            case 'medium':
                return 'risk-medium';
            case 'low':
                return 'risk-low';
            case 'neutral':
                return 'risk-neutral';
            default:
                return '';
        }
    };

    const getModelDescription = (modelName) => {
        switch (modelName) {
            case 'ensemble':
                return 'Combines predictions from both models for better accuracy';
            case 'cnn-bilstm':
                return 'Deep learning model using CNN and BiLSTM architecture';
            case 'logistic-regression':
                return 'Traditional machine learning model for text classification';
            default:
                return '';
        }
    };

    const getModelLabel = (model) => {
        switch (model) {
            case 'ensemble':
                return 'Ensemble (Both Models)';
            case 'cnn-bilstm':
                return 'CNN-BiLSTM';
            case 'logistic-regression':
                return 'Logistic Regression';
            default:
                return model;
        }
    };

    return (
        <div className="text-analyzer">
            <div className="background-animation"></div>
            <div className="analyzer-container">
                <h1 className="analyzer-title">Mental Health Text Analyzer</h1>

                <div className="model-selection-container">
                    <label className="model-select-label">Select Analysis Models</label>
                    <div className="model-checkboxes">
                        {Object.entries(selectedModels).map(([model, isSelected]) => (
                            <div key={model} className="model-checkbox-item">
                                <input
                                    type="checkbox"
                                    id={model}
                                    checked={isSelected}
                                    onChange={() => handleModelChange(model)}
                                    className="model-checkbox"
                                />
                                <div className="model-label-group">
                                    <span className="model-icon">{modelIcons[model]}</span>
                                    <label htmlFor={model} className="model-checkbox-label">
                                        {getModelLabel(model)}
                                    </label>
                                </div>
                                <div className="model-info">{getModelDescription(model)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-input-container">
                    <label className="text-input-label">Enter Text to Analyze</label>
                    <div className="text-input-wrapper">
                        <textarea
                            className="text-input"
                            rows="6"
                            placeholder="Type or paste your text here..."
                            value={text}
                            onChange={handleTextChange}
                        />
                        <div className="char-count">
                            {charCount} characters
                        </div>
                    </div>
                </div>

                <button
                    className={`analyze-button ${loading ? 'loading' : ''}`}
                    onClick={handleAnalyze}
                    disabled={loading || !Object.values(selectedModels).some(v => v)}
                >
                    {loading ? (
                        <>
                            <div className="loading-spinner"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        'Analyze Text'
                    )}
                </button>

                {error && (
                    <div className="error-message">
                        <i className="error-icon">⚠️</i>
                        {error}
                    </div>
                )}
            </div>

            {Object.keys(results).length > 0 && (
                <div className="results-container">
                    <h2 className="results-title">Analysis Results</h2>
                    <div className="results-grid">
                        {Object.entries(results).map(([model, result]) => (
                            <div key={model} className="result-card">
                                <div className="result-card-header">
                                    <h3 className="result-model-name">
                                        {model === 'ensemble' ? 'Ensemble Model' :
                                         model === 'cnn-bilstm' ? 'CNN-BiLSTM Model' :
                                         'Logistic Regression Model'}
                                    </h3>
                                </div>
                                <div className="result-card-content">
                                    <div className="result-item">
                                        <span className="result-label">Risk Level</span>
                                        <span className={`result-value ${getRiskClass(result.risk_level)}`}>
                                            {result.risk_level.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="result-item">
                                        <span className="result-label">Confidence</span>
                                        <span className="result-value">
                                            {(result.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="confidence-bar">
                                        <div 
                                            className="confidence-level" 
                                            style={{ width: `${result.confidence * 100}%` }}
                                        />
                                    </div>

                                    <div className="result-item">
                                        <span className="result-label">Raw Score</span>
                                        <span className="result-value">
                                            {result.prediction.toFixed(4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextAnalyzer; 