import os
import warnings
from flask import Flask, request, jsonify
from flask_cors import CORS
from .utils.model_loader import model_loader

# Suppress warnings
warnings.filterwarnings('ignore')

# Set environment variables
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN custom operations
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'   # Suppress TensorFlow logging

app = Flask(__name__)
CORS(app)

def get_risk_level(prediction: float) -> str:
    """Convert prediction probability to risk level with adjusted thresholds"""
    if prediction >= 0.85:  # Increased threshold for high risk
        return "high"
    elif prediction >= 0.65:  # Increased threshold for medium risk
        return "medium"
    elif prediction >= 0.35:  # Added threshold for low risk
        return "low"
    else:
        return "neutral"  # Added neutral category

@app.route('/')
def root():
    return jsonify({"message": "Welcome to Mental Health Monitoring API"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        text = data.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Get ensemble prediction
        prediction = model_loader.get_ensemble_prediction(text)
        
        return jsonify({
            "prediction": prediction,
            "model_used": "ensemble",
            "risk_level": get_risk_level(prediction),
            "confidence": abs(prediction - 0.5) * 2
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/cnn-bilstm', methods=['POST'])
def predict_cnn_bilstm():
    try:
        data = request.get_json()
        text = data.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400

        prediction = model_loader.predict_cnn_bilstm(text)
        return jsonify({
            "prediction": prediction,
            "model_used": "cnn-bilstm",
            "risk_level": get_risk_level(prediction),
            "confidence": abs(prediction - 0.5) * 2
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/logistic-regression', methods=['POST'])
def predict_logistic_regression():
    try:
        data = request.get_json()
        text = data.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400

        prediction = model_loader.predict_logistic_regression(text)
        return jsonify({
            "prediction": prediction,
            "model_used": "logistic-regression",
            "risk_level": get_risk_level(prediction),
            "confidence": abs(prediction - 0.5) * 2
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    # Run the Flask application
    app.run(host="0.0.0.0", port=8000, debug=True) 