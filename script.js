document.addEventListener('DOMContentLoaded', () => {
    // Handle quantity changes
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.minus-btn');
        const plusBtn = selector.querySelector('.plus-btn');
        const quantityInput = selector.querySelector('.quantity-input');

        // Decrease quantity but not below 1
        minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });

        // Increase quantity
        plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            quantityInput.value = quantity + 1;
        });

        // Prevent manual input of negative or non-numeric values
        quantityInput.addEventListener('input', () => {
            if (quantityInput.value === '' || parseInt(quantityInput.value) < 1) {
                quantityInput.value = 1;
            }
        });
    });

    // Handle "Add to Cart" button click
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const itemName = this.getAttribute('data-item');
            const itemPrice = parseFloat(this.getAttribute('data-price'));
            const quantity = parseInt(this.closest('.card-body').querySelector('.quantity-input').value);

            addToCart(itemName, itemPrice, quantity);
            alert(`${itemName} (x${quantity}) has been added to your cart!`);
        });
    });

    // Load cart items dynamically on cart.html
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    // Update cart count on page load
    updateCartCount();

    // Add event listener for apply discount button
 
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count when the page loads
    updateCartCount();

    // Add event listener for apply discount button
    document.getElementById('apply-discount').addEventListener('click', () => {
        const enteredCode = document.getElementById('discount-code').value.trim();
        const storedCode = localStorage.getItem('discountCode');

        if (!storedCode) {
            alert("No discount code available. Please spin the wheel to get a code.");
            return;
        }

        // Check if the entered code matches the stored code
        if (enteredCode === storedCode) {
            alert("Discount applied!");
            applyDiscount(); // Call function to apply discount
        } else {
            alert("Invalid discount code.");
        }
    });
    
});

// Function to apply the discount
function applyDiscount() {
    const total = getCurrentTotal(); // Get the current total amount
    const discountAmount = parseDiscountCode(localStorage.getItem('discountCode')); // Get the discount percentage or amount

    // Calculate the new total
    const newTotal = total - (total * (discountAmount / 100));
    updateCartTotal(newTotal);
    document.getElementById('total-amount').innerText = `Total: $${newTotal.toFixed(2)}`; // Assuming you have an element to display total
}

// Parse the discount code to get the discount percentage
function parseDiscountCode(code) {
    const match = code.match(/(\d+)%OFF/);  // Adjust if your code format changes
    return match ? parseFloat(match[1]) : 0; // Return the discount percentage
}

// Example function to get the current total
function getCurrentTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Example function to update the cart total display
function updateCartTotal(newTotal) {
    localStorage.setItem('total', newTotal);
    document.getElementById('cart-total').innerText = `Total: $${newTotal.toFixed(2)}`; // Assuming you have a cart total display element
}

// Update cart count badge in the navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');

    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}


    // Check if user is signed in for account display
    const username = localStorage.getItem("username");
    const accountLink = document.getElementById("accountLink");
    const logoutLink = document.getElementById("logoutLink");

    // If the user is signed in, show "Hello, [username]" and display the "Log out" link
    if (username) {
        accountLink.innerHTML = `<i class="bi bi-person"></i> Hello, ${username}`;
        logoutLink.style.display = 'inline-block';
    } else {
        // If no user is signed in, show "No account"
        accountLink.innerHTML = `<i class="bi bi-person"></i> No account`;
        logoutLink.style.display = 'none';
    }
});

// Add item to cart and update localStorage
function addToCart(itemName, itemPrice, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += quantity; // Increase quantity if item exists
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function removeItem(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== itemName); // Remove the item by name

    // Update local storage and refresh the cart display
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Reload the cart display to reflect the changes
    updateCartCount(); // Update the cart count in the navbar
}

// Update cart count badge in the navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');

    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    let total = 0;

    // Check if the user has signed up for the discount
    const isSignedUp = localStorage.getItem('isSignedUp') === 'true';
    const discountRate = isSignedUp ? 0.10 : 0;

    cartItemsDiv.innerHTML = ''; // Clear previous content

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('total-price').innerText = 'Total: $0.00';
        document.getElementById('discountMessage').innerText = ''; // Clear discount message
        updateCartCount();
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItemsDiv.innerHTML += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Price: $${item.price.toFixed(2)}</p>
                        <p class="card-text"><small class="text-muted">Quantity: ${item.quantity}</small></p>
                        <p class="card-text">Total: $${itemTotal.toFixed(2)}</p>
                        <button class="btn btn-danger" onclick="removeItem('${item.name}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Apply the discount if the user has signed up
    const discount = total * discountRate;
    const finalTotal = total - discount;

    document.getElementById('total-price').innerText = 
        `Total: $${finalTotal.toFixed(2)} (Discount: $${discount.toFixed(2)})`;

    // Update discount message
    if (isSignedUp) {
        document.getElementById('discountMessage').innerText = "You've received a 10% discount for being a registered user!";
    } else {
        document.getElementById('discountMessage').innerText = "Sign up to receive a 10% discount on your first order!";
    }

    updateCartCount();
}


// Sign Up function
function signUp() {
    const name = document.getElementById("signupName").value;
    
    // Store the username and sign-up status in local storage
    localStorage.setItem("username", name);
    localStorage.setItem("isSignedUp", "true");  // Set discount eligibility

    // Show an alert box with a success message
    alert("You have successfully created a new account!");
}

// Sign In function
function signIn() {
    const email = document.getElementById('signinEmail').value;
    const storedName = localStorage.getItem('username');

    if (storedName) {
        // If user is found, update the navbar and redirect to home page
        showAccount(storedName);
        localStorage.setItem('isRegistered', 'true'); // Set registered status
        window.location.href = "index.html"; // Redirect to home page
    } else {
        alert("Account not found. Please sign up.");
    }
}

// Function to display the user's name in the navbar and show the logout link
function showAccount(name) {
    const accountLink = document.getElementById("accountLink");
    const logoutLink = document.getElementById("logoutLink");

    accountLink.innerHTML = `<i class="bi bi-person"></i> Hello, ${name}`;
    logoutLink.style.display = 'inline-block';
}

// Log Out function
function logOut() {
  
    localStorage.clear(); // Remove username from storage
    
    alert("You have logged out"); // Show the message box
    window.location.href = "signin.html"; // Redirect to sign-in page after logout
}

// Handle search input for menu
document.getElementById('menuSearch').addEventListener('input', function () {
    let filter = this.value.toLowerCase();
    let menuItems = document.querySelectorAll('.col-md-4'); // Assuming each item is in a col-md-4 div

    menuItems.forEach(item => {
        let title = item.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(filter)) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items to avoid gaps
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const username = localStorage.getItem("username");
    const accountLink = document.getElementById("accountLink");
    const logoutLink = document.getElementById("logoutLink");

    // If the user is signed in, show "Hello, [username]" and display the "Log out" link
    if (username) {
        accountLink.innerHTML = `<i class="bi bi-person"></i> Hello, ${username}`;
        accountLink.href = "index.html"; // Redirect to home on click
        logoutLink.style.display = 'inline-block'; // Show the logout link
    } else {
        // If no user is signed in, show "No account"
        accountLink.innerHTML = `<i class="bi bi-person"></i> No account`;
        logoutLink.style.display = 'none'; // Hide the logout link
    }
});
