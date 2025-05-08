document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Cargar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mostrar/ocultar modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });
    
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Función para agregar producto al carrito
    function addToCart(productName, price, imageUrl) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: price,
                image: imageUrl,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCounter();
    }
    
    // Función para eliminar producto del carrito
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCounter();
        updateCartDisplay();
    }
    
    // Función para guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Función para actualizar el contador del carrito
    function updateCartCounter() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
            cartTotal.textContent = '0';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                removeFromCart(parseInt(e.target.dataset.index));
            });
        });
    }
    
    // Botón de finalizar compra
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Crear descripción de los productos para PayPal
    const itemDescription = cart.map(item => 
        `${item.name} (x${item.quantity})`
    ).join(', ');

    // Calcular el total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Redirigir a PayPal con los parámetros necesarios
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=}enriqueestradaf34@gmail.com&item_name=${encodeURIComponent(itemDescription)}&amount=${total.toFixed(2)}&currency_code=MXN&no_note=1&lc=MX`;
    
    window.location.href = paypalUrl;
});
    
    // Inicializar el contador del carrito
    updateCartCounter();
    
    // Hacer la función addToCart disponible globalmente
    window.addToCart = addToCart;
});