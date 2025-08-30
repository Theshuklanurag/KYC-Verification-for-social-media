document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kycForm");
  const msg = document.getElementById("kyc-status-msg");

  if (!form) {
    console.error("KYC form not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value.trim();
    const idType = document.getElementById("idType").value;
    const idNumber = document.getElementById("idNumber").value.trim();
    const idProof = document.getElementById("idProof").files[0];
    const selfie = document.getElementById("selfie").files[0];

    if (!fullname || !dob || !address || !idType || !idNumber || !idProof) {
      alert("Please fill all required fields!");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("User not found. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const reader1 = new FileReader();
    reader1.onload = function () {
      const idProofData = reader1.result;

      if (selfie) {
        const reader2 = new FileReader();
        reader2.onload = function () {
          const selfieData = reader2.result;
          saveKYC(fullname, dob, address, idType, idNumber, idProofData, selfieData);
        };
        reader2.readAsDataURL(selfie);
      } else {
        saveKYC(fullname, dob, address, idType, idNumber, idProofData, null);
      }
    };
    reader1.readAsDataURL(idProof);
  });

  function saveKYC(fullname, dob, address, idType, idNumber, idProofData, selfieData) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let kycList = JSON.parse(localStorage.getItem("kycDataList")) || [];

    const duplicateID = kycList.find(record => record.idNumber === idNumber && record.username !== currentUser.username);
    const isSuspicious =
      idNumber.length < 6 ||
      fullname.toLowerCase().includes("test") ||
      address.length < 5;

    const status = (duplicateID || isSuspicious) ? "suspicious" : "pending";

    const kycData = {
      username: currentUser.username,
      fullname,
      dob,
      address,
      idType,
      idNumber,
      idProof: idProofData,
      selfie: selfieData,
      status: status,
      kycNumber: null,
      submittedAt: new Date().toISOString()
    };

    // Replace existing user KYC if exists
    kycList = kycList.filter(record => record.username !== currentUser.username);
    kycList.push(kycData);
    localStorage.setItem("kycDataList", JSON.stringify(kycList));

    msg.textContent = `✅ KYC submitted! Status: ${status.toUpperCase()}`;
    form.reset();

    setTimeout(() => {
      window.location.href = "dash.html";
    }, 1500);
  }

  // Admin uses this to update KYC Status
  window.updateStatus = function (index, newStatus) {
    const kycDataList = JSON.parse(localStorage.getItem("kycDataList")) || [];
    const kycRecord = kycDataList[index];

    if (!kycRecord) {
      alert("Record not found.");
      return;
    }

    // Generate KYC Number when approved
    if (newStatus === "approved" && !kycRecord.kycNumber) {
      kycRecord.kycNumber = generateUniqueKYCNumber();
    }

    kycRecord.status = newStatus;
    localStorage.setItem("kycDataList", JSON.stringify(kycDataList));

    const statusElement = document.getElementById(`status-${index}`);
    if (statusElement) {
      statusElement.textContent = newStatus;
    }

    alert(`KYC ${newStatus}!`);
  }

  function generateUniqueKYCNumber() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomChars = chars.charAt(Math.floor(Math.random() * chars.length)) +
                        chars.charAt(Math.floor(Math.random() * chars.length));
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit number
    return `${randomChars}${randomNum}`;
  }
});
