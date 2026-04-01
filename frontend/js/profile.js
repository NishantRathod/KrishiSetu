const API_BASE_URL = 'http://localhost:5000/api';

function formatRole(role) {
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '';
  }
}

function updateDashboardLinks(role) {
  const dashboardPath = window.KrishiAuth?.getRoleDashboardPath
    ? window.KrishiAuth.getRoleDashboardPath(role)
    : 'dashboard-farmer.html';

  const headerDashboardLink = document.getElementById('profileDashboardLink');
  const backDashboardLink = document.getElementById('profileBackDashboardLink');

  if (headerDashboardLink) headerDashboardLink.href = dashboardPath;
  if (backDashboardLink) backDashboardLink.href = dashboardPath;
}

async function loadProfile() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'auth.html';
        return;
      }

      window.KrishiAuth?.showNotification(data.error || 'Unable to load profile', 'error');
      return;
    }

    const profile = data.profile || {};
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profilePhone').value = profile.phone || '';
    document.getElementById('profileEmail').textContent = profile.email || '-';
    document.getElementById('profileRole').textContent = formatRole(profile.role);
    updateDashboardLinks(profile.role);

    const joinedOn = formatDate(profile.created_at);
    document.getElementById('profileMeta').textContent = joinedOn ? `Joined on ${joinedOn}` : '';

    localStorage.setItem('userData', JSON.stringify({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      phone: profile.phone
    }));
  } catch (error) {
    console.error('Profile load error:', error);
    window.KrishiAuth?.showNotification('Connection error while loading profile', 'error');
  }
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  const token = localStorage.getItem('authToken');
  const saveBtn = document.getElementById('saveBtn');
  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();

  if (!name) {
    window.KrishiAuth?.showNotification('Name is required', 'error');
    return;
  }

  const originalText = saveBtn.textContent;

  try {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone })
    });

    const data = await response.json();

    if (!response.ok) {
      window.KrishiAuth?.showNotification(data.error || 'Profile update failed', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    localStorage.setItem('userData', JSON.stringify({
      ...currentUser,
      name,
      phone
    }));

    window.KrishiAuth?.showNotification('Profile updated successfully', 'success');
    saveBtn.textContent = '✓ Saved';

    setTimeout(() => {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }, 1200);
  } catch (error) {
    console.error('Profile update error:', error);
    window.KrishiAuth?.showNotification('Connection error while updating profile', 'error');
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cachedUser = JSON.parse(localStorage.getItem('userData') || '{}');
  updateDashboardLinks(cachedUser.role);

  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', handleProfileUpdate);
  }

  loadProfile();
});