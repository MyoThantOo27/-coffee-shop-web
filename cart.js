// Display cart items
function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item", "mb-3");
        cartItem.innerHTML = `
            <div class="d-flex align-items-center">
                <div>
                    <h5>${item.name}</h5>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="btn btn-danger ml-3" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalContainer.innerText = `Total: $${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// Clear cart
function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
}

// Apply discount to the total price
function applyDiscount(discountPercent) {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) return;

    let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = (total * discountPercent) / 100;
    total -= discount;

    // Save the discounted total in localStorage
    localStorage.setItem("discountedTotal", total.toFixed(2));

    // Update the cart total display
    const cartTotalContainer = document.getElementById("cartTotal");
    cartTotalContainer.innerText = `Total: $${total.toFixed(2)}`;

    // Inform the user about the new total
    alert(`Your new total after ${discountPercent}% discount is: $${total.toFixed(2)}`);
}

// Initialize page components
document.addEventListener("DOMContentLoaded", function () {
    const spinButton = document.querySelector(".btn-primary[data-bs-toggle='modal']");

    // Check localStorage to determine if the button should be shown
    const spinUsed = localStorage.getItem("spinUsed");

    if (spinUsed === "true") {
        spinButton.style.display = "none"; // Hide the button if the user has already spun the wheel
    } else {
        spinButton.style.display = "block";
    }

    // Draw the wheel and display the cart
    alert("You must one time for the discount spin!");
    drawWheel();
    displayCart();
});

// Spin the wheel
let spinning = false;

function spinWheel() {
    
    if (spinning) return; // Prevent multiple spins
    spinning = true;

    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const wheelSegments = ["5% OFF", "10% OFF", "15% OFF", "Free Shipping", "20% OFF", "No Discount!"];
    const segmentAngle = (2 * Math.PI) / wheelSegments.length;

    let currentAngle = 0;
    let spinAngle = Math.random() * 360 + 720; // Random spin (720 = 2 full spins)

    const spinInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        currentAngle += 10; // Spin speed
        if (currentAngle >= spinAngle) {
            clearInterval(spinInterval);
            spinning = false;

            // Calculate the winning segment
            const normalizedAngle = currentAngle % 360; // Angle in 0-360 degrees
            const segmentIndex = Math.floor((360 - normalizedAngle) / (360 / wheelSegments.length)) % wheelSegments.length;

            // Display the result
            const result = wheelSegments[segmentIndex];
            document.getElementById("discountMessage").innerText = `Congratulations! You get: ${result}`;

            // Apply discount if applicable
            if (result.includes("% OFF")) {
                const discountPercent = parseInt(result);
                applyDiscount(discountPercent);
            }

            alert(`You spun the wheel and got: ${result}`);

            // Mark spin as used
            localStorage.setItem("spinUsed", "true");

            // Hide the spin button immediately
            const spinButton = document.querySelector(".btn-primary[data-bs-toggle='modal']");
            if (spinButton) spinButton.style.display = "none";
        }

        // Draw the wheel
        drawWheelWithRotation(ctx, centerX, centerY, segmentAngle, wheelSegments, currentAngle);
    }, 20); // Redraw every 20ms
}

function closeSpinWheel() {
    document.getElementById("spinWheelSection").style.display = "none";
}

// Helper function to draw the wheel with rotation
function drawWheelWithRotation(ctx, centerX, centerY, segmentAngle, wheelSegments, currentAngle) {
    let angle = currentAngle;
    const radius = centerX; // Assuming the canvas is square

    wheelSegments.forEach((segment, index) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + segmentAngle, false);
        ctx.closePath();

        // Alternate colors for the wheel
        ctx.fillStyle = index % 2 === 0 ? "#ffcccb" : "#ffe4b5";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText(segment, radius - 10, 0);
        ctx.restore();

        angle += segmentAngle;
    });
}

// Draw the initial wheel when the page loads
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2; // Assuming canvas is square
    const wheelSegments = ["5% OFF", "10% OFF", "15% OFF", "18% OFF", "20% OFF", "No Discount!"];
    const segmentAngle = (2 * Math.PI) / wheelSegments.length;

    drawWheelWithRotation(ctx, centerX, centerY, segmentAngle, wheelSegments, 0);
}

function proceedToPayment() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
        alert("Your cart is empty. Add items to proceed to payment.");
        return;
    }

    // Get the total price, prioritize the discounted total if it exists
    const discountedTotal = localStorage.getItem("discountedTotal");
    const total = discountedTotal ? 
    parseFloat(discountedTotal) : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const confirmation = confirm(`Your total is $${total.toFixed(2)}. Do you want to proceed to payment?`);

    if (confirmation) {
        alert("Thank you for your purchase!");

        // Clear the cart and the discounted total
        localStorage.removeItem("cart");
        localStorage.removeItem("discountedTotal");

        // Redirect to Thank You page
        window.location.href = "1.html";
    }
}