import CustomerModel from "../model/CustomerModel.js";

// ================================================================
// ──────────────────────────── DOM refs ──────────────────────────
// ================================================================

const nameInput    = document.getElementById("customerName");
const phoneInput   = document.getElementById("customerPhone");
const addressInput = document.getElementById("customerAddress");
const idInput      = document.getElementById("customerID");
const errorMsg     = document.getElementById("customerError");
const tableBody    = document.getElementById("customerTableBody");
const searchInput  = document.getElementById("customerSearch");

const btnSave   = document.getElementById("btnSaveCustomer");
const btnClear  = document.getElementById("btnClearCustomer");
const btnUpdate = document.getElementById("btnUpdateCustomer");
const btnDelete = document.getElementById("btnDeleteCustomer");

// ================================================================
// ────────────────────────── State ───────────────────────────────
// ================================================================
let selectedCustomerID = null;   // tracks which row is selected

// ================================================================
// ──────────────────────── Helpers ───────────────────────────────
// ================================================================

function setError(msg) {
    errorMsg.textContent = msg;
}

function clearError() {
    errorMsg.textContent = "";
}

function clearForm() {
    nameInput.value    = "";
    phoneInput.value   = "";
    addressInput.value = "";
    idInput.value      = CustomerModel.generateID();  // pre-fill next ID
    clearError();
    selectedCustomerID = null;
    highlightSelectedRow(null);
}

function highlightSelectedRow(id) {
    document.querySelectorAll("#customerTableBody tr").forEach(row => {
        row.classList.toggle("selectedRow", row.dataset.id === id);
    });
}

// ================================================================
// ───────────────────── Render table ─────────────────────────────
// ================================================================

function renderTable(customers) {
    if (customers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color:rgba(255,255,255,0.4); padding:2rem;">
                    No customers found.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = customers.map(c => `
        <tr data-id="${c.id}">
            <th>${c.id}</th>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.address || "—"}</td>
            <td>
                <button class="tableBtn editBtn" data-id="${c.id}" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="tableBtn delBtn" data-id="${c.id}" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");

    // Row click → populate form
    tableBody.querySelectorAll("tr[data-id]").forEach(row => {
        row.addEventListener("click", (e) => {
            // Avoid triggering when edit/delete buttons are clicked
            if (e.target.closest(".tableBtn")) return;
            loadCustomerToForm(row.dataset.id);
        });
    });

    // Edit button
    tableBody.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => loadCustomerToForm(btn.dataset.id));
    });

    // Delete button
    tableBody.querySelectorAll(".delBtn").forEach(btn => {
        btn.addEventListener("click", () => deleteCustomer(btn.dataset.id));
    });
}

// ================================================================
// ────────────────── Load a customer into the form ─────────────
// ================================================================

function loadCustomerToForm(id) {
    const c = CustomerModel.getByID(id);
    if (!c) return;

    nameInput.value    = c.name;
    phoneInput.value   = c.phone;
    addressInput.value = c.address;
    idInput.value      = c.id;
    selectedCustomerID = c.id;
    clearError();
    highlightSelectedRow(id);
}

// ================================================================
// ───────────────────── CRUD actions ─────────────────────────────
// ================================================================

function saveCustomer() {
    clearError();
    const result = CustomerModel.add(nameInput.value, phoneInput.value, addressInput.value);
    if (!result.success) { setError(result.message); return; }
    renderTable(CustomerModel.getAll());
    clearForm();

    // https://sweetalert2.github.io/#download
    Swal.fire({ icon: "success", title: "Customer Saved!", timer: 1500, showConfirmButton: false });
}

function updateCustomer() {
    if (!selectedCustomerID) { setError("Please select a customer from the table first."); return; }
    clearError();
    const result = CustomerModel.update(selectedCustomerID, nameInput.value, phoneInput.value, addressInput.value);
    if (!result.success) { setError(result.message); return; }
    renderTable(CustomerModel.getAll());
    clearForm();

    // https://sweetalert2.github.io/#download
    Swal.fire({ icon: "success", title: "Customer Updated!", timer: 1500, showConfirmButton: false });
}

function deleteCustomer(id) {
    const targetID = id || selectedCustomerID;
    if (!targetID) { setError("Please select a customer to delete."); return; }

    // https://sweetalert2.github.io/#download
    Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Delete customer ${targetID}? This cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(result => {
        if (!result.isConfirmed) return;
        clearError();
        const res = CustomerModel.delete(targetID);
        if (!res.success) { setError(res.message); return; }
        renderTable(CustomerModel.getAll());
        clearForm();
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
    });
}

// ================================================================
// ───────────────────── Search ───────────────────────────────────
// ================================================================

searchInput.addEventListener("input", () => {
    renderTable(CustomerModel.search(searchInput.value));
});

// ================================================================
// ───────────────────── Button events ────────────────────────────
// ================================================================

btnSave.addEventListener("click",   saveCustomer);
btnClear.addEventListener("click",  clearForm);
btnUpdate.addEventListener("click", updateCustomer);
btnDelete.addEventListener("click", () => deleteCustomer(null));

// ================================================================
// ──────────── Inject "selectedRow" highlight style once ──────────
// ================================================================

if (!document.getElementById("selectedRowStyle")) {
    const style = document.createElement("style");
    style.id = "selectedRowStyle";
    style.textContent = `
        #customerTableBody tr.selectedRow {
            background: rgba(255, 204, 0, 0.08) !important;
            outline: 1px solid rgba(255, 204, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// ================================================================
// ────────────────────────── Init ────────────────────────────────
// ================================================================

clearForm();           // pre-fill auto-generated ID on load
renderTable([]);       // start with empty table