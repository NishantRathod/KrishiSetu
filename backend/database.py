from pymongo import MongoClient
from config import Config

class Database:
    """MongoDB Database connection"""
    client = None
    db = None

    @staticmethod
    def initialize():
        """Initialize database connection"""
        Database.client = MongoClient(Config.MONGO_URI)
        Database.db = Database.client.get_database()

    @staticmethod
    def get_db():
        """Get database instance"""
        if Database.db is None:
            Database.initialize()
        return Database.db

    @staticmethod
    def close():
        """Close database connection"""
        if Database.client:
            Database.client.close()
