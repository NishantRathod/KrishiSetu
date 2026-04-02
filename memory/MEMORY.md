# KrishiSetu Project Memory

## Project Overview
Multi-role agricultural marketplace platform with 6+ user roles (farmer, fpo, shg, processor, consumer, startup, admin).

## Tech Stack
- Backend: Flask + MongoDB + PyJWT for authentication
- Frontend: Vanilla JavaScript HTML5
- Roles stored in MongoDB + JWT for performance

## Architecture Patterns

### Role-Based Authorization
1. **JWT Storage:**  Role included in JWT additional_claims for zero-DB-lookup authorization
2. **Backend Validation:** Each route checks JWT role + resource ownership
3. **Frontend Guards:** Permission functions check before showing UI/allowing actions
4. **Database Filters:** Queries filter by seller_id (for sellers) or buyer_id (for consumers)

### Role Definitions
- **Sellers:** farmer, fpo, shg, processor, startup, admin - Can create/manage products
- **Buyers:** consumer - Can only browse and purchase
- **Admin:** Full access to everything

### Permission Model
8 core permissions per role:
- canCreateProduct, canEditProduct, canDeleteProduct
- canBrowseMarketplace, canUpdateOrderStatus
- canViewListings, canViewOrders, canViewPurchaseHistory

## Key Implementation Details

### Backend Entry Points
- `/auth/register` and `/auth/login` - Include role in JWT
- `/dashboard/stats` - Role-aware statistics endpoint
- `/marketplace/products` - Restricted to sellers only
- `/orders/` - Auto-filters buyer vs seller orders based on JWT role

### Frontend Structure
- `role-dashboard.js` - Central config with ROLE_CONFIG and ROLE_PERMISSIONS
- Each dashboard-*.html file has data-role attribute (can be consolidated)
- Functions use hasPermission() before executing actions

## Common Patterns

### Backend - Check Role from JWT
```python
from flask_jwt_extended import get_jwt
claims = get_jwt()
user_role = claims.get('role', 'farmer')
```

### Frontend - Check Permission
```javascript
if (!hasPermission('canCreateProduct')) {
  notify('Permission denied', 'error');
  return;
}
```

## Known Limitations
- Orders endpoint still accepts ?role query param (backend ignores it now, uses JWT)
- No role-in-DB validation (relies on JWT integrity)
- Consumer role has limited functionality (good for MVP)

## Future Enhancements
- Role-based pricing/discounts
- Advanced analytics per role
- Admin dashboard
- Role-specific notifications
- Seller ratings system

## Test Accounts Created (2026-04-01)
- **Farmer**: farmer@test.com / password123 (role: farmer) - Green dashboard
- **Startup**: startup@test.com / password123 (role: startup) - Teal dashboard
- Backend running on http://localhost:5000
