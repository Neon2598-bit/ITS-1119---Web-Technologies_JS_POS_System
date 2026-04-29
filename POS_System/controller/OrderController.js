import OrderModel    from "../model/OrderModel.js";
import CustomerModel from "../model/CustomerModel.js";
import ProductModel  from "../model/ProductModel.js";

// ============================================================
// ────────────────────── DOM refs ────────────────────────────
// ============================================================

const orderCustomer  = document.getElementById("orderCustomer");
const orderDate      = document.getElementById("orderDate");
const orderStatus    = document.getElementById("orderStatus");
const orderStatusDot = document.getElementById("orderStatusDot");
const orderNote      = document.getElementById("orderNote");
const orderIDDisplay = document.getElementById("orderIDDisplay");
const orderError     = document.getElementById("orderError");

const pickerProduct  = document.getElementById("pickerProduct");
const pickerQty      = document.getElementById("pickerQty");
const pickerPrice    = document.getElementById("pickerPrice");
const btnAddLine     = document.getElementById("btnAddLine");
const btnClearLines  = document.getElementById("btnClearLines");
const linesList      = document.getElementById("linesList");
const lineCount      = document.getElementById("lineCount");
const discountInput  = document.getElementById("discountInput");
const discBadge      = document.getElementById("discBadge");

const sumSubtotal    = document.getElementById("sumSubtotal");
const sumDiscount    = document.getElementById("sumDiscount");
const sumItems       = document.getElementById("sumItems");
const sumTotal       = document.getElementById("sumTotal");

const btnPlaceOrder  = document.getElementById("btnPlaceOrder");
const btnClearOrder  = document.getElementById("btnClearOrder");

// ============================================================
// ──────────────────── State ────────────────────────────────
// ============================================================

let orderLines = [];

// ============================================================
// ──────────────────── Helpers ───────────────────────────────
// ============================================================

function setError(msg) { orderError.textContent = msg; }
function clearError()  { orderError.textContent = ""; }

function setTodayDate() {
    orderDate.value = new Date().toISOString().split("T")[0];
}

// ============================================================
// ────────── Populate dropdowns ─────────────────────────────
// ============================================================

function loadCustomerDropdown() {
    const customers = CustomerModel.getAll();
    orderCustomer.innerHTML = `<option value="">— Select Customer —</option>`;
    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value       = c.id;
        opt.textContent = `${c.name} (${c.id})`;
        orderCustomer.appendChild(opt);
    });
}

function loadProductDropdown() {
    const products = ProductModel.getAll();
    pickerProduct.innerHTML = `<option value="">— Select Product —</option>`;
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value       = p.id;
        opt.textContent = `${p.name} (${p.id})`;
        pickerProduct.appendChild(opt);
    });
}

// ============================================================
// ─────── Auto-fill price when product selected ──────────────
// ============================================================

pickerProduct.addEventListener("change", () => {
    const p = ProductModel.getByID(pickerProduct.value);
    pickerPrice.value = p ? p.price.toFixed(2) : "";
});

// ============================================================
// ─────────── Status dot follows select ─────────────────────
// ============================================================

orderStatus.addEventListener("change", () => {
    orderStatusDot.className = `statusDot dot-${orderStatus.value}`;
});

// ============================================================
// ───────── Discount badge updates live ────────────────────
// ============================================================

discountInput.addEventListener("input", () => {
    const val = Math.min(Math.max(Number(discountInput.value) || 0, 0), 100);
    discBadge.textContent = val + "%";
    updateSummary();
});

// ============================================================
// ──────────────── Add a line item ───────────────────────────
// ============================================================

btnAddLine.addEventListener("click", () => {
    const productID = pickerProduct.value;
    const qty       = parseInt(pickerQty.value);

    if (!productID)       { setError("Please select a product.");          return; }
    if (!qty || qty < 1)  { setError("Please enter a valid quantity.");    return; }

    const product = ProductModel.getByID(productID);
    if (!product)         { setError("Product not found.");                return; }

    const existing = orderLines.find(l => l.productID === productID);
    if (existing) {
        existing.qty += qty;
    } else {
        orderLines.push({ productID: product.id, name: product.name, qty, unitPrice: product.price });
    }

    clearError();
    renderLines();
    updateSummary();
    pickerProduct.value = "";
    pickerPrice.value   = "";
    pickerQty.value     = 1;
});

