# training/train_visual_attrs.py
import sys
import os

# Add src to path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import json
from chatbot.visual_attrs import VisualAttrs
import random

class SyntheticFashionDataset(Dataset):
    def __init__(self, num_samples=1000, image_size=(224, 224)):
        self.num_samples = num_samples
        self.image_size = image_size
        
        self.transform = transforms.Compose([
            transforms.Resize(image_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        # Color mappings
        self.colors = [
            'red', 'blue', 'green', 'yellow', 'black', 
            'white', 'pink', 'purple', 'orange', 'brown'
        ]
        
        self.categories = [
            'dress', 'shirt', 'pants', 'skirt', 'jacket',
            'coat', 'top', 'blouse', 'jeans', 'shorts',
            'sweater', 'hoodie', 'tank_top', 'blazer', 'cardigan',
            'jumpsuit', 'romper', 'vest', 'tunic', 'other'
        ]
        
        self.patterns = [
            'solid', 'striped', 'floral', 'polka_dot', 'geometric'
        ]
        
        # RGB mappings for colors
        self.color_rgb = {
            'red': (200, 50, 50),
            'blue': (50, 50, 200),
            'green': (50, 200, 50),
            'yellow': (200, 200, 50),
            'black': (30, 30, 30),
            'white': (220, 220, 220),
            'pink': (200, 100, 150),
            'purple': (150, 50, 150),
            'orange': (200, 120, 50),
            'brown': (120, 80, 40)
        }
        
        # Generate synthetic data
        self.generate_data()
    
    def generate_data(self):
        self.data = []
        
        for i in range(self.num_samples):
            # Random attributes
            color = random.choice(self.colors)
            category = random.choice(self.categories)
            pattern = random.choice(self.patterns)
            
            # Generate synthetic image
            image = self.generate_synthetic_image(color, pattern)
            
            self.data.append({
                'image': image,
                'color': self.colors.index(color),
                'category': self.categories.index(category),
                'pattern': self.patterns.index(pattern)
            })
    
    def generate_synthetic_image(self, color, pattern):
        # Create a synthetic image with the specified color and pattern
        img = Image.new('RGB', self.image_size, self.color_rgb.get(color, (128, 128, 128)))
        pixels = np.array(img)
        
        if pattern == 'striped':
            # Add stripes
            for i in range(0, self.image_size[0], 20):
                pixels[i:i+10, :, :] = [max(0, c-50) for c in self.color_rgb[color]]
        
        elif pattern == 'polka_dot':
            # Add polka dots
            for i in range(20, self.image_size[0], 40):
                for j in range(20, self.image_size[1], 40):
                    for di in range(-5, 6):
                        for dj in range(-5, 6):
                            if di*di + dj*dj <= 25 and 0 <= i+di < self.image_size[0] and 0 <= j+dj < self.image_size[1]:
                                pixels[i+di, j+dj, :] = [min(255, c+50) for c in self.color_rgb[color]]
        
        elif pattern == 'geometric':
            # Add geometric pattern
            for i in range(0, self.image_size[0], 30):
                for j in range(0, self.image_size[1], 30):
                    if (i//30 + j//30) % 2 == 0:
                        pixels[i:i+15, j:j+15, :] = [max(0, c-30) for c in self.color_rgb[color]]
        
        # Add some noise
        noise = np.random.normal(0, 10, pixels.shape).astype(np.int8)
        pixels = np.clip(pixels.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        return Image.fromarray(pixels)
    
    def __len__(self):
        return self.num_samples
    
    def __getitem__(self, idx):
        sample = self.data[idx]
        image = self.transform(sample['image'])
        
        return (
            image,
            torch.tensor(sample['color'], dtype=torch.long),
            torch.tensor(sample['category'], dtype=torch.long),
            torch.tensor(sample['pattern'], dtype=torch.long)
        )

def create_data_loaders(train_samples=800, val_samples=200, batch_size=32):
    print("Creating synthetic datasets...")
    
    train_dataset = SyntheticFashionDataset(num_samples=train_samples)
    val_dataset = SyntheticFashionDataset(num_samples=val_samples)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    return train_loader, val_loader

def main():
    print("Training Visual Attributes Model...")
    
    # Model path
    model_path = "models/visual_attrs/visual_attrs.pth"
    
    # Initialize visual attrs class
    visual_attrs = VisualAttrs(model_path)
    
    # Create data loaders
    print("Preparing training data...")
    train_loader, val_loader = create_data_loaders(train_samples=800, val_samples=200, batch_size=16)
    
    print(f"Training samples: {len(train_loader.dataset)}")
    print(f"Validation samples: {len(val_loader.dataset)}")
    
    # Train the model
    print("\nStarting training...")
    trained_model = visual_attrs.train_model(
        train_loader=train_loader,
        val_loader=val_loader,
        num_epochs=5,  # Reduced for faster training
        learning_rate=0.001
    )
    
    print("Training completed!")
    
    # Test the trained model
    print("\nTesting trained model with sample synthetic images...")
    
    # Create a test dataset
    test_dataset = SyntheticFashionDataset(num_samples=5)
    
    for i in range(min(5, len(test_dataset.data))):
        sample = test_dataset.data[i]
        test_image = sample['image']
        true_color = test_dataset.colors[sample['color']]
        true_category = test_dataset.categories[sample['category']]
        true_pattern = test_dataset.patterns[sample['pattern']]
        
        # Get prediction
        prediction = visual_attrs.predict(test_image)
        
        print(f"\nTest {i+1}:")
        print(f"  True: color={true_color}, category={true_category}, pattern={true_pattern}")
        print(f"  Predicted: color={prediction.get('color', 'unknown')}, " +
              f"category={prediction.get('category', 'unknown')}, " +
              f"pattern={prediction.get('pattern', 'unknown')}")
        print(f"  Confidences: color={prediction.get('color_confidence', 0):.3f}, " +
              f"category={prediction.get('category_confidence', 0):.3f}, " +
              f"pattern={prediction.get('pattern_confidence', 0):.3f}")
    
    print(f"\nVisual attributes model training completed!")
    print(f"Model saved to: {model_path}")

if __name__ == "__main__":
    main()