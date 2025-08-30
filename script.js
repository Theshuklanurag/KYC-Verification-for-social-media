document.getElementById("startKYC").addEventListener("click", () => {
  const uploadInput = document.getElementById("uploadInput");
  uploadInput.click();

  uploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`✅ ${file.name} selected for KYC verification.`);
      // Logic for uploading file will come here
    }
  };
});
function toggleChatbot() {
  const body = document.getElementById('chatbotBody');
  body.style.display = body.style.display === 'flex' ? 'none' : 'flex';
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const msg = input.value.trim();
  if (msg !== "") {
    displayMessage(msg, 'user');
    generateBotResponse(msg);
    input.value = "";
  }
}

function displayMessage(message, sender) {
  const chat = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'bot' ? 'message-bot' : 'message-user';
  msgDiv.innerText = message;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

function handleOption(option) {
  if (option === 'register') {
    displayMessage("You selected: How to Register?", 'user');
    displayMessage("👉 To register, go to the 'Register' page from the top menu. Fill your details carefully and submit the form!", 'bot');
  } else if (option === 'kyc') {
    displayMessage("You selected: How to Verify KYC?", 'user');
    displayMessage("👉 KYC process:\n1. Go to 'KYC' page from top.\n2. Upload your Aadhaar/Passport.\n3. Wait for verification confirmation.\n4. Once verified, you can access all features!", 'bot');
  } else if (option === 'about') {
    displayMessage("You selected: What is VeriSOC?", 'user');
    displayMessage("👉 VeriSOC is a platform that ensures verified identity on social media, preventing fake news and promoting digital trust.", 'bot');
  } else if (option === 'contact') {
    displayMessage("You selected: Contact Support", 'user');
    displayMessage("👉 You can reach out via 'Contact' page for any support or issue you face. We're happy to help!", 'bot');
  }
}

function generateBotResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  let response = "";

  if (msg.includes("register")) {
    response = "You can register by going to the 'Register' page.";
  } else if (msg.includes("kyc")) {
    response = "Complete your KYC by uploading ID proof via 'KYC' page.";
  } else if (msg.includes("about")) {
    response = "VeriSOC verifies identities to secure social media.";
  } else if (msg.includes("contact")) {
    response = "Visit 'Contact' page for help.";
  } else {
    response = "⚠ Sorry, your question seems out of context. Please select a proper option!";
  }

  displayMessage(response, 'bot');
}
