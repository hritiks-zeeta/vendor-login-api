/* ===== PASSWORD TOGGLE ===== */
function togglePassword() {
  const pwd = document.getElementById("password");
  const toggle = document.querySelector(".toggle-password");
  pwd.type = pwd.type === "password" ? "text" : "password";
  toggle.innerText = pwd.type === "text" ? "HIDE" : "SHOW";
}

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
  const body = document.body;
  const toggle = document.querySelector(".theme-toggle");
  if (body.dataset.theme === "light") {
    body.dataset.theme = "dark";
    toggle.innerText = "🌙 Dark Mode";
  } else {
    body.dataset.theme = "light";
    toggle.innerText = "☀ Light Mode";
  }
}

/* ===== LOGIN FUNCTION ===== */
async function login() {
  const userId = document.getElementById("userId").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  const btn = document.getElementById("loginBtn");
  const spinner = document.getElementById("spinner");
  const card = document.querySelector(".card");

  if (!userId || !password) {
    msg.style.color = "#dc2626";
    msg.innerText = "Enter UserID and Password";
    card.classList.add("error");
    setTimeout(() => card.classList.remove("error"), 400);
    return;
  }

  msg.innerText = "";
  btn.disabled = true;
  spinner.style.display = "block";

  try {
    const res = await fetch("https://vendor-login-api.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password })
    });

    const data = await res.json();

    if (data.status === "success") {
      document.body.classList.add("page-exit");
      setTimeout(() => {
        window.location.href = data.dashboardUrl; // backend untouched
      }, 500);
    } else {
      msg.style.color = "#dc2626";
      msg.innerText = data.message;
      card.classList.add("error");
      setTimeout(() => card.classList.remove("error"), 400);
    }
  } catch {
    msg.style.color = "#dc2626";
    msg.innerText = "Unable to connect to server";
  }

  btn.disabled = false;
  spinner.style.display = "none";
}

/* ===== ENTER KEY SUPPORT ===== */
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") login();
});
