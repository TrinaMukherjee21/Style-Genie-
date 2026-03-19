# training/train_intent.py
import sys
import os

# Add src to path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from chatbot.nlp_intent import IntentNLP
import json

def main():
    print("Training Intent Classifier...")
    
    # Initialize the IntentNLP class
    model_dir = "models/intent_classifier"
    intent_nlp = IntentNLP(model_dir)
    
    # Generate training data
    print("Generating training data...")
    training_data = IntentNLP.generate_training_data()
    print(f"Generated {len(training_data)} training samples")
    
    # Print some examples
    print("\nSample training data:")
    for i, sample in enumerate(training_data[:5]):
        print(f"  {i+1}. Text: '{sample['text']}' -> Intent: {sample['intent']}")
    
    # Train the model
    print("\nTraining model...")
    intent_nlp.train(training_data)
    
    # Save the model
    print(f"\nSaving model to {model_dir}...")
    intent_nlp.save_model()
    
    # Test the trained model
    print("\nTesting trained model...")
    test_queries = [
        "find red dresses",
        "what shoes go with this outfit",
        "hello there",
        "show me similar items",
        "I need something cheaper"
    ]
    
    for query in test_queries:
        predictions = intent_nlp.predict_intent(query, top_k=2)
        entities = intent_nlp.extract_entities(query)
        
        print(f"\nQuery: '{query}'")
        print(f"Predicted intents: {predictions}")
        if entities:
            print(f"Extracted entities: {entities}")
    
    print("\nIntent classifier training completed successfully!")
    
    # Save training data for reference
    training_data_path = os.path.join(model_dir, "training_data.json")
    with open(training_data_path, 'w') as f:
        json.dump(training_data, f, indent=2)
    print(f"Training data saved to {training_data_path}")

if __name__ == "__main__":
    main()