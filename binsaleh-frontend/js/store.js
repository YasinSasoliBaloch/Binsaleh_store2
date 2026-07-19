/**
 * store.js – BIN SALEH Store
 * Shared cart, announcement bar, slider, and collections helpers.
 * Include on EVERY page:  <script src="./js/store.js"></script>
 * Must be loaded AFTER api.js on pages that use api.get().
 */

// ======================== CART (localStorage) ========================
const CART_KEY = 'bs_cart_items';

/** Load cart from localStorage */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch { return []; }
}

/** Save cart to localStorage */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Add item to the shared cart */
function cartAddItem(item) {
  const cart = loadCart();
  // item must have: id, name, price, img, currency
  const idx = cart.findIndex(x => String(x.id) === String(item.id) && x.color === (item.color || ''));
  if (idx > -1) {
    cart[idx].qty = (cart[idx].qty || 1) + (item.qty || 1);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);
  cartUpdateBadge();
  return cart;
}

/** Remove item from cart */
function cartRemoveItem(id, color) {
  let cart = loadCart();
  cart = cart.filter(x => !(String(x.id) === String(id) && (x.color || '') === (color || '')));
  saveCart(cart);
  cartUpdateBadge();
  return cart;
}

/** Update quantity */
function cartSetQty(id, qty, color) {
  const cart = loadCart();
  const idx = cart.findIndex(x => String(x.id) === String(id) && (x.color || '') === (color || ''));
  if (idx > -1) {
    if (qty <= 0) return cartRemoveItem(id, color);
    cart[idx].qty = qty;
    saveCart(cart);
    cartUpdateBadge();
  }
  return cart;
}

/** Get cart count */
function cartCount() {
  return loadCart().reduce((s, x) => s + (x.qty || 1), 0);
}

/** Get cart total */
function cartTotal() {
  return loadCart().reduce((s, x) => s + (x.price || 0) * (x.qty || 1), 0);
}

/** Update the cart badge in the navbar */
function cartUpdateBadge() {
  const badges = document.querySelectorAll('.cart-badge, #cart-count');
  const count = cartCount();
  badges.forEach(el => { if (el) el.textContent = count; });
}

