import { customers_DB, items_DB, orders_DB } from "../db/db.js";

class DashboardModel {

    // ============================================================
    // ────────────────── Total customer count ────────────────────
    // ============================================================

    static getCustomerCount() {
        return customers_DB.length;
    }

    // ============================================================
    // ────────────────── Total product count ─────────────────────
    // ============================================================

    static getProductCount() {
        return items_DB.length;
    }

    // ============================================================
    // ────────────────── Orders placed TODAY ─────────────────────
    // ============================================================

    static getTodayOrderCount() {
        const today = new Date().toDateString();
        return orders_DB.filter(o => new Date(o.date).toDateString() === today).length;
    }

    // ============================================================
    // ────────────────── Revenue TODAY ───────────────────────────
    // ============================================================

    static getTodayRevenue() {
        const today = new Date().toDateString();
        return orders_DB
            .filter(o => new Date(o.date).toDateString() === today)
            .reduce((sum, o) => sum + o.total, 0);
    }

    // ============================================================
    // ────── Most recent N orders (for the dashboard table) ───────
    // ============================================================

    static getRecentOrders(limit = 5) {
        return [...orders_DB]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // ============================================================
    // ── Full summary object (one call for the controller) ────
    // ============================================================

    static getSummary() {
        return {
            customerCount : DashboardModel.getCustomerCount(),
            productCount  : DashboardModel.getProductCount(),
            orderCount    : DashboardModel.getTodayOrderCount(),
            revenue       : DashboardModel.getTodayRevenue(),
            recentOrders  : DashboardModel.getRecentOrders()
        };
    }
}

export default DashboardModel;