// ============================================================
// ───────────────── Render line items ────────────────────────
// ============================================================

function renderLines() {
    lineCount.textContent = orderLines.length;

    if (orderLines.length === 0) {
        linesList.innerHTML = `
            <div class="emptyLines">
                <i class="fa-solid fa-box-open fa-2xl" style="color:rgba(255,255,255,0.15);"></i>
                <span>No items added yet</span>
            </div>`;
        return;
    }

    linesList.innerHTML = orderLines.map((line, index) => `
        <div class="lineItem">
            <div>
                <div class="lineName">${line.name}</div>
                <div class="lineQty">x${line.qty}</div>
            </div>
            <span class="linePrice">Rs. ${(line.qty * line.unitPrice).toFixed(2)}</span>
            <button class="lineRemoveBtn" data-index="${index}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join("");

    linesList.querySelectorAll(".lineRemoveBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            orderLines.splice(Number(btn.dataset.index), 1);
            renderLines();
            updateSummary();
        });
    });
}

// ============================================================
// ───────────────── Update summary ───────────────────────────
// ============================================================

function updateSummary() {
    const subtotal    = orderLines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
    const discount    = Math.min(Math.max(Number(discountInput.value) || 0, 0), 100);
    const discountAmt = subtotal * (discount / 100);
    const total       = subtotal - discountAmt;
    const totalQty    = orderLines.reduce((sum, l) => sum + l.qty, 0);

    sumSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
    sumDiscount.textContent = `- Rs. ${discountAmt.toFixed(2)}`;
    sumItems.textContent    = `${totalQty} pcs`;
    sumTotal.textContent    = `Rs. ${total.toFixed(2)}`;
}

// ============================================================
// ────────────────── Clear all lines ──────────────────────────
// ============================================================

btnClearLines.addEventListener("click", () => {
    orderLines = [];
    renderLines();
    updateSummary();
});

// ============================================================
// ──────────────────────── Clear form ────────────────────────
// ============================================================

function clearForm() {
    orderCustomer.value      = "";
    orderStatus.value        = "pending";
    orderStatusDot.className = "statusDot dot-pending";
    orderNote.value          = "";
    discountInput.value      = "";
    discBadge.textContent    = "0%";
    orderLines               = [];
    pickerProduct.value      = "";
    pickerPrice.value        = "";
    pickerQty.value          = 1;

    setTodayDate();
    orderIDDisplay.textContent = OrderModel.generateID();
    renderLines();
    updateSummary();
    clearError();
}

// ============================================================
// ─────────────────── Place order ────────────────────────────
// ============================================================

function placeOrder() {
    clearError();
    const result = OrderModel.add(
        orderCustomer.value,
        orderDate.value,
        orderStatus.value,
        orderNote.value,
        orderLines,
        Number(discountInput.value) || 0
    );

    if (!result.success) { setError(result.message); return; }

    Swal.fire({ icon: "success", title: "Order Placed!", timer: 1500, showConfirmButton: false });
    clearForm();
}

// ============================================================
// ──────────────────── Button events ─────────────────────
// ============================================================

btnPlaceOrder.addEventListener("click", placeOrder);
btnClearOrder.addEventListener("click", clearForm);

// ============================================================
// ────── Reload dropdowns when Orders section opens ──────────
// ============================================================

const ordersSection = document.getElementById("ordersSection");
const observer = new MutationObserver(() => {
    if (ordersSection.classList.contains("active")) {
        loadCustomerDropdown();
        loadProductDropdown();
    }
});
observer.observe(ordersSection, { attributes: true, attributeFilter: ["class"] });

// ============================================================
// ──────────────────────── Init ──────────────────────────────
// ============================================================

clearForm();