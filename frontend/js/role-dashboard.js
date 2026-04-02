const API_BASE_URL = 'http://localhost:5000/api';

// Define permissions for each role
const ROLE_PERMISSIONS = {
  farmer: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: false
  },
  fpo: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: false
  },
  shg: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: false
  },
  processor: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: false
  },
  consumer: {
    canCreateProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: false,
    canViewListings: false,
    canViewOrders: true,
    canViewPurchaseHistory: true
  },
  startup: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: false
  },
  admin: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canBrowseMarketplace: true,
    canUpdateOrderStatus: true,
    canViewListings: true,
    canViewOrders: true,
    canViewPurchaseHistory: true
  }
};

const ROLE_CONFIG = {
  farmer: {
    title: 'Farmer Dashboard',
    subtitle: 'Track crops, manage listings, and monitor mandi trends.',
    welcome: 'Ready to sell today\'s harvest?',
    orderView: 'seller',
    showListings: true,
    icon: '🌾',
    permissions: ROLE_PERMISSIONS.farmer,
    quickActions: [
      { key: 'add-listing', label: 'Add Crop Listing', permission: 'canCreateProduct' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-marketplace', label: 'Open Marketplace', permission: 'canBrowseMarketplace' }
    ]
  },
  fpo: {
    title: 'FPO Dashboard',
    subtitle: 'Coordinate member produce and manage bulk supply pipelines.',
    welcome: 'Keep your producer network efficient and profitable.',
    orderView: 'seller',
    showListings: true,
    icon: '👥',
    permissions: ROLE_PERMISSIONS.fpo,
    quickActions: [
      { key: 'add-listing', label: 'Add Bulk Listing', permission: 'canCreateProduct' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-marketplace', label: 'Open Marketplace', permission: 'canBrowseMarketplace' }
    ]
  },
  shg: {
    title: 'SHG Dashboard',
    subtitle: 'Promote community products and monitor group earnings.',
    welcome: 'Strengthen your group with better market visibility.',
    orderView: 'seller',
    showListings: true,
    icon: '🏘️',
    permissions: ROLE_PERMISSIONS.shg,
    quickActions: [
      { key: 'add-listing', label: 'Upload SHG Product', permission: 'canCreateProduct' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-marketplace', label: 'Open Marketplace', permission: 'canBrowseMarketplace' }
    ]
  },
  processor: {
    title: 'Processor Dashboard',
    subtitle: 'Source raw material, plan production, and track procurement.',
    welcome: 'Your processing pipeline is ready for optimization.',
    orderView: 'seller',
    showListings: true,
    icon: '🏭',
    permissions: ROLE_PERMISSIONS.processor,
    quickActions: [
      { key: 'add-listing', label: 'Create Procurement Listing', permission: 'canCreateProduct' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-marketplace', label: 'Open Marketplace', permission: 'canBrowseMarketplace' }
    ]
  },
  consumer: {
    title: 'Consumer Dashboard',
    subtitle: 'Discover quality millet products and manage your purchases.',
    welcome: 'Healthy millet choices are one click away.',
    orderView: 'buyer',
    showListings: false,
    icon: '🛒',
    permissions: ROLE_PERMISSIONS.consumer,
    quickActions: [
      { key: 'go-marketplace', label: 'Browse Marketplace', permission: 'canBrowseMarketplace' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-profile', label: 'Open Profile', permission: null }
    ]
  },
  startup: {
    title: 'Startup Dashboard',
    subtitle: 'Explore market gaps, pilot ideas, and connect with ecosystem players.',
    welcome: 'Build your next agri innovation with live ecosystem data.',
    orderView: 'seller',
    showListings: true,
    icon: '🚀',
    permissions: ROLE_PERMISSIONS.startup,
    quickActions: [
      { key: 'add-listing', label: 'Add Pilot Product', permission: 'canCreateProduct' },
      { key: 'refresh-data', label: 'Refresh Dashboard', permission: null },
      { key: 'go-marketplace', label: 'Open Marketplace', permission: 'canBrowseMarketplace' }
    ]
  }
};

const DASHBOARD_STATE = {
  role: 'farmer',
  config: ROLE_CONFIG.farmer,
  user: {},
  listings: [],
  orders: []
};

function getUserDataSafe() {
  try {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  } catch {
    return {};
  }
}

function getToken() {
  return localStorage.getItem('authToken');
}

function notify(message, type = 'info') {
  if (window.KrishiAuth && window.KrishiAuth.showNotification) {
    window.KrishiAuth.showNotification(message, type);
  }
}

function formatCurrency(amount) {
  return `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;
}

function statusBadge(status) {
  const map = {
    pending: 'pending',
    processing: 'processing',
    in_transit: 'processing',
    delivered: 'delivered',
    cancelled: 'cancelled'
  };
  const cls = map[status] || 'pending';
  const label = String(status || '').replace('_', ' ');
  return `<span class="status-badge ${cls}">${label}</span>`;
}

// Permission checking functions
function hasPermission(permission) {
  const config = DASHBOARD_STATE.config;
  if (!config.permissions) return true; // Fallback
  return config.permissions[permission] === true;
}

function canPerformAction(actionKey) {
  const config = DASHBOARD_STATE.config;
  const action = config.quickActions.find(a => a.key === actionKey);
  if (!action || !action.permission) return true;
  return hasPermission(action.permission);
}

async function apiFetch(path, options = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = 'auth.html';
      return null;
    }
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

function renderDashboardHeader() {
  const config = DASHBOARD_STATE.config;
  const user = DASHBOARD_STATE.user;
  const firstName = (user.name || 'User').split(' ')[0];

  const titleEl = document.getElementById('roleTitle');
  const subtitleEl = document.getElementById('roleSubtitle');
  const welcomeEl = document.getElementById('roleWelcome');
  const userEl = document.getElementById('roleUserName');
  const actionsEl = document.getElementById('roleActions');
  const listingsSection = document.getElementById('listingsSection');

  if (titleEl) titleEl.textContent = config.title;
  if (subtitleEl) subtitleEl.textContent = config.subtitle;
  if (welcomeEl) welcomeEl.textContent = `${config.welcome} Hello, ${firstName}.`;
  if (userEl) userEl.textContent = user.name || 'KrishiSetu User';

  if (listingsSection) {
    listingsSection.style.display = config.showListings ? 'block' : 'none';
  }

  if (actionsEl) {
    // Filter actions based on permissions
    const allowedActions = config.quickActions.filter(action => {
      if (!action.permission) return true; // No permission requirement
      return hasPermission(action.permission);
    });

    actionsEl.innerHTML = allowedActions
      .map((action) => `<button class="role-action-item" data-action="${action.key}">${action.label}</button>`)
      .join('');
  }
}

function renderStatsCards(statsItems) {
  const statsEl = document.getElementById('statsGrid');
  if (!statsEl) return;

  statsEl.innerHTML = statsItems
    .map((item) => `
      <div class="stat-card">
        <div class="stat-label">${item.label}</div>
        <div class="stat-value">${item.value}</div>
      </div>
    `)
    .join('');
}

async function loadStats() {
  try {
    if (DASHBOARD_STATE.config.orderView === 'seller') {
      const result = await apiFetch('/dashboard/stats');
      if (!result) return;
      const stats = result.stats || {};
      renderStatsCards([
        { label: 'Monthly Revenue', value: formatCurrency(stats.monthly_revenue) },
        { label: 'Active Listings', value: Number(stats.active_listings || 0).toLocaleString('en-IN') },
        { label: 'Pending Orders', value: Number(stats.pending_orders || 0).toLocaleString('en-IN') },
        { label: 'Total Revenue', value: formatCurrency(stats.total_revenue) }
      ]);
    } else {
      // Buyer view - use new dashboard/stats endpoint which returns buyer stats
      const result = await apiFetch('/dashboard/stats');
      if (!result) return;
      const stats = result.stats || {};
      renderStatsCards([
        { label: 'Total Orders', value: Number(stats.total_purchases || 0).toLocaleString('en-IN') },
        { label: 'Pending Deliveries', value: Number(stats.pending_deliveries || 0).toLocaleString('en-IN') },
        { label: 'Delivered Orders', value: Number(stats.delivered_orders || 0).toLocaleString('en-IN') },
        { label: 'Total Spend', value: formatCurrency(stats.total_spent) }
      ]);
    }
  } catch (error) {
    notify(error.message || 'Failed to load stats', 'error');
  }
}

function renderListings(listings) {
  const listEl = document.getElementById('listingsList');
  if (!listEl) return;

  if (!listings.length) {
    listEl.innerHTML = '<div class="empty-text">No listings yet. Add your first listing.</div>';
    return;
  }

  const canEdit = hasPermission('canEditProduct');
  const canDelete = hasPermission('canDeleteProduct');

  listEl.innerHTML = listings
    .map((item) => `
      <div class="item-row">
        <div>
          <div class="item-title">${item.title}</div>
          <div class="item-meta">${item.quantity} ${item.unit} | ${item.category || 'General'}</div>
        </div>
        <div class="item-side">
          <div class="item-price">${formatCurrency(item.price)}</div>
          <div class="item-actions">
            ${canEdit ? `<button class="mini-btn" data-edit-listing="${item.id}">Edit</button>` : ''}
            ${canDelete ? `<button class="mini-btn danger" data-delete-listing="${item.id}">Delete</button>` : ''}
          </div>
        </div>
      </div>
    `)
    .join('');
}

async function loadListings() {
  if (!DASHBOARD_STATE.config.showListings) return;
  try {
    const result = await apiFetch('/dashboard/listings');
    if (!result) return;
    DASHBOARD_STATE.listings = result.listings || [];
    renderListings(DASHBOARD_STATE.listings);
  } catch (error) {
    notify(error.message || 'Failed to load listings', 'error');
  }
}

function renderOrders(orders) {
  const listEl = document.getElementById('ordersList');
  if (!listEl) return;

  if (!orders.length) {
    listEl.innerHTML = '<div class="empty-text">No orders available.</div>';
    return;
  }

  const canUpdate = hasPermission('canUpdateOrderStatus');

  listEl.innerHTML = orders
    .map((order) => `
      <div class="item-row">
        <div>
          <div class="item-title">${order.product_name}</div>
          <div class="item-meta">Qty: ${order.quantity} ${order.product_unit || ''} | ${order.other_party || order.buyer_name || 'User'}</div>
        </div>
        <div class="item-side">
          <div class="item-price">${formatCurrency(order.total_price)}</div>
          <div class="item-meta">${statusBadge(order.status)}</div>
          ${canUpdate && !['delivered', 'cancelled'].includes(order.status)
            ? `<div class="item-actions"><button class="mini-btn" data-next-status="${order.id}">Advance Status</button></div>`
            : ''}
        </div>
      </div>
    `)
    .join('');
}

async function loadOrders() {
  try {
    // Role is now determined by backend from JWT, no need to pass role parameter
    const result = await apiFetch('/orders/');
    if (!result) return;
    DASHBOARD_STATE.orders = result.orders || [];
    renderOrders(DASHBOARD_STATE.orders);
  } catch (error) {
    notify(error.message || 'Failed to load orders', 'error');
  }
}

function renderMarketProducts(products) {
  const listEl = document.getElementById('marketList');
  if (!listEl) return;

  if (!products.length) {
    listEl.innerHTML = '<div class="empty-text">No products found in marketplace.</div>';
    return;
  }

  listEl.innerHTML = products
    .slice(0, 8)
    .map((item) => `
      <div class="market-card">
        <div class="item-title">${item.title}</div>
        <div class="item-meta">${item.category} | ${item.quantity} ${item.unit} available</div>
        <div class="market-foot">
          <span class="item-price">${formatCurrency(item.price)} / ${item.unit}</span>
          <div class="buy-box">
            <input type="number" min="1" step="1" value="1" data-buy-qty="${item.id}" />
            <button class="mini-btn" data-buy-product="${item.id}">Buy</button>
          </div>
        </div>
      </div>
    `)
    .join('');
}

async function loadMarketplaceProducts() {
  try {
    const result = await apiFetch('/marketplace/products', {}, false);
    if (!result) return;
    renderMarketProducts(result.products || []);
  } catch (error) {
    notify(error.message || 'Failed to load marketplace products', 'error');
  }
}

function openListingModal(listingId) {
  const modal = document.getElementById('listingModal');
  const form = document.getElementById('listingForm');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('listingId').value = '';

  if (listingId) {
    const listing = DASHBOARD_STATE.listings.find((item) => item.id === listingId);
    if (listing) {
      document.getElementById('listingId').value = listing.id;
      document.getElementById('listingTitle').value = listing.title || '';
      document.getElementById('listingCategory').value = listing.category || '';
      document.getElementById('listingDescription').value = listing.description || '';
      document.getElementById('listingPrice').value = listing.price || '';
      document.getElementById('listingQuantity').value = listing.quantity || '';
      document.getElementById('listingUnit').value = listing.unit || 'kg';
    }
  }

  modal.classList.add('active');
}

function closeListingModal() {
  const modal = document.getElementById('listingModal');
  if (modal) modal.classList.remove('active');
}

async function saveListing(event) {
  event.preventDefault();

  // Check permission
  const listingId = document.getElementById('listingId').value;
  const isEdit = !!listingId;

  if (isEdit && !hasPermission('canEditProduct')) {
    notify('You do not have permission to edit listings', 'error');
    return;
  }

  if (!isEdit && !hasPermission('canCreateProduct')) {
    notify('You do not have permission to create listings', 'error');
    return;
  }

  const payload = {
    title: document.getElementById('listingTitle').value.trim(),
    category: document.getElementById('listingCategory').value,
    description: document.getElementById('listingDescription').value.trim(),
    price: Number(document.getElementById('listingPrice').value),
    quantity: Number(document.getElementById('listingQuantity').value),
    unit: document.getElementById('listingUnit').value
  };

  if (!payload.title || !payload.category || !payload.description || !payload.price || !payload.quantity || !payload.unit) {
    notify('Please fill all listing fields', 'error');
    return;
  }

  try {
    if (listingId) {
      await apiFetch(`/marketplace/products/${listingId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      notify('Listing updated', 'success');
    } else {
      await apiFetch('/marketplace/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      notify('Listing created', 'success');
    }

    closeListingModal();
    await Promise.all([loadListings(), loadStats(), loadMarketplaceProducts()]);
  } catch (error) {
    notify(error.message || 'Failed to save listing', 'error');
  }
}

async function deleteListing(listingId) {
  // Check permission
  if (!hasPermission('canDeleteProduct')) {
    notify('You do not have permission to delete listings', 'error');
    return;
  }

  if (!confirm('Delete this listing?')) return;

  try {
    await apiFetch(`/marketplace/products/${listingId}`, { method: 'DELETE' });
    notify('Listing deleted', 'success');
    await Promise.all([loadListings(), loadStats(), loadMarketplaceProducts()]);
  } catch (error) {
    notify(error.message || 'Failed to delete listing', 'error');
  }
}

async function advanceOrderStatus(orderId) {
  // Check permission
  if (!hasPermission('canUpdateOrderStatus')) {
    notify('You do not have permission to update order status', 'error');
    return;
  }

  const order = DASHBOARD_STATE.orders.find((item) => item.id === orderId);
  if (!order) return;

  const flow = {
    pending: 'processing',
    processing: 'in_transit',
    in_transit: 'delivered'
  };

  const nextStatus = flow[order.status];
  if (!nextStatus) {
    notify('No further status update for this order', 'info');
    return;
  }

  try {
    await apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: nextStatus })
    });
    notify(`Order moved to ${nextStatus.replace('_', ' ')}`, 'success');
    await Promise.all([loadOrders(), loadStats()]);
  } catch (error) {
    notify(error.message || 'Failed to update order', 'error');
  }
}

async function buyProduct(productId) {
  // Check permission - only consumers/buyers can purchase
  if (!hasPermission('canBrowseMarketplace')) {
    notify('You do not have permission to buy products', 'error');
    return;
  }

  const qtyInput = document.querySelector(`[data-buy-qty="${productId}"]`);
  const quantity = Number(qtyInput ? qtyInput.value : 1);

  if (!quantity || quantity <= 0) {
    notify('Enter a valid quantity', 'error');
    return;
  }

  try {
    await apiFetch('/orders/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity })
    });
    notify('Order placed successfully', 'success');
    await Promise.all([loadOrders(), loadStats(), loadMarketplaceProducts(), loadListings()]);
  } catch (error) {
    notify(error.message || 'Failed to place order', 'error');
  }
}

