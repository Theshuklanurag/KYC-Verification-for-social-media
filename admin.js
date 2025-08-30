document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
    return;
  }

  const kycListDiv = document.getElementById("kyc-list");
  const approvedListDiv = document.getElementById("approved-list");
  const rejectedListDiv = document.getElementById("rejected-list");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const toggleThemeBtn = document.getElementById("toggleTheme");
  const logoutBtn = document.getElementById("logoutBtn");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");

  const videoKycModal = document.getElementById("videoKycModal");
  const videoElement = document.getElementById("videoElement");
  const closeVideoKyc = document.getElementById("closeVideoKyc");

  let kycDataList = JSON.parse(localStorage.getItem("kycDataList")) || [];
  let chartType = "bar";
  let chartInstance;

  function renderLists() {
    kycListDiv.innerHTML = "";
    approvedListDiv.innerHTML = "";
    rejectedListDiv.innerHTML = "";

    kycDataList.forEach((record, index) => {
      const container = document.createElement("div");
      container.className = "kyc-record";
      container.innerHTML = `
        <h4>${record.fullname} (${record.username})</h4>
        <p><strong>DOB:</strong> ${record.dob}</p>
        <p><strong>Address:</strong> ${record.address}</p>
        <p><strong>ID Type:</strong> ${record.idType}</p>
        <p><strong>ID Number:</strong> ${record.idNumber}</p>
        <p><strong>Status:</strong> ${record.status}</p>
        ${record.kycNumber ? `<p><strong>KYC Number:</strong> ${record.kycNumber}</p>` : ""}
        <img src="${record.idProof}" class="zoomable" width="100" />
        ${record.selfie ? `<img src="${record.selfie}" class="zoomable" width="80" />` : ""}
        <br/>
        <button onclick="startVideoKYC()">🎥 Start Video KYC</button>
        <button onclick="updateStatus(${index}, 'approved')">✅ Approve</button>
        <button onclick="updateStatus(${index}, 'rejected')">❌ Reject</button>
        <button onclick="updateStatus(${index}, 'pending')">🕑 No Action</button>
      `;

      if (record.status === "approved") approvedListDiv.appendChild(container);
      else if (record.status === "rejected") rejectedListDiv.appendChild(container);
      else kycListDiv.appendChild(container);
    });

    enableZoom();
    updateAnalytics();
    drawChart();
  }

  function enableZoom() {
    document.querySelectorAll('.zoomable').forEach(img => {
      img.addEventListener('click', () => {
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
      });
    });
  }

  window.updateStatus = function(index, newStatus) {
    const record = kycDataList[index];
    if (!record) return;

    if (newStatus === "approved" && !record.kycNumber) {
      record.kycNumber = generateUniqueKYCNumber();
    }

    record.status = newStatus;
    localStorage.setItem("kycDataList", JSON.stringify(kycDataList));
    renderLists();
  };

  function generateUniqueKYCNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(100000 + Math.random() * 900000);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = chars.charAt(Math.floor(Math.random() * chars.length)) +
                          chars.charAt(Math.floor(Math.random() * chars.length));
    return `KY${year}-${randomLetters}${random}`;
  }

  function updateAnalytics() {
    document.getElementById("totalCount").textContent = kycDataList.length;
    document.getElementById("approvedCount").textContent = kycDataList.filter(x => x.status === "approved").length;
    document.getElementById("rejectedCount").textContent = kycDataList.filter(x => x.status === "rejected").length;
    document.getElementById("suspiciousCount").textContent = kycDataList.filter(x => x.status === "suspicious").length;
    document.getElementById("pendingCount").textContent = kycDataList.filter(x => x.status === "pending").length;
  }

  function drawChart() {
    const ctx = document.getElementById("kycChart").getContext("2d");
    if (chartInstance) chartInstance.destroy();

    const data = [
      kycDataList.filter(x => x.status === "approved").length,
      kycDataList.filter(x => x.status === "rejected").length,
      kycDataList.filter(x => x.status === "suspicious").length,
      kycDataList.filter(x => x.status === "pending").length
    ];

    chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: ["Approved", "Rejected", "Suspicious", "Pending"],
        datasets: [{
          label: "KYC Status",
          data,
          backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#9e9e9e"],
        }]
      },
      options: { responsive: true }
    });
  }

  document.getElementById("barChartBtn").addEventListener("click", () => {
    chartType = "bar";
    drawChart();
  });

  document.getElementById("pieChartBtn").addEventListener("click", () => {
    chartType = "pie";
    drawChart();
  });

  exportCsvBtn.addEventListener("click", () => {
    let csv = "Fullname,Username,DOB,Address,ID Type,ID Number,Status,KYC Number\n";
    kycDataList.forEach(r => {
      csv += `${r.fullname},${r.username},${r.dob},${r.address},${r.idType},${r.idNumber},${r.status},${r.kycNumber || ''}\n`;
    });
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kyc_data.csv";
    link.click();
  });

  exportPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text("KYC Data Report", 10, 10);
    let y = 20;
    kycDataList.forEach(record => {
      pdf.text(`${record.fullname} (${record.username}) - ${record.status}`, 10, y);
      y += 10;
    });
    pdf.save("kyc_data.pdf");
  });

  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });

  window.startVideoKYC = function() {
    videoKycModal.style.display = "block";
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoElement.srcObject = stream;
      })
      .catch(err => {
        alert("Could not access camera: " + err);
      });
  };

  closeVideoKyc.addEventListener("click", () => {
    videoKycModal.style.display = "none";
    const stream = videoElement.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    videoElement.srcObject = null;
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target == lightbox) {
      lightbox.style.display = "none";
    }
    if (event.target == videoKycModal) {
      closeVideoKyc.click();
    }
  };

  renderLists();
});
