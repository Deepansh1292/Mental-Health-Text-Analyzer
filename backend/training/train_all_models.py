import os
import subprocess
import time

def train_all_models():
    """Train all models in sequence"""
    print("Starting model training process...")
    
    # List of training scripts
    training_scripts = [
        'train_cnn_bilstm.py',
        'train_logistic_regression.py'
    ]
    
    # Run each training script
    for script in training_scripts:
        print(f"\nTraining model using {script}...")
        start_time = time.time()
        
        try:
            subprocess.run(['python', script], check=True)
            end_time = time.time()
            print(f"Completed {script} in {end_time - start_time:.2f} seconds")
        except subprocess.CalledProcessError as e:
            print(f"Error training model with {script}: {str(e)}")
            continue
    
    print("\nAll model training completed!")

if __name__ == "__main__":
    train_all_models() 