function handleQuickAction(actionKey) {
  // Check permissions before executing action
  if (actionKey === 'add-listing') {
    if (!hasPermission('canCreateProduct')) {
      notify('You do not have permission to create listings', 'error');
      return;
    }
    openListingModal();
    return;
  }

  if (actionKey === 'refresh-data') {
    loadAllData();
    return;
  }

  if (actionKey === 'go-marketplace') {
    if (!hasPermission('canBrowseMarketplace')) {
      notify('You do not have permission to browse marketplace', 'error');
      return;
    }
    window.location.href = 'marketplace.html';
    return;
  }

  if (actionKey === 'go-profile') {
    window.location.href = 'profile.html';
  }
}

function attachEvents() {
  // Remove old listeners by cloning and replacing
  const actionsEl = document.getElementById('roleActions');
  if (actionsEl) {
    const newActionsEl = actionsEl.cloneNode(false);
    actionsEl.parentNode.replaceChild(newActionsEl, actionsEl);
    
    setTimeout(() => {
      const actionsBtns = document.getElementById('roleActions');
      if (actionsBtns) {
        actionsBtns.addEventListener('click', (event) => {
          const button = event.target.closest('button[data-action]');
          if (!button) return;
          const action = button.getAttribute('data-action');
          handleQuickAction(action);
        });
      }
    }, 10);
  }

  const listingsEl = document.getElementById('listingsList');
  if (listingsEl) {
    listingsEl.addEventListener('click', (event) => {
      const editBtn = event.target.closest('[data-edit-listing]');
      const delBtn = event.target.closest('[data-delete-listing]');
      if (editBtn) openListingModal(editBtn.dataset.editListing);
      if (delBtn) deleteListing(delBtn.dataset.deleteListing);
    });
  }

  const ordersEl = document.getElementById('ordersList');
  if (ordersEl) {
    ordersEl.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-next-status]');
      if (btn) advanceOrderStatus(btn.dataset.nextStatus);
    });
  }

  const marketEl = document.getElementById('marketList');
  if (marketEl) {
    marketEl.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-buy-product]');
      if (btn) buyProduct(btn.dataset.buyProduct);
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', loadAllData);
  
  const addBtn = document.getElementById('addListingBtn');
  if (addBtn) addBtn.addEventListener('click', () => openListingModal());
  
  const closeModalBtn = document.getElementById('closeListingModal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeListingModal);
  
  const listingForm = document.getElementById('listingForm');
  if (listingForm) listingForm.addEventListener('submit', saveListing);
}

