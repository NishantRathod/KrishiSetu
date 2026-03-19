from datetime import datetime
from database import Database
from bson import ObjectId

class Product:
    """Marketplace Product model"""

    def __init__(self, title, description, price, category, seller_id, quantity, unit, images=None):
        self.title = title
        self.description = description
        self.price = price
        self.category = category  # seeds, fertilizer, equipment, produce, etc.
        self.seller_id = seller_id
        self.quantity = quantity
        self.unit = unit  # kg, liters, pieces, etc.
        self.images = images or []
        self.status = 'available'
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        """Save product to database"""
        db = Database.get_db()
        product_data = {
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'seller_id': self.seller_id,
            'quantity': self.quantity,
            'unit': self.unit,
            'images': self.images,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.products.insert_one(product_data)
        return str(result.inserted_id)

    @staticmethod
    def find_all():
        """Find all products"""
        db = Database.get_db()
        return list(db.products.find({'status': 'available'}))

    @staticmethod
    def find_by_category(category):
        """Find products by category"""
        db = Database.get_db()
        return list(db.products.find({'category': category, 'status': 'available'}))

    @staticmethod
    def find_by_seller(seller_id):
        """Find products by seller ID"""
        db = Database.get_db()
        return list(db.products.find({'seller_id': seller_id}))

    @staticmethod
    def find_by_id(product_id):
        """Find product by ID"""
        db = Database.get_db()
        return db.products.find_one({'_id': ObjectId(product_id)})
