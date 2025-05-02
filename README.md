# Mental Health Condition Monitoring from Social Media

A full-stack application that uses advanced machine learning techniques to monitor and analyze mental health conditions from social media content. The system provides real-time analysis of text content to detect potential mental health concerns and offers immediate support and recommendations.

**Dataset Used:** [Suicide and Depression Detection](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch) from Kaggle.

## 🌟 Features

- Real-time text analysis for mental health condition detection
- Multiple ML models (CNN-BiLSTM, RNN, Logistic Regression) for accurate predictions
- Modern, responsive user interface with Material-UI components
- Real-time monitoring and alert system
- Privacy-focused with end-to-end encryption
- Comprehensive resource recommendations
- Cross-platform compatibility
- Utilizes the [Suicide and Depression Detection](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch) dataset for model training and evaluation

## 🎯 Project Goals

- Achieve >90% accuracy on test data
- Maintain <5% false positive rate
- Provide real-time analysis (<2 seconds response time)
- Ensure GDPR compliance and data security
- Support early intervention and prevention

## 🛠️ Technical Stack

### Backend
- FastAPI (Python web framework)
- TensorFlow (Deep learning framework)
- Transformers (NLP library)
- SQLAlchemy (Database ORM)
- Pydantic (Data validation)

### Frontend
- React with TypeScript
- Material-UI components
- Axios for API communication

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14.x or higher
- npm 6.x or higher
- Git
- At least 4GB RAM
- 10GB free disk space

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/mental-health-monitoring.git
cd mental-health-monitoring
```

2. Set up the backend:
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Activate virtual environment (Windows)
venv\Scripts\activate

# Run backend server
python -m app.main
```

3. Download the dataset:

- Download the [Suicide and Depression Detection](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch) dataset from Kaggle and place it in the appropriate data directory (refer to project documentation or backend/data/).

4. Set up the frontend:
```bash
cd frontend
npm install

npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## 📊 Machine Learning Models

The system uses two models:

1. **CNN-BiLSTM (Primary Model)**
   - Embedding layer (100 dimensions)
   - 2 Conv1D layers (128 filters)
   - 2 BiLSTM layers (64, 32 units)
   - Dense layers with dropout

2. **RNN Model**
   - LSTM layers
   - GRU layers
   - Attention mechanism

## 📚 Datasets

The project uses the following dataset for training and evaluation:

- [Suicide and Depression Detection](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch) - A comprehensive dataset containing social media posts for mental health condition analysis.

## 📈 Performance Metrics

- Model accuracy: >90%
- False positive rate: <5%
- Response time: <2 seconds
- Real-time processing capability
- Continuous monitoring support


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

