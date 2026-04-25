import { customers_DB } from "../db/db.js";
import {checkPhone} from "../utill/regexUtill.js";

class CustomerModel {

    // ================================================================
    // ── Auto-generate next Customer ID ──────────────────────
    // ================================================================

    static generateID() {
        if (customers_DB.length === 0) return "C-0001";
        const last = customers_DB[customers_DB.length - 1].id;
        const num  = parseInt(last.split("-")[1]) + 1;
        return "C-" + String(num).padStart(4, "0");
    }

    // ================================================================
    // ── Add a new customer ───────────────────────────────────
    // ================================================================

    static add(name, phone, address) {
        if (!name.trim() || !phone.trim() || !address.trim()) {
            return { success: false, message: "Name and phone are required." };
        }

        if (!checkPhone(phone)) {
            return { success: false, message: "Please Enter An Valid Phone Number" };
        }

        // Duplicate phone check
        const exists = customers_DB.find(c => c.phone === phone.trim());
        if (exists) {
            return { success: false, message: "A customer with this phone number already exists." };
        }

        const customer = {
            id      : CustomerModel.generateID(),
            name    : name.trim(),
            phone   : phone.trim(),
            address : address.trim()
        };

        customers_DB.push(customer);
        return { success: true, customer };
    }

    // ================================================================
    // ── Get all customers ────────────────────────────────────
    // ================================================================

    static getAll() {
        return [...customers_DB];
    }

    // ── Get customer by ID ───────────────────────────────────
    static getByID(id) {
        return customers_DB.find(c => c.id === id) || null;
    }

    // ================================================================
    // ── Update existing customer ─────────────────────────────
    // ================================================================

    static update(id, name, phone, address) {
        const idx = customers_DB.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, message: "Customer not found." };

        if (!name.trim() || !phone.trim()) {
            return { success: false, message: "Name and phone are required." };
        }

        // Duplicate phone check (exclude self)
        const dup = customers_DB.find(c => c.phone === phone.trim() && c.id !== id);
        if (dup) {
            return { success: false, message: "Another customer already uses this phone number." };
        }

        customers_DB[idx] = { id, name: name.trim(), phone: phone.trim(), address: address.trim() };
        return { success: true, customer: customers_DB[idx] };
    }

    // ================================================================
    // ── Delete customer by ID ────────────────────────────────
    // ================================================================

    static delete(id) {
        const idx = customers_DB.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, message: "Customer not found." };
        customers_DB.splice(idx, 1);
        return { success: true };
    }

    // ── Search customers by name or phone ────────────────────
    static search(query) {
        const q = query.toLowerCase().trim();
        if (!q) return CustomerModel.getAll();
        return customers_DB.filter(
            c => c.name.toLowerCase().includes(q) || c.phone.includes(q)
        );
    }
}

export default CustomerModel;