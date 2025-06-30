const products=[
    {
        id:1,
        title:"Men's casual coat",
        price:799,
        image:"./images/boy1.jpg",
        category:"Men",
        description: "A stylish and warm coat perfect for winter outings.",
        rating:4.8
    },
    {
        id:2,
        title:"Women's Yellow Kurti",
        price:599,
        image:"./images/girl1.jpg",
        category:"Women",
        description: "Bright yellow cotton kurti suitable for festive and casual wear.",
        rating:4.5
    },
    {
        id:3,
        title:"Men's Kurta",
        price:1299,
        image:"./images/kurta.jpeg",
        category:"Men",
        description: "Traditional silk kurta for ethnic events and ceremonies.",
        rating:4.0
    },
        {
        id:4,
        title:"Rayban Sunglasses",
        price:6999,
        image:"./images/sunglass.jpg",
        category:"Accessories",
        description: "A stylish and cool sunglasses perfect for outings.",
        rating:5.0
    },
    {
        id:5,
        title:"Women's White Kurti",
        price:899,
        image:"./images/girl3.jpg",
        category:"Women",
        description: "Bright white cotton kurti suitable for festive and casual wear.",
        rating:4.5
    },
    {
        id:6,
        title:"Sneakers",
        price:2500,
        image:"./images/sneakers.jpeg",
        category:"Accessories",
        description: "A stylish and comfortable sneaker perfect for all occasions.",
        rating:4.7
    },
    {
        id:7,
        title:"Men's Suit",
        price:2999,
        image:"./images/suit.jpg",
        category:"Men",
        description: "A stylish and formal coat perfect for outings.",
        rating:4.8
    },
    {
        id:8,
        title:"Earrings",
        price:399,
        image:"./images/earring.jpg",
        category:"Accessories",
        description: "A modern and stylish earring perfect for all outings.",
        rating:4.5
    },
    {
        id:9,
        title:"Girl's denim jean",
        price:799,
        image:"./images/denim.jpeg",
        category:"Women",
        description: "A comfortable and modern denim jean for girls.",
        rating:4.5
    },
    {
        id:10,
        title:"Fastrack wrist watch",
        price:4999,
        image:"./images/watch1.jpg",
        category:"Accessories",
        description: "A stylish and attractive watch which is everyone's choice.",
        rating:5.0
    },
]

const container = document.getElementById("productGrid");

function render(products){
    container.innerHTML =""
    products.forEach(product => {
        const card=document.createElement("div")
        card.classList.add('card')

        card.innerHTML=`
        <img src="${product.image}" alt="${product.title}"/>
        <h3>${product.title}</h3>
        <p class="price">${product.price}</p>
        <p>${product.category}</p>
        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `
        container.appendChild(card);

        const addBtn = card.querySelector('.add-to-cart-btn');
        addBtn.addEventListener('click', () => addToCart(product));

    });
}

render(products)

const searchInput = document.getElementById("searchInput");
const filterbtns = document.querySelectorAll(".filter-btn");

let currentCategory = "All";
let currentSearch = "";

function applyFilters() {
    let filtered = products;

    //Category based filter
    if (currentCategory !== "All") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    //Filter based filter
    if (currentSearch.trim() !== "") {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    //Sort filter
    const sortValue = sortSelect.value;
    if (sortValue === "low-high") {
        filtered=[...filtered].sort((a, b) => a.price - b.price);
    } 
    else if (sortValue === "high-low") {
        filtered=[...filtered].sort((a, b) => b.price - a.price);
    }

    render(filtered);
}


searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value;
    applyFilters();
});

// Category filter buttons
filterbtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterbtns.forEach(button => button.classList.remove("active"));
        btn.classList.add("active");

        currentCategory = btn.dataset.category;
        applyFilters();
    });
});

const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", () => {
    applyFilters();
});


//Clear btn
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
    currentCategory = "All";
    currentSearch = "";
    searchInput.value = "";
    sortSelect.value = "default";

    filterbtns.forEach(button => button.classList.remove("active"));

    render(products);
});


const cartContainer = document.querySelector(".cart-container");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.querySelector(".cart-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCart(); 

function addToCart(product){
    const item= cart.find (p=>p.id===product.id)
    if (item){
        item.quantity+=1;
    }
    else{
        cart.push({...product, quantity:1})
    }

    Swal.fire({
        title: "Added to Cart",
        text: `${product.title} added successfully!`,
        icon: "success",
    });

    updateCart();

}

function decQty(id){
    const item = cart.find(p => p.id === id);
    if (item && item.quantity>1){
        item.quantity-=1;
    }
    else{
       cart=cart.filter(item=> item.id !==id)
    }
    updateCart();
}

function removeItem(id){
    cart=cart.filter(item=> item.id !==id)
    updateCart();
}

function updateCart(){
    cartContainer.innerHTML=""
    let total=0
    let itemCount = 0; 

    cart.forEach(item =>{
        const itemCart=document.createElement("div")
        itemCart.classList.add('cart-item')

        itemCart.innerHTML=`
        <span class="item-title">${item.title} (x${item.quantity})</span>
        <button class="qty-btn" onclick="decQty(${item.id})">-</button>
        <button class="remove-btn" onclick="removeItem(${item.id})"> X </button>
        `

        cartContainer.appendChild(itemCart)
        total+= item.price*item.quantity
        itemCount += item.quantity; 
    })

    cartCount.innerText=`( ${itemCount} )`
    cartTotal.innerText=`Total : ₹${total}`

    localStorage.setItem("cart", JSON.stringify(cart));
}

