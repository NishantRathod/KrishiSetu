from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import Database
from bson import ObjectId
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

Database.initialize()

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get dashboard statistics for current user"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()

        # Get user's listings count
        active_listings = db.products.count_documents({
            'seller_id': user_id,
            'status': 'available'
        })

        total_listings = db.products.count_documents({'seller_id': user_id})

        # Get pending orders (as seller)
        pending_orders = db.orders.count_documents({
            'seller_id': user_id,
            'status': {'$in': ['pending', 'processing', 'in_transit']}
        })

        # Calculate this month's revenue
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_orders = list(db.orders.find({
            'seller_id': user_id,
            'status': 'delivered',
            'created_at': {'$gte': first_day_of_month}
        }))
        monthly_revenue = sum(order.get('total_price', 0) for order in monthly_orders)

        # Calculate total revenue
        all_orders = list(db.orders.find({
            'seller_id': user_id,
            'status': 'delivered'
        }))
        total_revenue = sum(order.get('total_price', 0) for order in all_orders)

        # Get review stats (placeholder - can be expanded later)
        average_rating = 0
        total_reviews = 0

        return jsonify({
            'stats': {
                'monthly_revenue': monthly_revenue,
                'total_revenue': total_revenue,
                'active_listings': active_listings,
                'total_listings': total_listings,
                'pending_orders': pending_orders,
                'average_rating': average_rating,
                'total_reviews': total_reviews
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get orders for current user (as seller)"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()

        orders = list(db.orders.find({'seller_id': user_id}).sort('created_at', -1).limit(10))

        orders_list = []
        for order in orders:
            # Get product details
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            # Get buyer details
            buyer = db.users.find_one({'_id': ObjectId(order['buyer_id'])})

            orders_list.append({
                'id': str(order['_id']),
                'product_name': product['title'] if product else 'Unknown',
                'quantity': order['quantity'],
                'total_price': order['total_price'],
                'buyer_name': buyer['name'] if buyer else 'Unknown',
                'status': order['status'],
                'created_at': order['created_at'].isoformat() if order.get('created_at') else None
            })

        return jsonify({'orders': orders_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/listings', methods=['GET'])
@jwt_required()
def get_user_listings():
    """Get listings for current user"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()

        products = list(db.products.find({'seller_id': user_id}).sort('created_at', -1))

        listings = []
        for product in products:
            listings.append({
                'id': str(product['_id']),
                'title': product['title'],
                'description': product.get('description', ''),
                'price': product['price'],
                'quantity': product['quantity'],
                'unit': product['unit'],
                'category': product.get('category', ''),
                'status': product['status'],
                'created_at': product['created_at'].isoformat() if product.get('created_at') else None
            })

        return jsonify({'listings': listings}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get notifications for current user"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()

        # Get recent orders (notifications about orders)
        recent_orders = list(db.orders.find({
            'seller_id': user_id
        }).sort('created_at', -1).limit(5))

        notifications = []
        for order in recent_orders:
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            buyer = db.users.find_one({'_id': ObjectId(order['buyer_id'])})

            notification_type = 'order'
            if order['status'] == 'delivered':
                notification_type = 'payment'

            notifications.append({
                'id': str(order['_id']),
                'type': notification_type,
                'title': f"New Order" if order['status'] == 'pending' else f"Order {order['status'].title()}",
                'message': f"{buyer['name'] if buyer else 'Someone'} ordered {order['quantity']} {product['unit'] if product else ''} of {product['title'] if product else 'item'}",
                'amount': order['total_price'],
                'created_at': order['created_at'].isoformat() if order.get('created_at') else None
            })

        return jsonify({'notifications': notifications}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
