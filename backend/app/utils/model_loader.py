import os
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import warnings

# Suppress TensorFlow warnings
tf.get_logger().setLevel('ERROR')
warnings.filterwarnings('ignore', category=UserWarning)

class ModelLoader:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'training', 'models')
        self.models = {}
        self.tokenizers = {}
        self.vectorizer = None
        self.load_all_models()
    
    def load_all_models(self):
        """Load all trained models and their associated components"""
        # Load CNN-BiLSTM model
        cnn_bilstm_path = os.path.join(self.models_dir, 'cnn_bilstm_model.h5')
        if os.path.exists(cnn_bilstm_path):
            self.models['cnn_bilstm'] = load_model(cnn_bilstm_path)
            # Compile the model
            self.models['cnn_bilstm'].compile(
                optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            with open(os.path.join(self.models_dir, 'tokenizer.pickle'), 'rb') as handle:
                self.tokenizers['cnn_bilstm'] = pickle.load(handle)
        
        # Load Logistic Regression model
        lr_path = os.path.join(self.models_dir, 'logistic_regression_model.pickle')
        if os.path.exists(lr_path):
            with open(lr_path, 'rb') as handle:
                self.models['logistic_regression'] = pickle.load(handle)
            with open(os.path.join(self.models_dir, 'tfidf_vectorizer.pickle'), 'rb') as handle:
                self.vectorizer = pickle.load(handle)
    
    def predict_cnn_bilstm(self, text):
        """Make prediction using CNN-BiLSTM model"""
        if 'cnn_bilstm' not in self.models:
            raise ValueError("CNN-BiLSTM model not loaded")
        
        # Preprocess text
        tokenizer = self.tokenizers['cnn_bilstm']
        sequence = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequence, maxlen=200)
        
        # Make prediction
        prediction = self.models['cnn_bilstm'].predict(padded, verbose=0)
        return float(prediction[0][0])
    
    def predict_logistic_regression(self, text):
        """Make prediction using Logistic Regression model"""
        if 'logistic_regression' not in self.models:
            raise ValueError("Logistic Regression model not loaded")
        
        # Preprocess text
        features = self.vectorizer.transform([text])
        
        # Make prediction
        prediction = self.models['logistic_regression'].predict_proba(features)
        return float(prediction[0][1])
    
    def get_ensemble_prediction(self, text):
        """Get ensemble prediction from available models"""
        predictions = []
        
        # Get predictions from each model
        if 'cnn_bilstm' in self.models:
            predictions.append(self.predict_cnn_bilstm(text))
        if 'logistic_regression' in self.models:
            predictions.append(self.predict_logistic_regression(text))
        
        if not predictions:
            raise ValueError("No models available for prediction")
        
        # Return average prediction
        return sum(predictions) / len(predictions)

# Create a singleton instance
model_loader = ModelLoader() 