import DashboardModel from "../model/DashboardModel.js";

// ================================================================
// ────────────────────────── DOM refs ────────────────────────────
// ================================================================

const statCustomerCount = document.getElementById("statCustomerCount");
const statProductCount  = document.getElementById("statProductCount");
const statOrderCount    = document.getElementById("statOrderCount");
const statRevenueAmount = document.getElementById("statRevenueAmount");
const recentOrdersBody  = document.getElementById("recentOrdersBody");
const dashboardSection = document.getElementById("dashboardSection");

// ================================================================
// ────────────────── Render recent-orders table ──────────────────
// ================================================================

function renderRecentOrders(orders) {
    if (orders.length === 0) {
        recentOrdersBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:rgba(255,255,255,0.4); padding:2rem;">
                    No orders yet.
                </td>
            </tr>`;
        return;
    }

    recentOrdersBody.innerHTML = orders.map(order => `
        <tr>
            <th>${order.id}</th>
            <td>${order.customerName}</td>
            <td>Rs. ${order.total.toFixed(2)}/=</td>
            <td>
                <span class="orderBadge ${order.status === 'Completed' ? 'badge-green' : 'badge-yellow'}">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join("");
}

export function refreshDashboard() {
    const summary = DashboardModel.getSummary();

    statCustomerCount.textContent = summary.customerCount;
    statProductCount.textContent  = summary.productCount;
    statOrderCount.textContent    = summary.orderCount;
    statRevenueAmount.textContent = `Rs. ${summary.revenue.toFixed(2)}/=`;

    renderRecentOrders(summary.recentOrders);
}

// ================================================================
// ────────────────── Inject badge styles once ────────────────────
// ================================================================

if (!document.getElementById("dashboardBadgeStyle")) {
    const style = document.createElement("style");
    style.id = "dashboardBadgeStyle";
    style.textContent = `
        .orderBadge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
        }
        .badge-green  { background: rgba(34,197,94,0.2);  color: #22c55e; border: 1px solid rgba(34,197,94,0.4); }
        .badge-yellow { background: rgba(255,204,0,0.15); color: #ffcc00; border: 1px solid rgba(255,204,0,0.35); }
    `;
    document.head.appendChild(style);
}

// ================================================================
// ────────────────── Refresh Dashboard ──────────────────────────
// ================================================================

const observer = new MutationObserver(() => {
    if (dashboardSection.classList.contains("active")) {
        refreshDashboard();
    }
});

observer.observe(dashboardSection, { attributes: true, attributeFilter: ["class"] });