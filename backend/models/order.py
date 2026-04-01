from datetime import datetime
from database import Database
from bson import ObjectId

class Order:
    """Order model for tracking purchases"""

    def __init__(self, product_id, seller_id, buyer_id, quantity, total_price, status='pending'):
        self.product_id = product_id
        self.seller_id = seller_id
        self.buyer_id = buyer_id
        self.quantity = quantity
        self.total_price = total_price
        self.status = status  # pending, processing, in_transit, delivered, cancelled
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def save(self):
        """Save order to database"""
        db = Database.get_db()
        order_data = {
            'product_id': self.product_id,
            'seller_id': self.seller_id,
            'buyer_id': self.buyer_id,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        result = db.orders.insert_one(order_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_seller(seller_id):
        """Find orders where user is seller"""
        db = Database.get_db()
        return list(db.orders.find({'seller_id': seller_id}).sort('created_at', -1))

    @staticmethod
    def find_by_buyer(buyer_id):
        """Find orders where user is buyer"""
        db = Database.get_db()
        return list(db.orders.find({'buyer_id': buyer_id}).sort('created_at', -1))

    @staticmethod
    def find_by_id(order_id):
        """Find order by ID"""
        db = Database.get_db()
        return db.orders.find_one({'_id': ObjectId(order_id)})

    @staticmethod
    def update_status(order_id, status):
        """Update order status"""
        db = Database.get_db()
        db.orders.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
