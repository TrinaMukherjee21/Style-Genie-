# src/preprocessing/hm_processor.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import logging

class HMDataProcessor:
    def __init__(self, config):
        self.config = config
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.text_vectorizer = TfidfVectorizer(
            max_features=config['preprocessing']['max_features'],
            stop_words='english'
        )
        
        # Set up logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
    def load_raw_data(self, data_path):
        """Load H&M raw data files"""
        self.logger.info("Loading H&M dataset...")
        
        self.articles = pd.read_csv(f"{data_path}/articles.csv")
        self.customers = pd.read_csv(f"{data_path}/customers.csv")
        self.transactions = pd.read_csv(f"{data_path}/transactions_train.csv")
        
        self.logger.info(f"Loaded {len(self.articles)} articles, {len(self.customers)} customers, {len(self.transactions)} transactions")
        return self.articles, self.customers, self.transactions
    
    def clean_articles(self):
        """Clean and enhance product data"""
        self.logger.info("Cleaning articles data...")
        
        # Clean product names
        self.articles['prod_name_clean'] = (
            self.articles['prod_name']
            .str.lower()
            .str.strip()
            .fillna('unknown')
        )
        
        # Create combined text features
        self.articles['combined_features'] = (
            self.articles['prod_name_clean'].fillna('') + ' ' +
            self.articles['product_type_name'].fillna('') + ' ' +
            self.articles['colour_group_name'].fillna('') + ' ' +
            self.articles['department_name'].fillna('') + ' ' +
            self.articles['garment_group_name'].fillna('')
        ).str.lower()
        
        # Map to StyleGenie aesthetics
        self.articles['aesthetic_style'] = self.articles['combined_features'].apply(
            self._map_to_aesthetics
        )
        
        return self.articles
    
    def _map_to_aesthetics(self, text):
        """Map product text to StyleGenie aesthetic categories"""
        aesthetic_keywords = {
            'minimalist': ['basic', 'simple', 'clean', 'minimal', 'plain'],
            'vintage': ['vintage', 'retro', 'classic', 'traditional'],
            'cyberpunk': ['tech', 'metallic', 'futuristic', 'neon'],
            'gothic': ['black', 'dark', 'gothic', 'metal'],
            'boho': ['bohemian', 'hippie', 'ethnic', 'folk'],
            'preppy': ['preppy', 'classic', 'formal', 'business'],
            'streetwear': ['street', 'urban', 'hip', 'casual'],
            'maximalist': ['bright', 'colorful', 'pattern', 'print']
        }
        
        for aesthetic, keywords in aesthetic_keywords.items():
            if any(keyword in text for keyword in keywords):
                return aesthetic
        return 'minimalist'  # Default
    
    def create_user_profiles(self):
        """Create user aesthetic profiles from transaction history"""
        self.logger.info("Creating user profiles...")
        
        # Merge transactions with articles
        user_items = self.transactions.merge(
            self.articles[['article_id', 'aesthetic_style']], 
            on='article_id',
            how='left'
        )
        
        # Calculate user aesthetic preferences
        user_aesthetics = (
            user_items.groupby(['customer_id', 'aesthetic_style'])
            .size()
            .unstack(fill_value=0)
        )
        
        # Normalize to percentages
        user_profiles = user_aesthetics.div(user_aesthetics.sum(axis=1), axis=0) * 100
        
        # Add user metadata
        user_profiles = user_profiles.merge(
            self.customers[['customer_id', 'age', 'club_member_status']], 
            on='customer_id',
            how='left'
        )
        
        return user_profiles
    
    def create_training_dataset(self, sample_size=100000):
        """Create training dataset for recommendation model"""
        self.logger.info(f"Creating training dataset (sample size: {sample_size})...")
        
        # Sample transactions for manageable training size
        sample_transactions = self.transactions.sample(
            n=min(sample_size, len(self.transactions)), 
            random_state=42
        )
        
        # Merge with product and customer data
        training_data = (
            sample_transactions
            .merge(self.articles, on='article_id', how='left')
            .merge(self.customers, on='customer_id', how='left')
        )
        
        # Create features
        training_data['rating'] = 1  # Implicit positive feedback
        training_data['user_age_group'] = pd.cut(training_data['age'], bins=5, labels=False)
        
        # Filter out incomplete records
        training_data = training_data.dropna(subset=['prod_name', 'customer_id', 'article_id'])
        
        self.logger.info(f"Created training dataset with {len(training_data)} records")
        return training_data
    
    def save_processed_data(self, output_path):
        """Save all processed data"""
        self.logger.info(f"Saving processed data to {output_path}")
        
        # Save processed DataFrames
        self.articles.to_csv(f"{output_path}/articles_processed.csv", index=False)
        self.customers.to_csv(f"{output_path}/customers_processed.csv", index=False)
        
        # Save preprocessor components
        with open(f"{output_path}/preprocessor.pkl", 'wb') as f:
            pickle.dump({
                'label_encoders': self.label_encoders,
                'scaler': self.scaler,
                'text_vectorizer': self.text_vectorizer
            }, f)

# Usage example (you'll run this once dataset downloads)
"""
from src.preprocessing.hm_processor import HMDataProcessor
import yaml

# Load config
with open('config/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

# Process data
processor = HMDataProcessor(config)
articles, customers, transactions = processor.load_raw_data('data/raw')
articles_clean = processor.clean_articles()
user_profiles = processor.create_user_profiles()
training_data = processor.create_training_dataset()
processor.save_processed_data('data/processed')
"""