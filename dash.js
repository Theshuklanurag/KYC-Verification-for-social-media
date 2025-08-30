document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ First: check login status
  if (!isLoggedIn || !currentUser) {
    alert("You must login first!");
    window.location.href = "login.html";
    return; // exit early if user is not logged in
  }

  // ✅ Then: safely use currentUser
  // Show user info
  document.getElementById("user-name").textContent = currentUser.fullname;
  document.getElementById("user-email").textContent = currentUser.email;

  // ✅ Show Admin Panel Button if admin
  if (currentUser.role === "admin") {
    const adminBtn = document.getElementById("adminPanelBtn");
    adminBtn.style.display = "inline-block";
    adminBtn.addEventListener("click", () => {
      window.location.href = "admin.html";
    });
  }

  // ✅ Show KYC Status and Number
  const kycRecords = JSON.parse(localStorage.getItem("kycDataList")) || [];
  const userKYC = kycRecords.find(record => record.username === currentUser.username);
  const kycSection = document.getElementById("kyc-status");

  if (!userKYC) {
    kycSection.innerHTML = `
      <p>🟡 KYC not completed.</p>
      <a href="kyc.html">➡ Complete KYC</a>
    `;
  } else {
    if (userKYC.status === "approved") {
      kycSection.innerHTML = `
        <p>🟢 KYC Approved. Your KYC Number: <strong>${userKYC.kycNumber}</strong></p>
      `;
    } else {
      kycSection.innerHTML = `
        <p>📝 KYC Status: <strong>${userKYC.status}</strong></p>
      `;
    }
  }

  // ✅ Logout Button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    alert("Logged out successfully.");
    window.location.href = "login.html";
  });
  document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const kycDataList = JSON.parse(localStorage.getItem("kycDataList")) || [];
  
    if (!currentUser) {
      alert("Please login.");
      window.location.href = "login.html";
      return;
    }
  
    const userKyc = kycDataList.find(record => record.username === currentUser.username);
  
    if (userKyc) {
      document.getElementById("kycStatus").innerHTML = `<b>Status:</b> ${userKyc.status.toUpperCase()}`;
  
      if (userKyc.status === "approved" && userKyc.kycNumber) {
        document.getElementById("kycNumber").innerHTML = `<span style="color: green;"><b>KYC Number:</b> ${userKyc.kycNumber}</span>`;
      } else {
        document.getElementById("kycNumber").textContent = "";
      }
    } else {
      document.getElementById("kycStatus").textContent = "No KYC submitted.";
      document.getElementById("kycNumber").textContent = "";
    }
  
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  });
  
});
