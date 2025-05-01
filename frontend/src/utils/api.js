import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeText = async (text, model = 'ensemble') => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict${model !== 'ensemble' ? `/${model}` : ''}`, {
            text,
            platform: 'twitter'
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing text:', error);
        throw error;
    }
};

export const getHealthStatus = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    } catch (error) {
        console.error('Error checking health status:', error);
        throw error;
    }
}; 