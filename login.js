let selectedRole = "";

document.getElementById("userIcon").addEventListener("click", function() {
  selectedRole = "user";
  showLoginForm("User Login");
});

document.getElementById("adminIcon").addEventListener("click", function() {
  selectedRole = "admin";
  showLoginForm("Admin Login");
});

function showLoginForm(title) {
  document.querySelector(".selection-container").style.display = "none";
  document.querySelector(".login-container").style.display = "block";
  document.getElementById("loginTitle").innerText = title;
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find(user => 
    user.username === username && 
    user.password === password && 
    user.role === selectedRole
  );

  if (matchedUser) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    if (selectedRole === 'admin') {
      alert("Admin login successful!");
      window.location.href = "admin.html";
    } else {
      alert("User login successful!");
      window.location.href = "dash.html";
    }
  } else {
    document.getElementById("error-msg").innerText = "Invalid credentials or wrong role!";
  }
});

// Create default admin if not exist
(function createDefaultAdmin() {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingAdmin = users.find(user => user.username === "admin");

  if (!existingAdmin) {
    const adminUser = {
      username: "admin",
      fullname: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin"
    };

    users.push(adminUser);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("✅ Default admin created: username = admin, password = admin123");
  }
})();

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = users.find(user => user.username === username && user.password === password);

  if (matchedUser) {
    // ✅ Save login info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    alert("Login successful!");
    
    // ✅ Redirect both user and admin to dash.html
    window.location.href = "dash.html"; 
  } else {
    alert("Invalid credentials!");
  }
});
