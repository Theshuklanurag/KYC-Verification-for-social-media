// Handle sign-up functionality and theme toggle
document.addEventListener("DOMContentLoaded", function () {

  // Signup Form Submission
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("signup-error-msg");
  
    // Field validation
    if (!fullname || !email || !username || !password || !confirmPassword) {
      errorMsg.textContent = "All fields are required!";
      return;
    }
  
    if (password !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match!";
      return;
    }
  
    // Get existing users array from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check for duplicate username or email
    const userExists = users.some(
      user => user.username === username || user.email === email
    );
  
    if (userExists) {
      errorMsg.textContent = "User with this username or email already exists!";
      return;
    }
  
    // Add new user object
    const newUser = { fullname, email, username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Signup successful!");
    window.location.href = "login.html"; // Redirect to login page after successful signup
  });

  // Dark Mode Toggle
  const themeToggle = document.getElementById("themeToggle");

  // Apply saved theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

  // Sign Up Icon Click - Show Sign Up Form with animation
  document.getElementById("signupIcon").addEventListener("click", function () {
    const signupFormContainer = document.getElementById("signupFormContainer");
    signupFormContainer.style.display = "block";
    signupFormContainer.classList.add("fadeIn");
  });

  // Log In Icon Click - Redirect to Login page
  document.getElementById("loginIcon").addEventListener("click", function () {
    window.location.href = "login.html"; // Redirect to the login page
  });

});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username already exists
  const usernameExists = users.some(user => user.username === username);

  if (usernameExists) {
    alert("Username already taken. Please choose another one.");
    return;
  }

  const newUser = {
    fullname,
    email,
    username,
    password,
    role: "user"
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // 🚫 No Auto-login here!
  alert("Signup successful! Please login now.");

  // Redirect to login page
  window.location.href = "login.html";   // 👈 send them to login
});

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
      // Hide signup/login forms
      document.getElementById('authIcons').style.display = 'none';
      document.getElementById('signupFormContainer').style.display = 'none';

      // Show profile
      document.getElementById('profileSection').style.display = 'block';
      document.getElementById('profileName').innerText = currentUser.fullname;
      document.getElementById('profileEmail').innerText = currentUser.email;
      document.getElementById('profileUsername').innerText = currentUser.username;
    }

    // Handle signup form submit
    document.getElementById('signupForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        document.getElementById('signup-error-msg').innerText = "Passwords do not match!";
        return;
      }

      const user = { fullname, email, username };
      localStorage.setItem('user', JSON.stringify(user));

      // Reload page to show profile
      location.reload();
    });

    // Handle logout
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
      localStorage.removeItem('user');
      location.reload(); // Refresh after logout
    });
  