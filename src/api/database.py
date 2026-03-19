# src/api/database.py
import os
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
import bcrypt
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self, app=None):
        self.db = None
        self.client = None
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        # MongoDB connection - load from environment
        from dotenv import load_dotenv
        load_dotenv()
        
        mongo_uri = os.getenv('MONGODB_URI')
        if not mongo_uri:
            logger.error("MONGODB_URI not found in environment variables!")
            raise Exception("MongoDB connection string not configured")
            
        # Configure MongoDB client with SSL settings
        try:
            self.client = MongoClient(
                mongo_uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                tls=True,
                tlsAllowInvalidCertificates=True,
                retryWrites=True
            )
            self.db = self.client.stylegenie
        except Exception as e:
            logger.error(f"Failed to create MongoDB client: {e}")
            # Fallback to basic connection
            try:
                self.client = MongoClient(mongo_uri)
                self.db = self.client.stylegenie
            except Exception as fallback_error:
                logger.error(f"Fallback connection also failed: {fallback_error}")
                raise Exception(f"MongoDB connection failed: {fallback_error}")
        
        # Test connection
        try:
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB!")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
        
        # Create indexes
        self._create_indexes()
    
    def _create_indexes(self):
        """Create database indexes for performance"""
        try:
            # Users collection indexes
            self.db.users.create_index("email", unique=True)
            self.db.users.create_index("username", unique=True)
            
            # Quiz results indexes
            self.db.quiz_results.create_index("userId")
            self.db.quiz_results.create_index("completedAt")
            
            # Favorites indexes
            self.db.favorites.create_index([("userId", 1), ("productId", 1)], unique=True)
            
            # Recommendations indexes
            self.db.recommendations.create_index("userId")
            self.db.recommendations.create_index("createdAt")
            
            # Interactions indexes
            self.db.interactions.create_index([("userId", 1), ("createdAt", -1)])
            
            logger.info("Database indexes created successfully!")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")

class UserManager:
    def __init__(self, db):
        self.db = db
        self.users = db.users
    
    def create_user(self, email, username, password, profile_data=None):
        """Create a new user"""
        try:
            # Check if user exists
            if self.users.find_one({"$or": [{"email": email}, {"username": username}]}):
                return {"error": "User already exists"}, 400
            
            # Hash password and convert to string for storage
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create user document
            user_doc = {
                "email": email,
                "username": username,
                "password_hash": password_hash,
                "profile": profile_data or {},
                "createdAt": datetime.utcnow(),
                "lastLogin": None,
                "isActive": True
            }
            
            result = self.users.insert_one(user_doc)
            
            # Return user without password
            user = self.users.find_one({"_id": result.inserted_id}, {"password_hash": 0})
            return {"user": self._serialize_user(user)}, 201
            
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return {"error": "Failed to create user"}, 500
    
    def authenticate_user(self, email, password):
        """Authenticate user login"""
        try:
            user = self.users.find_one({"email": email})
            if user is None:
                return {"error": "Invalid credentials"}, 401
            
            # Check password (convert string back to bytes for comparison)
            stored_hash = user['password_hash']
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('utf-8')
            if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
                return {"error": "Invalid credentials"}, 401
            
            # Update last login
            self.users.update_one(
                {"_id": user["_id"]}, 
                {"$set": {"lastLogin": datetime.utcnow()}}
            )
            
            # Get user without password hash for response
            user_clean = self.users.find_one({"_id": user["_id"]}, {"password_hash": 0})
            return {"user": self._serialize_user(user_clean)}, 200
            
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return {"error": "Authentication failed"}, 500
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            from bson import ObjectId
            user = self.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
            return self._serialize_user(user) if user else None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None
    
    def _serialize_user(self, user):
        """Serialize user document for JSON response"""
        if user is None:
            return None
        
        user['_id'] = str(user['_id'])
        return user

class QuizManager:
    def __init__(self, db):
        self.db = db
        self.quiz_results = db.quiz_results
    
    def save_quiz_result(self, user_id, quiz_data, style_profile):
        """Save quiz results for user"""
        try:
            from bson import ObjectId
            
            quiz_doc = {
                "userId": ObjectId(user_id),
                "quizData": quiz_data,
                "styleProfile": style_profile,
                "completedAt": datetime.utcnow(),
                "version": "1.0"
            }
            
            # Remove any existing results for this user
            self.quiz_results.delete_many({"userId": ObjectId(user_id)})
            
            # Insert new result
            result = self.quiz_results.insert_one(quiz_doc)
            return {"id": str(result.inserted_id)}, 201
            
        except Exception as e:
            logger.error(f"Error saving quiz result: {e}")
            return {"error": "Failed to save quiz result"}, 500
    
    def get_user_quiz_result(self, user_id):
        """Get latest quiz result for user"""
        try:
            from bson import ObjectId
            
            result = self.quiz_results.find_one(
                {"userId": ObjectId(user_id)},
                sort=[("completedAt", -1)]
            )
            
            if result:
                result['_id'] = str(result['_id'])
                result['userId'] = str(result['userId'])
                return result
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting quiz result: {e}")
            return None

class FavoritesManager:
    def __init__(self, db):
        self.db = db
        self.favorites = db.favorites
    
    def add_favorite(self, user_id, product_data):
        """Add product to favorites"""
        try:
            from bson import ObjectId
            
            favorite_doc = {
                "userId": ObjectId(user_id),
                "productId": product_data.get('id'),
                "product": product_data,
                "addedAt": datetime.utcnow(),
                "source": product_data.get('source', 'unknown')
            }
            
            # Use upsert to avoid duplicates
            result = self.favorites.update_one(
                {
                    "userId": ObjectId(user_id), 
                    "productId": product_data.get('id')
                },
                {"$set": favorite_doc},
                upsert=True
            )
            
            return {"success": True}, 201
            
        except Exception as e:
            logger.error(f"Error adding favorite: {e}")
            return {"error": "Failed to add favorite"}, 500
    
    def remove_favorite(self, user_id, product_id):
        """Remove product from favorites"""
        try:
            from bson import ObjectId
            
            result = self.favorites.delete_one({
                "userId": ObjectId(user_id),
                "productId": product_id
            })
            
            return {"success": True}, 200
            
        except Exception as e:
            logger.error(f"Error removing favorite: {e}")
            return {"error": "Failed to remove favorite"}, 500
    
    def get_user_favorites(self, user_id):
        """Get user's favorites"""
        try:
            from bson import ObjectId
            
            favorites = list(self.favorites.find(
                {"userId": ObjectId(user_id)},
                sort=[("addedAt", -1)]
            ))
            
            # Serialize ObjectIds
            for fav in favorites:
                fav['_id'] = str(fav['_id'])
                fav['userId'] = str(fav['userId'])
            
            return favorites
            
        except Exception as e:
            logger.error(f"Error getting favorites: {e}")
            return []