/** Render cart drawer on any page that has the cart drawer HTML */
function cartRenderDrawer() {
  const body = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  if (!body) return;

  const cart = loadCart();
  if (!cart.length) {
    if (emptyEl) { emptyEl.style.display = 'block'; body.innerHTML = ''; body.appendChild(emptyEl); }
    if (totalEl) totalEl.textContent = 'Rs. 0';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (totalEl) totalEl.textContent = 'Rs. ' + cartTotal().toLocaleString();

  body.innerHTML = cart.map((x, i) => `
    <div class="cart-item">
      <img src="${x.img || 'https://dnstore.pk/cdn/shop/collections/A6F9D276-DD01-4A48-A90F-4C075B4DE837.jpg?v=1777718686&width=100'}" alt="${x.name}" onerror="this.style.display='none'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${x.name}${x.color ? ' (' + x.color + ')' : ''} ${x.qty > 1 ? '×' + x.qty : ''}</div>
        <div class="cart-item-price">${x.currency || 'Rs.'} ${((x.price || 0) * (x.qty || 1)).toLocaleString()}</div>
      </div>
      <button class="cart-item-remove" onclick="cartRemoveItem('${x.id}','${x.color || ''}');cartRenderDrawer();event.stopPropagation()"><i class="fas fa-times"></i></button>
    </div>`).join('');
}

// ======================== ANNOUNCEMENT BAR ========================
const ANN_KEY = 'bs_announcement_text';

function getAnnouncementText() {
  try {
    const saved = localStorage.getItem(ANN_KEY);
    if (saved && saved.trim()) return saved;
  } catch {}
  // default fallback
  return '🚚 &nbsp; Free Shipping on Orders Above Rs. 10,000 &nbsp;&nbsp;|&nbsp;&nbsp; 💰 &nbsp; COD Available Nationwide &nbsp;&nbsp;|&nbsp;&nbsp; 🔄 &nbsp; Easy Exchange Policy &nbsp;&nbsp;|&nbsp;&nbsp; ✅ &nbsp; Rs. 250 Advance Required to Confirm Order &nbsp;&nbsp;|&nbsp;&nbsp; ⭐ &nbsp; Summer Élite \'26 Collection is Live!';
}

function applyAnnouncement() {
  const text = getAnnouncementText();
  document.querySelectorAll('.announce-scroll, .announce-text, [id="announce-text"]').forEach(el => {
    el.innerHTML = text;
  });
}

// ======================== HERO SLIDER (localStorage) ========================
const SLIDER_KEY = 'bs_hero_slides';

const DEFAULT_SLIDES = [
  { title: 'Summer<br/><span>Élite</span><br/>\'26', tag: 'New Arrival', sub: 'Elevate your style with our latest premium collection.', link: 'view-all.html', cta: 'Shop Now', img: 'https://dnstore.pk/cdn/shop/files/IMG_7830.jpg?v=1774721492&width=1920' },
  { title: 'Fresh<br/><span>Tops</span><br/>Collection', tag: 'Premium Tops', sub: 'From box-fit to oversized, our tops redefine casual streetwear.', link: 'tops.html', cta: 'Explore Tops', img: 'https://dnstore.pk/cdn/shop/collections/A6F9D276-DD01-4A48-A90F-4C075B4DE837.jpg?v=1777718686&width=1920' },
  { title: 'Match the<br/><span>Vibe</span>', tag: 'Co-Ord Sets', sub: 'Complete co-ord sets and tracksuits for that perfectly curated look.', link: 'tracksuits.html', cta: 'Shop Sets', img: 'https://dnstore.pk/cdn/shop/collections/26993920-13C0-4CA5-92E5-94F20642AFBD.jpg?v=1777718722&width=1920' },
  { title: 'Scent That<br/><span>Speaks</span>', tag: 'Fragrances', sub: 'Exclusive fragrances that leave a lasting impression.', link: 'fragrances.html', cta: 'Discover Now', img: 'https://dnstore.pk/cdn/shop/files/FE0E7953-EE9B-4D22-90AE-692071EBA76A.png?v=1772557488&width=1920' },
  { title: 'Step In<br/><span>Style</span>', tag: 'Footwear', sub: 'Premium footwear collection — from Adidas Samba to exclusive sneakers.', link: 'footwear.html', cta: 'View Shoes', img: 'https://dnstore.pk/cdn/shop/collections/FullSizeRender.jpg?v=1777735717&width=1920' }
];

function getSliderSlides() {
  try {
    const saved = localStorage.getItem(SLIDER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return DEFAULT_SLIDES;
}

function saveSliderSlides(slides) {
  localStorage.setItem(SLIDER_KEY, JSON.stringify(slides));
}

// ======================== COLLECTIONS / SHOWCASE (localStorage) ========================
const COLLECTIONS_KEY = 'bs_collections';

const DEFAULT_COLLECTIONS = [
  { slug: 'tops', name: 'Tops', desc: 'Box-fit, Oversized & More', link: 'tops.html', img: 'https://dnstore.pk/cdn/shop/collections/A6F9D276-DD01-4A48-A90F-4C075B4DE837.jpg?v=1777718686&width=1200' },
  { slug: 'bottoms', name: 'Bottoms', desc: 'Korean Pants, Cargos & More', link: 'bottoms.html', img: 'https://dnstore.pk/cdn/shop/collections/DE08A2DA-3732-4893-B320-98C24C91F24F.jpg?v=1777718865&width=800' },
  { slug: 'tracksuits', name: 'Tracksuits', desc: 'Co-Ord Sets & Matching Suits', link: 'tracksuits.html', img: 'https://dnstore.pk/cdn/shop/collections/26993920-13C0-4CA5-92E5-94F20642AFBD.jpg?v=1777718722&width=800' },
  { slug: 'footwear', name: 'Footwear', desc: 'Sneakers, Trainers & More', link: 'footwear.html', img: 'https://dnstore.pk/cdn/shop/collections/FullSizeRender.jpg?v=1777735717&width=1200' },
  { slug: 'fragrances', name: 'Fragrances', desc: 'Exclusive Signature Scents', link: 'fragrances.html', img: 'https://dnstore.pk/cdn/shop/files/FE0E7953-EE9B-4D22-90AE-692071EBA76A.png?v=1772557488&width=800' },
  { slug: 'accessories', name: 'Accessories', desc: 'Watches, Sunglasses, Bracelets', link: 'accessories.html', img: 'https://dnstore.pk/cdn/shop/collections/IMG-8713.png?v=1777736201&width=800' }
];

function getCollections() {
  try {
    const saved = localStorage.getItem(COLLECTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return DEFAULT_COLLECTIONS;
}

function saveCollections(collections) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

// ======================== CHECKOUT NAVIGATION ========================
/** Redirect to addTocurt.html with the first cart item */
function checkoutFromCart() {
  const cart = loadCart();
  if (!cart.length) {
    if(typeof showToast === 'function') showToast('<i class="fas fa-exclamation-circle"></i> Cart is empty!');
    return;
  }
  // Redirect to the first cart item's product page for checkout
  const firstId = cart[0].id;
  window.location.href = 'addTocurt.html?id=' + firstId;
}

// ======================== UTILITY HELPERS ========================
function safeVal(v, fallback) { return (v !== null && v !== undefined && v !== '') ? v : fallback; }
function safeNum(v, fallback) { const n = Number(v); return isNaN(n) ? fallback : n; }

// ======================== AUTO-INIT ON PAGE LOAD ========================
document.addEventListener('DOMContentLoaded', function() {
  applyAnnouncement();
  cartUpdateBadge();
  cartRenderDrawer();
});
