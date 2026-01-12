AOS.init();

// Cart array stored in memory
let cart = [];

// User state
let currentUser = null;

// Products database
const products = [
  { name: 'Elegant Diamond Bangles', price: 1250, image: 'IMAGES/Bangles.PNG' },
  { name: 'Islamic Calligraphy', price: 1150, image: 'IMAGES/Calligraphy.webp' },
  { name: 'Regal Diamond Set', price: 2450, image: 'IMAGES/Necklace.jpg' },
  { name: 'Midnight Elegance Set', price: 1850, image: 'IMAGES/Nose Rings.webp' },
  { name: 'Graceful Steps Bangles', price: 980, image: 'IMAGES/Anklets.webp' },
  { name: 'Diamond Bracelets', price: 1350, image: 'IMAGES/Bracelets.webp' }
];

// Add to cart function
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  updateCart();
  showNotification('Item added to cart!');
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Update cart display
function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotal = document.getElementById('cartTotal');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-bag-x"></i>
        <h5>Your cart is empty</h5>
        <p>Add some jewelry to get started!</p>
      </div>
    `;
    cartTotal.style.display = 'none';
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item d-flex align-items-center">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toLocaleString()}</div>
          <div class="text-muted" style="font-size: 0.9rem;">Qty: ${item.quantity}</div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `$${subtotal.toLocaleString()}`;
    cartTotal.style.display = 'block';
  }
}

// Open cart
function openCart() {
  const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
  cartOffcanvas.show();
}

// Show notification
function showNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 p-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-body bg-success text-white rounded">
        <i class="bi bi-check-circle me-2"></i>${message}
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Login functionality
function openLogin() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLogin() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.remove('active');
  document.getElementById('loginForm').reset();
  document.body.style.overflow = 'auto';
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('bi-eye');
    eyeIcon.classList.add('bi-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('bi-eye-slash');
    eyeIcon.classList.add('bi-eye');
  }
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simulate login (in real app, this would be an API call)
  if (email && password) {
    const name = email.split('@')[0];
    currentUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email
    };
    
    updateUserUI();
    closeLogin();
    showNotification(`Welcome back, ${currentUser.name}!`);
  }
}

function updateUserUI() {
  const loginIcon = document.getElementById('loginIcon');
  const userProfile = document.getElementById('userProfile');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  if (currentUser) {
    loginIcon.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  } else {
    loginIcon.style.display = 'block';
    userProfile.style.display = 'none';
  }
}

function toggleProfileMenu() {
  const options = ['View Profile', 'My Orders', 'Wishlist', 'Settings', 'Logout'];
  
  // Create dropdown menu
  const existingMenu = document.getElementById('profileDropdown');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.id = 'profileDropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    min-width: 200px;
    z-index: 1000;
    overflow: hidden;
  `;
  
  dropdown.innerHTML = options.map((option, index) => `
    <div onclick="handleProfileOption('${option}')" style="
      padding: 12px 20px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-bottom: ${index < options.length - 1 ? '1px solid #f0f0f0' : 'none'};
      font-size: 1rem;
    " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
      ${option === 'Logout' ? '<i class="bi bi-box-arrow-right me-2"></i>' : ''}${option}
    </div>
  `).join('');
  
  const userProfile = document.getElementById('userProfile');
  userProfile.style.position = 'relative';
  userProfile.appendChild(dropdown);
  
  // Close dropdown when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!userProfile.contains(e.target)) {
        const menu = document.getElementById('profileDropdown');
        if (menu) menu.remove();
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 0);
}

function handleProfileOption(option) {
  const menu = document.getElementById('profileDropdown');
  if (menu) menu.remove();
  
  if (option === 'Logout') {
    currentUser = null;
    updateUserUI();
    showNotification('Logged out successfully!');
  } else {
    showNotification(`${option} - Coming soon!`);
  }
}

function socialLogin(provider) {
  showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login - Coming soon!`);
}

function showSignup(event) {
  event.preventDefault();
  closeLogin();
  showNotification('Sign up feature - Coming soon!');
}

// Search functionality
function openSearch() {
  const searchModal = document.getElementById('searchModal');
  searchModal.classList.add('active');
  document.getElementById('searchInput').focus();
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  const searchModal = document.getElementById('searchModal');
  searchModal.classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.body.style.overflow = 'auto';
}

function selectSearchResult(name, price, image) {
  addToCart(name, price, image);
  closeSearch();
}

// Real-time search
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const searchResults = document.getElementById('searchResults');
      
      if (searchTerm === '') {
        searchResults.innerHTML = '';
        return;
      }
      
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
      );
      
      if (filteredProducts.length === 0) {
        searchResults.innerHTML = `
          <div class="no-results">
            <i class="bi bi-search mb-3" style="font-size: 3rem; display: block;"></i>
            <p>No products found matching "${searchTerm}"</p>
          </div>
        `;
      } else {
        searchResults.innerHTML = filteredProducts.map(product => `
          <div class="search-result-item" onclick="selectSearchResult('${product.name}', ${product.price}, '${product.image}')">
            <img src="${product.image}" alt="${product.name}" class="search-result-image">
            <div class="search-result-details">
              <div class="search-result-title">${product.name}</div>
              <div class="search-result-price">$${product.price.toLocaleString()}</div>
            </div>
            <i class="bi bi-plus-circle" style="font-size: 1.5rem; color: #000;"></i>
          </div>
        `).join('');
      }
    });
    
    document.getElementById('searchModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeSearch();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSearch();
        closeLogin();
      }
    });
  }
  
  // Close login modal when clicking outside
  document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeLogin();
    }
  });
  
  // Initialize
  updateCart();
  updateUserUI();
});