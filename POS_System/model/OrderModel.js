import { orders_DB } from "../db/db.js";
import CustomerModel from "./CustomerModel.js";
import ProductModel  from "./ProductModel.js";

class OrderModel {

    // ============================================================
    // ────────────── Auto-generate next Order ID ─────────────────
    // ============================================================

    static generateID() {
        if (orders_DB.length === 0) return "ORD-0001";
        const last = orders_DB[orders_DB.length - 1].id;
        const num  = parseInt(last.split("-")[1]) + 1;
        return "ORD-" + String(num).padStart(4, "0");
    }

    // ============================================================
    // ───────────────── Place a new order ────────────────────────
    // ============================================================

    static add(customerID, date, status, note, lines, discount) {

        if (!customerID) {
            return { success: false, message: "Please select a customer." };
        }
        if (lines.length === 0) {
            return { success: false, message: "Please add at least one product." };
        }

        const customer = CustomerModel.getByID(customerID);
        if (!customer) {
            return { success: false, message: "Selected customer not found." };
        }

        // ── Stock validation BEFORE saving anything ───────────────
        for (const line of lines) {
            const product = ProductModel.getByID(line.productID);
            if (!product) {
                return { success: false, message: `Product "${line.name}" no longer exists.` };
            }
            if (line.qty > product.qty) {
                return { success: false, message: `Not enough stock for "${product.name}". Available: ${product.qty}, Requested: ${line.qty}` };
            }
        }

        // ── Deduct stock AFTER all lines pass validation ──────────
        for (const line of lines) {
            const product = ProductModel.getByID(line.productID);
            product.qty -= line.qty;
        }

        const subtotal    = lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
        const discountAmt = subtotal * (discount / 100);
        const total       = subtotal - discountAmt;

        const order = {
            id           : OrderModel.generateID(),
            customerID,
            customerName : customer.name,
            date         : date || new Date().toISOString().split("T")[0],
            status       : status || "pending",
            note         : note.trim(),
            lines        : [...lines],
            discount,
            subtotal,
            total
        };

        orders_DB.push(order);
        return { success: true, order };
    }
}

export default OrderModel;