from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from database import Database
from bson import ObjectId
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

Database.initialize()

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get dashboard statistics for current user (role-aware)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        db = Database.get_db()

        # Buyer (Consumer) Stats
        if user_role == 'consumer':
            # Get total purchases
            total_purchases = db.orders.count_documents({'buyer_id': user_id})

            # Get pending deliveries
            pending_deliveries = db.orders.count_documents({
                'buyer_id': user_id,
                'status': {'$in': ['pending', 'processing', 'in_transit']}
            })

            # Get delivered orders
            delivered_orders = db.orders.count_documents({
                'buyer_id': user_id,
                'status': 'delivered'
            })

            # Calculate total spent
            all_purchases = list(db.orders.find({'buyer_id': user_id}))
            total_spent = sum(order.get('total_price', 0) for order in all_purchases)

            # Get favorite sellers (top 3 sellers by purchase count)
            favorite_sellers_pipeline = [
                {'$match': {'buyer_id': user_id}},
                {'$group': {'_id': '$seller_id', 'count': {'$sum': 1}}},
                {'$sort': {'count': -1}},
                {'$limit': 3}
            ]
            favorite_sellers_data = list(db.orders.aggregate(favorite_sellers_pipeline))
            favorite_sellers = len(favorite_sellers_data)

            return jsonify({
                'stats': {
                    'total_purchases': total_purchases,
                    'pending_deliveries': pending_deliveries,
                    'delivered_orders': delivered_orders,
                    'total_spent': total_spent,
                    'favorite_sellers': favorite_sellers
                }
            }), 200

        # Seller Stats (Default for all non-consumer roles)
        else:
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


@dashboard_bp.route('/purchase-history', methods=['GET'])
@jwt_required()
def get_purchase_history():
    """Get purchase history for buyers (consumers)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        db = Database.get_db()

        # Only consumers can view purchase history
        if user_role != 'consumer':
            return jsonify({'error': 'This endpoint is only available for consumers'}), 403

        orders = list(db.orders.find({'buyer_id': user_id}).sort('created_at', -1).limit(50))

        orders_list = []
        for order in orders:
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            seller = db.users.find_one({'_id': ObjectId(order['seller_id'])})

            orders_list.append({
                'id': str(order['_id']),
                'product_name': product['title'] if product else 'Unknown',
                'seller_name': seller['name'] if seller else 'Unknown',
                'quantity': order['quantity'],
                'unit': product['unit'] if product else '',
                'total_price': order['total_price'],
                'status': order['status'],
                'created_at': order['created_at'].isoformat() if order.get('created_at') else None
            })

        return jsonify({'purchases': orders_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/buyer-insights', methods=['GET'])
@jwt_required()
def get_buyer_insights():
    """Get detailed insights for buyers (consumers)"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_role = claims.get('role', 'farmer')
        db = Database.get_db()

        # Only consumers can view buyer insights
        if user_role != 'consumer':
            return jsonify({'error': 'This endpoint is only available for consumers'}), 403

        # Get all orders
        all_orders = list(db.orders.find({'buyer_id': user_id}))

        # Category preferences (most purchased categories)
        category_counts = {}
        for order in all_orders:
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            if product:
                category = product.get('category', 'Other')
                category_counts[category] = category_counts.get(category, 0) + 1

        top_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:5]

        # Average order value
        total_spent = sum(order.get('total_price', 0) for order in all_orders)
        avg_order_value = total_spent / len(all_orders) if all_orders else 0

        # Top sellers
        seller_counts = {}
        for order in all_orders:
            seller_id = order['seller_id']
            seller_counts[seller_id] = seller_counts.get(seller_id, 0) + 1

        top_sellers_data = []
        for seller_id, count in sorted(seller_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            seller = db.users.find_one({'_id': ObjectId(seller_id)})
            top_sellers_data.append({
                'seller_name': seller['name'] if seller else 'Unknown',
                'order_count': count
            })

        return jsonify({
            'insights': {
                'total_orders': len(all_orders),
                'total_spent': total_spent,
                'average_order_value': avg_order_value,
                'top_categories': [{'category': cat, 'count': count} for cat, count in top_categories],
                'top_sellers': top_sellers_data
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
