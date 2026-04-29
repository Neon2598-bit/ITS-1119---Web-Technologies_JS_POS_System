import ProductModel from "../model/ProductModel.js";

// ============================================================
// ─────────────────────── DOM refs ───────────────────────────
// ============================================================

const nameInput        = document.getElementById("productName");
const priceInput       = document.getElementById("productPrice");
const qtyInput         = document.getElementById("productQty");
const descriptionInput = document.getElementById("productDescription");
const idInput          = document.getElementById("productID");
const errorMsg         = document.getElementById("productError");
const tableBody        = document.getElementById("productTableBody");
const searchInput      = document.getElementById("productSearch");

const btnSave   = document.getElementById("btnSaveProduct");
const btnClear  = document.getElementById("btnClearProduct");
const btnUpdate = document.getElementById("btnUpdateProduct");
const btnDelete = document.getElementById("btnDeleteProduct");

// ============================================================
// ─────────────────── State ─────────────────────────────────
// ============================================================

let selectedProductID = null;

// ============================================================
// ─────────────────────── Helpers ────────────────────────────
// ============================================================

function setError(msg)  { errorMsg.textContent = msg; }
function clearError()   { errorMsg.textContent = ""; }

function clearForm() {
    nameInput.value        = "";
    priceInput.value       = "";
    qtyInput.value         = "";
    descriptionInput.value = "";
    idInput.value          = ProductModel.generateID();
    selectedProductID      = null;
    clearError();
    highlightSelectedRow(null);
}

function highlightSelectedRow(id) {
    document.querySelectorAll("#productTableBody tr").forEach(row => {
        row.classList.toggle("selectedRow", row.dataset.id === id);
    });
}

// ============================================================
// ──────────────────── Render table ──────────────────────────
// ============================================================

function renderTable(products) {
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:rgba(255,255,255,0.4); padding:2rem;">
                    No products found.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = products.map(p => `
        <tr data-id="${p.id}">
            <th>${p.id}</th>
            <td>${p.name}</td>
            <td>Rs. ${p.price.toFixed(2)}</td>
            <td>
                <span class="${p.qty <= 10 ? 'badge-low' : 'badge-ok'}">
                    ${p.qty}
                </span>
            </td>
            <td>${p.description || "—"}</td>
            <td>
                <button class="tableBtn editBtn" data-id="${p.id}" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="tableBtn delBtn" data-id="${p.id}" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");

    // ============================================================
    // Row click → populate form
    // ============================================================

    tableBody.querySelectorAll("tr[data-id]").forEach(row => {
        row.addEventListener("click", e => {
            if (e.target.closest(".tableBtn")) return;
            loadProductToForm(row.dataset.id);
        });
    });

    // ============================================================
    // Edit button
    // ============================================================

    tableBody.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => loadProductToForm(btn.dataset.id));
    });

    // ============================================================
    // Delete button
    // ============================================================
    tableBody.querySelectorAll(".delBtn").forEach(btn => {
        btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
}

// ============================================================
// ─────────────────── Load product into form ─────────────────
// ============================================================

function loadProductToForm(id) {
    const p = ProductModel.getByID(id);
    if (!p) return;

    nameInput.value        = p.name;
    priceInput.value       = p.price;
    qtyInput.value         = p.qty;
    descriptionInput.value = p.description;
    idInput.value          = p.id;
    selectedProductID      = p.id;
    clearError();
    highlightSelectedRow(id);
}

// ============================================================
// ──────────────────────── CRUD ──────────────────────────────
// ============================================================

function saveProduct() {
    clearError();
    const result = ProductModel.add(nameInput.value, priceInput.value, qtyInput.value, descriptionInput.value);
    if (!result.success) { setError(result.message); return; }

    renderTable(ProductModel.getAll());
    clearForm();

    // Show different message if qty was merged into existing product
    if (result.merged) {
        Swal.fire({ icon: "info", title: "Stock Updated!", text: `"${result.product.name}" already exists. Qty has been added to existing stock.`, timer: 2000, showConfirmButton: false });
    } else {
        Swal.fire({ icon: "success", title: "Product Saved!", timer: 1500, showConfirmButton: false });
    }
}

function updateProduct() {
    if (!selectedProductID) { setError("Please select a product from the table first."); return; }
    clearError();
    const result = ProductModel.update(selectedProductID, nameInput.value, priceInput.value, qtyInput.value, descriptionInput.value);
    if (!result.success) { setError(result.message); return; }
    renderTable(ProductModel.getAll());
    clearForm();

    // https://sweetalert2.github.io/#download
    Swal.fire({ icon: "success", title: "Product Has Been Updated!", timer: 1500, showConfirmButton: false });
}

function deleteProduct(id) {
    const targetID = id || selectedProductID;
    if (!targetID) { setError("Please select a product to delete."); return; }

    // https://sweetalert2.github.io/#download
    Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Delete product ${targetID}? This cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (!result.isConfirmed) return;
        clearError();
        const res = ProductModel.delete(targetID);
        if (!res.success) { setError(res.message); return; }
        renderTable(ProductModel.getAll());
        clearForm();
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    });
}

// ============================================================
// ──────────────────────── Search ───────────────────────────
// ============================================================

searchInput.addEventListener("input", () => {
    renderTable(ProductModel.search(searchInput.value));
});

// ============================================================
// ─────────────────── Button events ──────────────────────────
// ============================================================

btnSave.addEventListener("click",   saveProduct);
btnClear.addEventListener("click",  clearForm);
btnUpdate.addEventListener("click", updateProduct);
btnDelete.addEventListener("click", () => deleteProduct(null));

// ============================================================
// ──────── Selected row highlight style ──────────────────────
// ============================================================

const style = document.createElement("style");
style.textContent = `
    #productTableBody tr.selectedRow {
        background: rgba(255, 204, 0, 0.08) !important;
        outline: 1px solid rgba(255, 204, 0, 0.3);
    }
`;
document.head.appendChild(style);

// ============================================================
// ────── Products section becomes active → re-render ─────────
// ============================================================

const productsSection = document.getElementById("productsSection");
const observer = new MutationObserver(() => {
    if (productsSection.classList.contains("active")) {
        renderTable(ProductModel.getAll());
    }
});
observer.observe(productsSection, { attributes: true, attributeFilter: ["class"] });

// ============================================================
// ──────────────────────────── Init ──────────────────────────
// ============================================================

clearForm();
renderTable([]);