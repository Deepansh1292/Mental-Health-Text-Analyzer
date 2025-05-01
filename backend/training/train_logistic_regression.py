import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from imblearn.over_sampling import SMOTE
from sklearn.pipeline import Pipeline
import pickle
import os

def load_data():
    """Load and preprocess the dataset"""
    df = pd.read_csv('../../Suicide_Detection.csv')
    texts = df['text'].values
    labels = df['class'].values
    return texts, labels

def preprocess_text(texts, labels):
    """Preprocess text data and create features"""
    # Create TF-IDF vectorizer with improved parameters
    vectorizer = TfidfVectorizer(
        max_features=15000,
        stop_words='english',
        ngram_range=(1, 3),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True,
        analyzer='word'
    )
    
    # Transform texts to TF-IDF features
    X = vectorizer.fit_transform(texts)
    
    # Split data with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    # Apply SMOTE to handle class imbalance
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
    
    return X_train_resampled, X_test, y_train_resampled, y_test, vectorizer

def train_and_save_model():
    """Train the model and save it along with necessary components"""
    # Load and preprocess data
    texts, labels = load_data()
    X_train, X_test, y_train, y_test, vectorizer = preprocess_text(texts, labels)
    
    # Create pipeline with hyperparameter tuning
    pipeline = Pipeline([
        ('classifier', LogisticRegression())
    ])
    
    # Define parameter grid for GridSearchCV
    param_grid = {
        'classifier__C': [0.1, 1.0, 10.0, 100.0],
        'classifier__penalty': ['l1', 'l2'],
        'classifier__solver': ['liblinear'],
        'classifier__class_weight': ['balanced', None],
        'classifier__max_iter': [2000]
    }
    
    # Perform GridSearchCV
    grid_search = GridSearchCV(
        pipeline,
        param_grid,
        cv=5,
        scoring='roc_auc',
        n_jobs=-1,
        verbose=1
    )
    
    # Fit the model
    grid_search.fit(X_train, y_train)
    
    # Get best model
    model = grid_search.best_estimator_
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Save model
    with open('models/logistic_regression_model.pickle', 'wb') as handle:
        pickle.dump(model, handle, protocol=pickle.HIGHEST_PROTOCOL)
    
    # Save vectorizer
    with open('models/tfidf_vectorizer.pickle', 'wb') as handle:
        pickle.dump(vectorizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
    
    # Evaluate model on test set
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    test_accuracy = accuracy_score(y_test, y_pred)
    test_auc = roc_auc_score(y_test, y_pred_proba)
    
    print("\nTest set metrics:")
    print(f"Test accuracy: {test_accuracy:.4f}")
    print(f"Test AUC: {test_auc:.4f}")
    print("\nTest set Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Evaluate model on training set
    y_train_pred = model.predict(X_train)
    y_train_pred_proba = model.predict_proba(X_train)[:, 1]
    
    train_accuracy = accuracy_score(y_train, y_train_pred)
    train_auc = roc_auc_score(y_train, y_train_pred_proba)
    
    print("\nTraining set metrics:")
    print(f"Training accuracy: {train_accuracy:.4f}")
    print(f"Training AUC: {train_auc:.4f}")
    print("\nTraining set Classification Report:")
    print(classification_report(y_train, y_train_pred))
    
    print("\nBest parameters:", grid_search.best_params_)
    
    return model, vectorizer

if __name__ == "__main__":
    train_and_save_model() 