function renderRoleSpecificSection(role) {
  const sectionEl = document.getElementById('roleSpecificSection');
  if (!sectionEl) return;

  const roleSpecific = {
    farmer: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">🌾 Farmer's Hub</div>
        <div class="quick-facts">
          <div class="fact-item"><strong>Best Selling:</strong> <span id="bestSelling">-</span></div>
          <div class="fact-item"><strong>Avg Rating:</strong> <span id="avgRating">-</span></div>
          <div class="fact-item"><strong>New Leads:</strong> <span id="newLeads">0</span></div>
        </div>
      </section>
    `,
    fpo: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">👥 FPO Operations</div>
        <div class="quick-facts">
          <div class="fact-item"><strong>Members:</strong> <span id="memberCount">-</span></div>
          <div class="fact-item"><strong>Bulk Orders:</strong> <span id="bulkOrders">0</span></div>
          <div class="fact-item"><strong>Aggregation %:</strong> <span id="aggregationPct">0%</span></div>
        </div>
      </section>
    `,
    shg: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">👩👨 SHG Dashboard</div>
        <div class="quick-facts">
          <div class="fact-item"><strong>Group Revenue:</strong> <span id="groupRevenue">Rs 0</span></div>
          <div class="fact-item"><strong>Products Sold:</strong> <span id="productsSold">0</span></div>
          <div class="fact-item"><strong>Member Earnings:</strong> <span id="memberEarnings">Rs 0</span></div>
        </div>
      </section>
    `,
    processor: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">🏭 Processor Insights</div>
        <div class="quick-facts">
          <div class="fact-item"><strong>Raw Material Needed:</strong> <span id="rawmaterialNeeded">-</span></div>
          <div class="fact-item"><strong>Production Capacity:</strong> <span id="productionCapacity">-</span></div>
          <div class="fact-item"><strong>Lead Time:</strong> <span id="leadTime">-</span></div>
        </div>
      </section>
    `,
    consumer: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">❤️ My Favorites</div>
        <div id="favoritesContent" class="empty-text">No favorites saved yet. Add items while browsing.</div>
      </section>
    `,
    startup: `
      <section class="section-card" style="grid-column:1 / -1;">
        <div class="section-title">🚀 Startup Insights</div>
        <div class="quick-facts">
          <div class="fact-item"><strong>Market Gap:</strong> <span id="marketGap">-</span></div>
          <div class="fact-item"><strong>Potential Partners:</strong> <span id="potentialPartners">0</span></div>
          <div class="fact-item"><strong>Idea Stage:</strong> <span id="ideaStage">Validation</span></div>
        </div>
      </section>
    `
  };

  sectionEl.innerHTML = roleSpecific[role] || '';
}

async function loadAllData() {
  await Promise.all([loadStats(), loadListings(), loadOrders(), loadMarketplaceProducts()]);
  renderRoleSpecificSection(DASHBOARD_STATE.role);
}

function initRoleDashboard() {
  if (!window.KrishiAuth || !window.KrishiAuth.protectPage()) {
    return;
  }

  const expectedRole = (document.body.dataset.role || '').toLowerCase();
  const user = window.KrishiAuth.getUserData() || {};
  const actualRole = (user.role || '').toLowerCase();

  if (expectedRole && actualRole && expectedRole !== actualRole) {
    window.location.href = window.KrishiAuth.getRoleDashboardPath(actualRole);
    return;
  }

  DASHBOARD_STATE.role = expectedRole || actualRole || 'farmer';
  DASHBOARD_STATE.config = ROLE_CONFIG[DASHBOARD_STATE.role] || ROLE_CONFIG.farmer;
  DASHBOARD_STATE.user = user || getUserDataSafe();

  const profileLink = document.getElementById('profileLink');
  if (profileLink) profileLink.href = 'profile.html';

  renderDashboardHeader();
  attachEvents();
  loadAllData();
}

document.addEventListener('DOMContentLoaded', initRoleDashboard);
