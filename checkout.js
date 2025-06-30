let cart = JSON.parse(localStorage.getItem("cart")) || [];

const itemsSection = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("final-total");
const freeBadge = document.getElementById("freeBadge");
const placeOrderBtn = document.getElementById("place-order");


function renderCheckout(){
    itemsSection.innerHTML=""

    const heading = document.createElement("h2");
    heading.textContent = ` Order Summary (${cart.length} items)`;
    heading.classList.add("order-title")
    itemsSection.appendChild(heading);

    cart.forEach(item =>{
        const card=document.createElement("div")
        card.classList.add("checkout-card")

        card.innerHTML=`
        <img src="${item.image}" alt="${item.title}" class="checkout-img" />
        <div class="checkout-info">
            <h4>${item.title}</h4>
            <p>Price: ₹${item.price}</p>
            <p>Amount: ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
            <div class="checkout-actions">
            <button class="checkout-qty" onclick="decQty(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button class="checkout-qty" onclick="incQty(${item.id})">+</button>
            <button class="checkout-remove" onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
        `

        itemsSection.appendChild(card)
    })

    const divider = document.createElement("hr");
    divider.className = "section-divider";
    itemsSection.appendChild(divider);
    
    updateSummary()
}

renderCheckout();

// Qty Buttons
function incQty(id){
    const item = cart.find(p => p.id === id);
    if (item){
        item.quantity+=1;
    }
    
    save();
}

function decQty(id){
    const item = cart.find(p => p.id === id);
    if (item && item.quantity>1){
        item.quantity-=1;
    }
    else{
       cart=cart.filter(item=> item.id !==id)
    }
    save();
}

function removeItem(id){
    cart=cart.filter(item=> item.id !==id)
    save();
}

function updateSummary() {
  let subtotal = 0;
  cart.forEach(item => 
    subtotal += item.price * item.quantity
  );
  let shipping;
  
  if (subtotal === 0 || subtotal >= 500) {
    shipping = 0;
  }
  else {
    shipping = 50;
  }

  subtotalEl.innerText = subtotal;
  shippingEl.innerText = shipping;
  totalEl.innerText = subtotal + shipping;

  if (shipping === 0 && subtotal >= 500) {
    freeBadge.style.display = "block";
  } else {
    freeBadge.style.display = "none";
  }
}

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckout();
}


const form = document.getElementById("shipping-form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all the fields.");
    return;
  }

  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  Swal.fire({
    title: "Order Placed successfully!",
    html: `<b>Name:</b> ${name}<br><b>Phone:</b> ${phone}<br><b>Address:</b> ${address}`,
    icon: "success"
  });

  cart = [];
  localStorage.removeItem("cart");
  renderCheckout();
  form.reset();
});
