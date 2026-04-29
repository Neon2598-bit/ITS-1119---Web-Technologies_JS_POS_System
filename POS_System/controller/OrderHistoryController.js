import { orders_DB } from "../db/db.js";

const tbody       = document.getElementById("historyTableBody");
const emptyState  = document.getElementById("historyEmpty");
const tableEl     = document.getElementById("historyTable");
const subtitle    = document.getElementById("historySubtitle");

const dateFrom    = document.getElementById("historyDateFrom");
const dateTo      = document.getElementById("historyDateTo");
const btnFilter   = document.getElementById("btnHistoryFilter");
const btnReset    = document.getElementById("btnHistoryClear");

const chipTotal     = document.getElementById("chipTotal");
const chipCompleted = document.getElementById("chipCompleted");
const chipPending   = document.getElementById("chipPending");
const chipRevenue   = document.getElementById("chipRevenue");

function fmtCurrency(n) {
    return "Rs. " + Number(n).toFixed(2);
}

function badgeClass(status) {
    const map = {
        pending  : "badge-pending",
        confirmed: "badge-confirmed",
        completed: "badge-completed",
        cancelled: "badge-cancelled",
    };
    return map[status] || "badge-pending";
}

function updateChips(orders) {
    chipTotal.textContent     = orders.length;
    chipCompleted.textContent = orders.filter(o => o.status === "completed").length;
    chipPending.textContent   = orders.filter(o => o.status === "pending").length;
    chipRevenue.textContent   = fmtCurrency(orders.reduce((sum, o) => sum + (o.total || 0), 0));
}

function renderHistory(orders) {
    tbody.innerHTML = "";

    if (!orders.length) {
        tableEl.style.display    = "none";
        emptyState.style.display = "flex";
        subtitle.textContent     = "No orders found for the selected period.";
        updateChips([]);
        return;
    }

    tableEl.style.display    = "table";
    emptyState.style.display = "none";
    subtitle.textContent     = `Showing ${orders.length} order${orders.length !== 1 ? "s" : ""}`;

    orders.forEach(order => {
        const totalQty = (order.lines || []).reduce((s, l) => s + (l.qty || 1), 0);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName || order.customerID}</td>
            <td>${order.date || "—"}</td>
            <td style="text-align:center;">${totalQty}</td>
            <td>${order.discount || 0}%</td>
            <td>${fmtCurrency(order.total)}</td>
            <td>
                <span class="statusBadge ${badgeClass(order.status)}">
                    ${order.status || "pending"}
                </span>
            </td>
            <td style="color:rgba(255,255,255,0.45); font-size:0.8rem;">
                ${order.note || "—"}
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateChips(orders);
}

function applyFilter() {
    let orders = [...orders_DB];
    const from = dateFrom.value;
    const to   = dateTo.value;
    if (from) orders = orders.filter(o => o.date && o.date >= from);
    if (to)   orders = orders.filter(o => o.date && o.date <= to);
    renderHistory(orders);
}

btnFilter.addEventListener("click", applyFilter);

btnReset.addEventListener("click", () => {
    dateFrom.value = "";
    dateTo.value   = "";
    applyFilter();
});

const historySection = document.getElementById("historySection");
const observer = new MutationObserver(() => {
    if (historySection.classList.contains("active")) applyFilter();
});
observer.observe(historySection, { attributes: true, attributeFilter: ["class"] });

applyFilter();