import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, MaxPooling1D, Bidirectional, LSTM, Dense, Dropout
import pickle
import os

# Constants
MAX_WORDS = 10000
MAX_LEN = 200
EMBEDDING_DIM = 100

def load_data():
    """Load and preprocess the dataset"""
    df = pd.read_csv('../../Suicide_Detection.csv')
    texts = df['text'].values
    labels = df['class'].values
    
    # Convert labels to numeric
    le = LabelEncoder()
    labels = le.fit_transform(labels)
    
    return texts, labels

def preprocess_text(texts, labels):
    """Preprocess text data and create sequences"""
    # Tokenize text
    tokenizer = Tokenizer(num_words=MAX_WORDS)
    tokenizer.fit_on_texts(texts)
    
    # Convert text to sequences
    sequences = tokenizer.texts_to_sequences(texts)
    
    # Pad sequences
    X = pad_sequences(sequences, maxlen=MAX_LEN)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, labels, test_size=0.2, random_state=42
    )
    
    return X_train, X_test, y_train, y_test, tokenizer

def create_model():
    """Create CNN-BiLSTM model architecture"""
    model = Sequential([
        Embedding(MAX_WORDS, EMBEDDING_DIM, input_length=MAX_LEN),
        Conv1D(128, 5, activation='relu'),
        MaxPooling1D(5),
        Conv1D(128, 5, activation='relu'),
        MaxPooling1D(5),
        Bidirectional(LSTM(64, return_sequences=True)),
        Bidirectional(LSTM(32)),
        Dense(64, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_and_save_model():
    """Train the model and save it along with necessary components"""
    # Load and preprocess data
    texts, labels = load_data()
    X_train, X_test, y_train, y_test, tokenizer = preprocess_text(texts, labels)
    
    # Create and train model
    model = create_model()
    
    # Early stopping to prevent overfitting
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=3,
        restore_best_weights=True
    )
    
    # Train model
    history = model.fit(
        X_train, y_train,
        epochs=10,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=[early_stopping]
    )
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Save model
    model.save('models/cnn_bilstm_model.h5')
    
    # Save tokenizer
    with open('models/tokenizer.pickle', 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
    
    # Evaluate model
    test_loss, test_accuracy = model.evaluate(X_test, y_test)
    print(f"Test accuracy: {test_accuracy:.4f}")
    
    return model, tokenizer

if __name__ == "__main__":
    train_and_save_model() 