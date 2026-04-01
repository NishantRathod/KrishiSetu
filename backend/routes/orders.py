from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order
from database import Database
from bson import ObjectId
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

Database.initialize()

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get all orders for current user (as buyer or seller)"""
    try:
        user_id = get_jwt_identity()
        role = request.args.get('role', 'seller')  # seller or buyer
        db = Database.get_db()

        if role == 'buyer':
            orders = Order.find_by_buyer(user_id)
        else:
            orders = Order.find_by_seller(user_id)

        orders_list = []
        for order in orders:
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            other_user_id = order['buyer_id'] if role == 'seller' else order['seller_id']
            other_user = db.users.find_one({'_id': ObjectId(other_user_id)})

            orders_list.append({
                'id': str(order['_id']),
                'product_id': order['product_id'],
                'product_name': product['title'] if product else 'Unknown',
                'product_unit': product['unit'] if product else '',
                'quantity': order['quantity'],
                'total_price': order['total_price'],
                'other_party': other_user['name'] if other_user else 'Unknown',
                'status': order['status'],
                'created_at': order['created_at'].isoformat() if order.get('created_at') else None
            })

        return jsonify({'orders': orders_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """Create a new order"""
    try:
        buyer_id = get_jwt_identity()
        data = request.get_json()
        db = Database.get_db()

        # Validate required fields
        if not data.get('product_id'):
            return jsonify({'error': 'Product ID is required'}), 400
        if not data.get('quantity'):
            return jsonify({'error': 'Quantity is required'}), 400

        # Get product details
        product = db.products.find_one({'_id': ObjectId(data['product_id'])})
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        if product['status'] != 'available':
            return jsonify({'error': 'Product is not available'}), 400

        quantity = float(data['quantity'])
        if quantity > product['quantity']:
            return jsonify({'error': 'Requested quantity exceeds available stock'}), 400

        # Calculate total price
        total_price = quantity * product['price']

        # Create order
        order = Order(
            product_id=data['product_id'],
            seller_id=product['seller_id'],
            buyer_id=buyer_id,
            quantity=quantity,
            total_price=total_price,
            status='pending'
        )

        order_id = order.save()

        # Update product quantity
        new_quantity = product['quantity'] - quantity
        update_data = {'quantity': new_quantity, 'updated_at': datetime.utcnow()}
        if new_quantity <= 0:
            update_data['status'] = 'sold_out'

        db.products.update_one(
            {'_id': ObjectId(data['product_id'])},
            {'$set': update_data}
        )

        return jsonify({
            'message': 'Order created successfully',
            'order_id': order_id,
            'total_price': total_price
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get a specific order"""
    try:
        user_id = get_jwt_identity()
        order = Order.find_by_id(order_id)

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Check if user is seller or buyer
        if order['seller_id'] != user_id and order['buyer_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        db = Database.get_db()
        product = db.products.find_one({'_id': ObjectId(order['product_id'])})
        seller = db.users.find_one({'_id': ObjectId(order['seller_id'])})
        buyer = db.users.find_one({'_id': ObjectId(order['buyer_id'])})

        return jsonify({
            'order': {
                'id': str(order['_id']),
                'product_name': product['title'] if product else 'Unknown',
                'quantity': order['quantity'],
                'total_price': order['total_price'],
                'seller_name': seller['name'] if seller else 'Unknown',
                'buyer_name': buyer['name'] if buyer else 'Unknown',
                'status': order['status'],
                'created_at': order['created_at'].isoformat() if order.get('created_at') else None
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        db = Database.get_db()

        order = Order.find_by_id(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Only seller can update status
        if order['seller_id'] != user_id:
            return jsonify({'error': 'Only seller can update order status'}), 403

        new_status = data.get('status')
        valid_statuses = ['pending', 'processing', 'in_transit', 'delivered', 'cancelled']

        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400

        Order.update_status(order_id, new_status)

        # If cancelled, restore product quantity
        if new_status == 'cancelled':
            product = db.products.find_one({'_id': ObjectId(order['product_id'])})
            if product:
                new_quantity = product['quantity'] + order['quantity']
                db.products.update_one(
                    {'_id': ObjectId(order['product_id'])},
                    {'$set': {'quantity': new_quantity, 'status': 'available', 'updated_at': datetime.utcnow()}}
                )

        return jsonify({'message': f'Order status updated to {new_status}'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
