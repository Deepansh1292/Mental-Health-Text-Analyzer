import React, { useState } from 'react';
import { analyzeText, PredictionResponse } from '../utils/api';
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';

const TextAnalyzer: React.FC = () => {
    const [text, setText] = useState('');
    const [model, setModel] = useState('ensemble');
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await analyzeText(text, model);
            setResult(response);
        } catch (err) {
            setError('Error analyzing text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high':
                return 'error.main';
            case 'medium':
                return 'warning.main';
            case 'low':
                return 'success.main';
            default:
                return 'text.primary';
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Mental Health Text Analyzer
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Model</InputLabel>
                    <Select
                        value={model}
                        label="Model"
                        onChange={(e) => setModel(e.target.value)}
                    >
                        <MenuItem value="ensemble">Ensemble (Both Models)</MenuItem>
                        <MenuItem value="cnn-bilstm">CNN-BiLSTM</MenuItem>
                        <MenuItem value="logistic-regression">Logistic Regression</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Enter text to analyze"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={loading}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Text'}
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Analysis Results
                        </Typography>
                        <Typography color={getRiskColor(result.risk_level)}>
                            Risk Level: {result.risk_level.toUpperCase()}
                        </Typography>
                        <Typography>
                            Confidence: {(result.confidence * 100).toFixed(1)}%
                        </Typography>
                        <Typography>
                            Model Used: {result.model_used}
                        </Typography>
                        <Typography>
                            Raw Score: {result.prediction.toFixed(4)}
                        </Typography>
                    </Paper>
                )}
            </Paper>
        </Box>
    );
};

export default TextAnalyzer; 