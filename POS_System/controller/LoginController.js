import LoginModel from "../model/LoginModel.js";

// ── DOM refs ──────────────────────────────────────────────────
const emailInput    = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const btnLogin      = document.getElementById("btnLogin");
const loginError    = document.getElementById("loginError");
const mainNav       = document.getElementById("mainNav");

// ── Page switcher (exported — used by all other controllers) ──
export function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(sec => {
        sec.classList.remove("active");
    });

    const target = document.getElementById(pageId + "Section");
    if (target) target.classList.add("active");

    document.querySelectorAll(".navLink").forEach(link => {
        link.classList.toggle("active", link.dataset.page === pageId);
    });
}

// ── Login ─────────────────────────────────────────────────────
function handleLogin() {
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const result   = LoginModel.authenticate(email, password);

    if (result.success) {
        loginError.style.display = "none";
        document.getElementById("welcomeName").textContent = result.user.name;

        document.getElementById("loginSection").classList.remove("active");
        mainNav.style.display = "flex";
        showPage("dashboard");

    } else {
        loginError.textContent   = result.message;
        loginError.style.display = "block";

        const form = document.getElementById("loginFormDetails");
        form.style.animation = "none";
        requestAnimationFrame(() => { form.style.animation = "shake 0.4s ease"; });
    }
}

// ── Logout ────────────────────────────────────────────────────
function handleLogout() {
    mainNav.style.display = "none";
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    document.getElementById("loginSection").classList.add("active");
    emailInput.value    = "";
    passwordInput.value = "";
}

// ── Nav routing ───────────────────────────────────────────────
document.querySelectorAll(".navLink").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

// ── Dashboard quick-action buttons ───────────────────────────
document.getElementById("btnNewOrder")?.addEventListener("click",    () => showPage("orders"));
document.getElementById("btnAddCustomer")?.addEventListener("click", () => showPage("customers"));
document.getElementById("btnAddItem")?.addEventListener("click",     () => showPage("products"));

// ── Event bindings ────────────────────────────────────────────
btnLogin.addEventListener("click", handleLogin);
emailInput.addEventListener("keydown",    e => { if (e.key === "Enter") handleLogin(); });
passwordInput.addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });
document.querySelectorAll(".btnLogOut").forEach(btn => btn.addEventListener("click", handleLogout));

// ── Shake keyframe ────────────────────────────────────────────
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-8px); }
        40%       { transform: translateX(8px); }
        60%       { transform: translateX(-6px); }
        80%       { transform: translateX(6px); }
    }
`;
document.head.appendChild(shakeStyle);