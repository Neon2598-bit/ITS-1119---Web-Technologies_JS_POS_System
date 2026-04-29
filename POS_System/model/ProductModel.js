import { items_DB } from "../db/db.js";

class ProductModel {

    // ============================================================
    // ── Auto-generate next Product ID ────────────────────────
    // ============================================================

    static generateID() {
        if (items_DB.length === 0) return "P-0001";
        const last = items_DB[items_DB.length - 1].id;
        const num  = parseInt(last.split("-")[1]) + 1;
        return "P-" + String(num).padStart(4, "0");
    }

    // ============================================================
    // ── Add a new product ────────────────────────────────────
    // ============================================================

    static add(name, price, qty, description) {
        if (!name.trim() || !price || !qty) {
            return { success: false, message: "Name, price and quantity are required." };
        }
        if (isNaN(price) || Number(price) < 0) {
            return { success: false, message: "Enter a valid price." };
        }
        if (isNaN(qty) || Number(qty) < 0) {
            return { success: false, message: "Enter a valid quantity." };
        }

        // ── Duplicate name check → merge qty ─────────────────
        const existing = items_DB.find(
            p => p.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (existing) {
            existing.qty += parseInt(qty);
            return { success: true, product: existing, merged: true };
        }

        // ── New product ───────────────────────────────────────
        const product = {
            id          : ProductModel.generateID(),
            name        : name.trim(),
            price       : parseFloat(price),
            qty         : parseInt(qty),
            description : description.trim()
        };

        items_DB.push(product);
        return { success: true, product, merged: false };
    }

    // ============================================================
    // ── Get all products ─────────────────────────────────────
    // ============================================================

    static getAll() {
        return [...items_DB];
    }

    // ============================================================
    // ── Get product by ID ────────────────────────────────────
    // ============================================================

    static getByID(id) {
        return items_DB.find(p => p.id === id) || null;
    }

    // ============================================================
    // ── Update existing product ──────────────────────────────
    // ============================================================

    static update(id, name, price, qty, description) {
        const idx = items_DB.findIndex(p => p.id === id);
        if (idx === -1) return { success: false, message: "Product not found." };

        if (!name.trim() || !price || !qty) {
            return { success: false, message: "Name, price and quantity are required." };
        }

        items_DB[idx] = {
            id,
            name        : name.trim(),
            price       : parseFloat(price),
            qty         : parseInt(qty),
            description : description.trim()
        };
        return { success: true, product: items_DB[idx] };
    }

    // ============================================================
    // ── Delete product by ID ─────────────────────────────────
    // ============================================================

    static delete(id) {
        const idx = items_DB.findIndex(p => p.id === id);
        if (idx === -1) return { success: false, message: "Product not found." };
        items_DB.splice(idx, 1);
        return { success: true };
    }

    // ============================================================
    // ── Search by name ───────────────────────────────────────
    // ============================================================

    static search(query) {
        const q = query.toLowerCase().trim();
        if (!q) return ProductModel.getAll();
        return items_DB.filter(p => p.name.toLowerCase().includes(q));
    }
}

export default ProductModel;