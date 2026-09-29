/* =========================
   SECTION & TAB HANDLING
========================= */
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function showTab(tabId) {
    document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId + 'Form').classList.add('active');
    event.target.classList.add('active');
}

/* =========================
   SUPPLIER FORM → MYSQL
========================= */
document.getElementById("farmerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        supplier_id: document.getElementById("farmerId").value,
        name: document.getElementById("farmerName").value,
        contact: document.getElementById("farmerContact").value,
        location: document.getElementById("farmerLocation").value
    };

    fetch("http://localhost:3000/addSupplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById("farmerForm").reset();
        loadSuppliers();
    })
    .catch(err => console.error(err));
});

/* =========================
   CROP FORM → MYSQL
========================= */
document.getElementById("cropForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        crop_id: document.getElementById("cropId").value,
        crop_name: document.getElementById("cropName").value,
        season: document.getElementById("cropSeason").value,
        price: document.getElementById("cropPrice").value
    };

    fetch("http://localhost:3000/addCrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById("cropForm").reset();
        loadCrops();
        populateCropOptions();
    })
    .catch(err => console.error(err));
});

/* =========================
   ORDER FORM → MYSQL
========================= */
document.getElementById("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        order_id: document.getElementById("orderId").value,
        customer_name: document.getElementById("customerName").value,
        crop_id: document.getElementById("orderCrop").value,
        quantity: document.getElementById("orderQty").value,
        total_amount: document.getElementById("orderTotal").value
    };

    fetch("http://localhost:3000/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById("orderForm").reset();
        loadOrders();
    })
    .catch(err => console.error(err));
});

/* =========================
   PAYMENT FORM → MYSQL
========================= */
document.getElementById("paymentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        payment_id: document.getElementById("paymentId").value,
        order_id: document.getElementById("paymentOrderId").value,
        payment_mode: document.getElementById("paymentMode").value,
        payment_status: document.getElementById("paymentStatus").value
    };

    fetch("http://localhost:3000/addPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById("paymentForm").reset();
        loadPayments();
    })
    .catch(err => console.error(err));
});

/* =========================
   DASHBOARD LOADERS (MYSQL)
========================= */
function loadSuppliers() {
    fetch("http://localhost:3000/suppliers")
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalFarmers").innerText = data.length;
            renderList("farmersList", data, "farmer");
        });
}

function loadCrops() {
    fetch("http://localhost:3000/crops")
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalCrops").innerText = data.length;
            renderList("cropsList", data, "crop");
        });
}

function loadOrders() {
    fetch("http://localhost:3000/orders")
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalOrders").innerText = data.length;
            renderList("ordersList", data, "order");
        });
}

function loadPayments() {
    fetch("http://localhost:3000/payments")
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalPayments").innerText = data.length;
            renderList("paymentsList", data, "payment");
        })
        .catch(err => console.error("Error loading payments:", err));
}

/* =========================
   CROP DROPDOWN & TOTAL
========================= */
function populateCropOptions() {
    fetch("http://localhost:3000/crops")
        .then(res => res.json())
        .then(crops => {
            const cropSelect = document.getElementById("orderCrop");
            cropSelect.innerHTML = '<option value="">Select Crop</option>';
            crops.forEach(crop => {
                const option = document.createElement("option");
                option.value = crop.CropID;
                option.textContent = crop.CropName;
                option.dataset.price = crop.PricePerUnit;
                cropSelect.appendChild(option);
            });
        });
}


// Calculate total cost when crop or quantity changes
document.getElementById("orderQty").addEventListener("input", calculateTotal);
document.getElementById("orderCrop").addEventListener("change", calculateTotal);

function calculateTotal() {
    const cropSelect = document.getElementById("orderCrop");
    const qty = document.getElementById("orderQty").value;
    const price = cropSelect.selectedOptions[0]?.dataset.price;

    if (price && qty) {
        document.getElementById("orderTotal").value = (parseFloat(price) * parseInt(qty)).toFixed(2);
    } else {
        document.getElementById("orderTotal").value = "";
    }
}

/* =========================
   RENDER LIST WITH ACTIONS
========================= */
function renderList(listId, data, type) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        let content = "";

        if (type === "farmer") {
            content = `<div><strong>${item.Name}</strong><br>ID: ${item.SupplierID}<br>Location: ${item.FarmLocation}</div>
                       <button onclick="updateSupplier('${item.SupplierID}')">✏️ Edit</button>
                       <button onclick="deleteSupplier('${item.SupplierID}')">🗑 Delete</button>`;
        } 
        else if (type === "crop") {
            content = `<div><strong>${item.CropName}</strong><br>Season: ${item.GrowingSeason}<br>Price: ₹${item.PricePerUnit}</div>
                       <button onclick="updateCrop('${item.CropID}')">✏️ Edit</button>
                       <button onclick="deleteCrop('${item.CropID}')">🗑 Delete</button>`;
        } 
        else if (type === "order") {
            content = `<div><strong>Order ${item.OrderID}</strong><br>Customer: ${item.BuyerName}<br>Qty: ${item.Quantity}<br>Total: ₹${item.TotalCost}</div>
                       <button onclick="updateOrder('${item.OrderID}')">✏️ Edit</button>
                       <button onclick="deleteOrder('${item.OrderID}')">🗑 Delete</button>`;
        } 
        else if (type === "payment") {
            content = `<div><strong>Payment ${item.PaymentID}</strong><br>Order: ${item.OrderID}<br>Status: ${item.PaymentStatus}</div>
                       <button onclick="updatePayment('${item.PaymentID}')">✏️ Edit</button>
                       <button onclick="deletePayment('${item.PaymentID}')">🗑 Delete</button>`;
        }

        card.innerHTML = content;
        list.appendChild(card);
    });
}

/* =========================
   UPDATE + DELETE FUNCTIONS
========================= */
function updateSupplier(id) {
    const data = {
        name: prompt("Enter new name:"),
        contact: prompt("Enter new contact:"),
        location: prompt("Enter new location:")
    };
    fetch(`http://localhost:3000/updateSupplier/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => { alert(msg); loadSuppliers(); });
}

function updateCrop(id) {
    const data = {
        crop_name: prompt("Enter new crop name:"),
        season: prompt("Enter new season:"),
        price: prompt("Enter new price:")
    };
    fetch(`http://localhost:3000/updateCrop/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => { alert(msg); loadCrops(); });
}

function updateOrder(id) {
    const data = {
        customer_name: prompt("Enter new customer name:"),
        crop_id: prompt("Enter new crop ID:"),
        quantity: prompt("Enter new quantity:"),
        total_amount: prompt("Enter new total amount:")
    };
    fetch(`http://localhost:3000/updateOrder/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => { alert(msg); loadOrders(); });
}

function updatePayment(id) {
    const data = {
        order_id: prompt("Enter new order ID:"),
        payment_mode: prompt("Enter new payment mode:"),
        payment_status: prompt("Enter new payment status:")
    };
    fetch(`http://localhost:3000/updatePayment/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => { alert(msg); loadPayments(); });
}

/* =========================
   SEARCH FUNCTION
========================= */
function searchItems(query) {
    query = query.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
}

document.getElementById("search").addEventListener("input", e => {
    searchItems(e.target.value);
});

/* =========================
   PAGE LOAD
========================= */
window.onload = () => {
    loadSuppliers();
    loadCrops();
    loadOrders();
    loadPayments();
    populateCropOptions();   // ✅ dropdown filled on page load
};
