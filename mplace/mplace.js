import { products, categories } from './mockData.js';

// State management
let cartItems = [];
let filteredProducts = [...products];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const checkoutBtn = document.getElementById('checkoutBtn');
const productTemplate = document.getElementById('productTemplate');

// Initialize the page
function init() {
    populateCategories();
    renderProducts(products);
    setupEventListeners();
}

// Populate category filter
function populateCategories() {
    categories.forEach(category => {
        if (category.id !== 'all') {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        }
    });
}

// Render products in the grid
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = productTemplate.content.cloneNode(true);
        
        const img = productCard.querySelector('img');
        img.src = product.image;
        img.alt = product.title;
        
        productCard.querySelector('.product-title').textContent = product.title;
        productCard.querySelector('.seller-name').textContent = product.seller;
        productCard.querySelector('.description').textContent = product.description;
        productCard.querySelector('.product-price').textContent = `₹${product.price.toLocaleString()}`;
        
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => addToCart(product));
        
        productGrid.appendChild(productCard);
    });
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm) ||
                            product.seller.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    renderProducts(filteredProducts);
}

// Shopping Cart Functions
function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    
    updateCart();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, newQuantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart items display
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex justify-between items-center py-4';
        cartItem.innerHTML = `
            <div class="flex-1">
                <h3 class="font-medium">${item.title}</h3>
                <p class="text-sm text-gray-600">₹${item.price.toLocaleString()} × ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
                <button class="btn btn-xs btn-circle" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-xs btn-circle" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="btn btn-xs btn-circle btn-error" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString()}`;
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert('Thank you for your purchase! This is a demo checkout.');
        } else {
            alert('Your cart is empty!');
        }
    });
}

// Make functions available globally
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

// Initialize the page
document.addEventListener('DOMContentLoaded', init);
