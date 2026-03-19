/* ============================================================
   KrishiSetu - app.js
   Shared JavaScript for all pages
   ============================================================ */

/* --- Navbar scroll effect --- */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

/* --- Hamburger menu --- */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navActions = document.querySelector('.nav-actions');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    if (navLinks) navLinks.style.display = open ? 'flex' : '';
    if (navActions) navActions.style.display = open ? 'flex' : '';
    if (open && navLinks) {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '68px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'white';
      navLinks.style.padding = '12px 24px';
      navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      navLinks.style.zIndex = '999';
    }
  });
})();

/* --- Active nav link --- */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.includes(href.replace('.html', ''))) {
      a.classList.add('active');
    }
  });
})();

/* --- Scroll reveal (Intersection Observer) --- */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: none; }
    .reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal-left.visible { opacity: 1; transform: none; }
    .reveal-right { opacity: 0; transform: translateX(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal-right.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.feature-card, .stakeholder-card, .product-card, .eco-node, .step-content, .about-point, .dash-stat-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    observer.observe(el);
  });
  document.querySelectorAll('.about-grid > :first-child').forEach(el => {
    el.classList.add('reveal-left'); observer.observe(el);
  });
  document.querySelectorAll('.about-grid > :last-child').forEach(el => {
    el.classList.add('reveal-right'); observer.observe(el);
  });
})();

/* --- Counter animation (stats band) --- */
(function () {
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const val = Math.floor(progress * target);
      el.textContent = val.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    };
    requestAnimationFrame(step);
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
})();

/* --- Auth tabs --- */
(function () {
  const tabs = document.querySelectorAll('.auth-tab');
  if (!tabs.length) return;
  const forms = document.querySelectorAll('.auth-form-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      forms.forEach(f => {
        f.style.display = f.id === target ? 'block' : 'none';
      });
    });
  });
})();

/* --- Range price slider --- */
(function () {
  const slider = document.getElementById('priceRange');
  const display = document.getElementById('priceDisplay');
  if (!slider || !display) return;
  slider.addEventListener('input', () => {
    display.textContent = '₹0 - ₹' + parseInt(slider.value).toLocaleString('en-IN');
  });
})();

/* --- Product add to cart --- */
(function () {
  let cartCount = 0;
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartCount++;
      btn.style.background = 'var(--gold)';
      btn.textContent = '✓';
      setTimeout(() => {
        btn.style.background = '';
        btn.textContent = '+';
      }, 1200);
      const badge = document.getElementById('cartBadge');
      if (badge) { badge.textContent = cartCount; badge.style.display = 'flex'; }
    });
  });
})();

/* --- Sidebar dashboard active item --- */
(function () {
  document.querySelectorAll('.sidebar-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-menu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
})();

/* --- Tooltip on product cards --- */
(function () {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.cursor = 'pointer';
    });
  });
})();

/* --- Animate hero particles --- */
(function () {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const colors = ['rgba(76,175,80,0.3)', 'rgba(249,168,37,0.2)', 'rgba(255,255,255,0.1)', 'rgba(165,214,167,0.3)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${Math.random() * 6 + 6}s;
    `;
    container.appendChild(p);
  }
})();

/* --- Form validation --- */
(function () {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#EF5350';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = '✓ Success!';
          btn.style.background = 'var(--green-light)';
          setTimeout(() => {
            btn.textContent = btn.dataset.original || 'Submit';
            btn.style.background = '';
          }, 2000);
        }
      }
    });
    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('focus', () => { input.style.borderColor = ''; });
    });
  });
})();

/* --- Smooth page transitions --- */
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && href.endsWith('.html')) {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.25s ease';
      setTimeout(() => { window.location.href = href; }, 250);
    });
  }
});
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
});
