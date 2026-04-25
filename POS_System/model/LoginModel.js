import { usersDB } from "../db/db.js";

class LoginModel {
    static authenticate(email, password) {
        if (!email || !password) {
            return { success: false, message: "Please fill in all fields." };
        }

        const user = usersDB.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
            return { success: true, user };
        }

        return { success: false, message: "Invalid email or password." };
    }
}

export default LoginModel;