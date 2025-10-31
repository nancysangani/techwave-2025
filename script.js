//countdown timer script
const eventDate = new Date("November 15, 2025 09:00:00").getTime(); // 🎯 Set your event date

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("hours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").innerText = seconds
    .toString()
    .padStart(2, "0");

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML =
      "<span class='text-3xl text-pink-400 font-bold animate-pulse'>The Event Has Started! 🚀</span>";
  }
}, 1000);

//this code is for smooth scrolling effect
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  const spans = menuBtn.querySelectorAll("span");
  spans[0].classList.toggle("rotate-45");
  spans[1].classList.toggle("opacity-0");
  spans[2].classList.toggle("-rotate-45");

  if (mobileMenu.classList.contains("hidden")) {
    // Show menu with slide-down animation
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.remove("mobile-slide-up");
    mobileMenu.classList.add("mobile-slide-down");
  } else {
    // Slide up animation
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    // Hide menu after animation completes
    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    // Slide up animation
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    // Reset hamburger icon
    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.remove("rotate-45");
    spans[1].classList.remove("opacity-0");
    spans[2].classList.remove("-rotate-45");

    // Hide menu after animation ends
    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  });
});

const staticEvents = [
  {
    id: 1,
    name: "AI & Machine Learning Workshop",
    date: "2025-11-15",
    time: "10:00 AM - 12:00 PM",
    speaker: "Dr. Sarah Chen",
    location: "Main Hall A",
  },
  {
    id: 2,
    name: "Blockchain Revolution Panel",
    date: "2025-11-16",
    time: "2:00 PM - 4:00 PM",
    speaker: "Rajiv Mehta",
    location: "Conference Room B",
  },
  {
    id: 3,
    name: "Cloud Native Technologies",
    date: "2025-11-17",
    time: "11:00 AM - 1:00 PM",
    speaker: "Priya Sharma",
    location: "Tech Hall C",
  },
];

const staticSpeakers = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    designation: "AI Research Lead at Google",
    topic: "The Future of Artificial Intelligence",
    photo: "",
    track: "keynote sessions",
    bio: "Leading AI researcher with 10+ years of experience in machine learning and neural networks. Published over 50 research papers in top AI conferences.",
  },
  {
    id: 2,
    name: "Rajiv Mehta",
    designation: "Blockchain Architect at Ethereum Foundation",
    topic: "Web3 and Decentralized Future",
    photo: "",
    track: "panel discussions",
    bio: "Blockchain expert specializing in smart contracts and decentralized applications. Contributor to Ethereum core development since 2018.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    designation: "Cloud Solutions Director at Microsoft",
    topic: "Cloud Computing Revolution",
    photo: "",
    track: "keynote sessions",
    bio: "Cloud infrastructure specialist with expertise in Azure, AWS, and hybrid cloud solutions. Helped migrate 100+ enterprises to cloud platforms.",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    designation: "Host of the Event",
    topic: "Awards and Closing Ceremony",
    photo: "",
    track: "awards",
    bio: "Hosted 250+ Events",
  },
];

function initializeStaticData() {
  // Initialize speakers
  if (
    !localStorage.getItem("speakers") ||
    JSON.parse(localStorage.getItem("speakers")).length === 0
  ) {
    localStorage.setItem("speakers", JSON.stringify(staticSpeakers));
    console.log("✅ Static speakers data initialized");
  }

  // Initialize events
  if (
    !localStorage.getItem("events") ||
    JSON.parse(localStorage.getItem("events")).length === 0
  ) {
    localStorage.setItem("events", JSON.stringify(staticEvents));
    console.log("✅ Static events data initialized");
  }

  // Initialize registrations
  if (!localStorage.getItem("registrations")) {
    localStorage.setItem("registrations", JSON.stringify([]));
    console.log("✅ Registrations array initialized");
  }
}

// Load featured speakers
// Load dynamic content
function loadDynamicContent() {
  loadFeaturedSpeakers();
  loadUpcomingEvents();
}

function loadFeaturedSpeakers() {
  const speakers = JSON.parse(localStorage.getItem("speakers")) || [];
  const container = document.getElementById("featured-speakers-container");

  if (!container) {
    console.log("Speakers container not found");
    return;
  }

  console.log("Loading speakers:", speakers);

  if (speakers.length === 0) {
    container.innerHTML = `
            <div class="col-span-3 text-center py-8">
                <p class="text-gray-400">Featured speakers coming soon!</p>
            </div>
        `;
    return;
  }

  // Take first 3 speakers
  const featuredSpeakers = speakers.slice(0, 3);

  container.innerHTML = featuredSpeakers
    .map((speaker) => {
      return `
          <div class="group glass-card p-6 rounded-2xl border border-purple-400/20 bg-white/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300 shadow-lg shadow-purple-900/20">
              <h3 class="text-lg font-semibold text-white mb-1">${speaker.name}</h3>
              <p class="text-gray-300 text-sm mb-2">${speaker.designation}</p>
              <p class="text-purple-300 text-xs">${speaker.topic}</p>
          </div>
      `;
    })
    .join("");
}

function loadUpcomingEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const container = document.getElementById("upcoming-events-container");

  if (!container) {
    console.log("Events container not found");
    return;
  }

  console.log("Loading events:", events);

  if (events.length === 0) {
    container.innerHTML = `
            <div class="col-span-3 text-center py-8">
                <p class="text-gray-400">Events schedule coming soon!</p>
            </div>
        `;
    return;
  }

  // Sort by date and take first 3
  const upcomingEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  container.innerHTML = upcomingEvents
    .map((event) => {
      const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      return `
            <div class="glass-card p-6 rounded-2xl border border-blue-400/20 bg-white/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300 shadow-lg shadow-blue-900/20">
                <h3 class="text-lg font-semibold text-white mb-2">${event.name}</h3>
                <p class="text-blue-300 text-sm mb-2">📅 ${eventDate}</p>
                <p class="text-gray-400 text-sm">⏰ ${event.time}</p>
                <p class="text-gray-300 text-sm mt-2">🎤 ${event.speaker}</p>
                <p class="text-gray-500 text-xs mt-2">📍 ${event.location}</p>
            </div>
        `;
    })
    .join("");
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Homepage loaded - loading dynamic content");
  initializeStaticData();
  loadFeaturedSpeakers();
  loadDynamicContent();
});

// Check if URL has register parameter and open modal
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("register") === "open") {
  console.log("Register parameter detected - opening modal");

  // Remove the parameter from URL without refreshing
  const newUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);

  // Open registration modal after a short delay
  setTimeout(() => {
    if (registrationModal) {
      registrationModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      console.log("Registration modal opened");
    } else {
      console.log("Registration modal not found");
    }
  }, 300);
}

// Also reload when coming back to page (in case data was updated)
window.addEventListener("pageshow", function () {
  loadDynamicContent();
});

// Add getCurrentUser function to index.html
function getCurrentUser() {
  const users = JSON.parse(localStorage.getItem("registrations")) || [];
  const currentUserEmail = localStorage.getItem("currentUser");

  if (!currentUserEmail) {
    return null;
  }

  return users.find((user) => user.email === currentUserEmail);
}

// Registration Modal Functionality
const registrationModal = document.getElementById("registration-modal");
const closeRegistrationModal = document.getElementById(
  "close-registration-modal"
);
const registrationForm = document.getElementById("registration-form");

// Open modal when clicking Register Now buttons
document.querySelectorAll("button").forEach((button) => {
  if (
    button.textContent.includes("Register Now") ||
    button.textContent.includes("Register")
  ) {
    button.addEventListener("click", () => {
      registrationModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  }
});

// Close modal
closeRegistrationModal.addEventListener("click", () => {
  registrationModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Close modal when clicking outside
registrationModal.addEventListener("click", (e) => {
  if (e.target === registrationModal) {
    registrationModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});

// Handle form submission
// In the registration form submission handler in index.html
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const registrationData = {
    name: document.getElementById("full-name").value,
    email: document.getElementById("email").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value,
    password: document.getElementById("password").value,
    registrationDate: new Date().toISOString(),
    paymentStatus: "Pending",
  };

  // Save to localStorage
  let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  registrations.push(registrationData);
  localStorage.setItem("registrations", JSON.stringify(registrations));

  // Set current user and open payment modal
  localStorage.setItem("currentUser", registrationData.email);

  // Close registration modal and open payment modal
  registrationModal.classList.add("hidden");
  openPaymentModal(registrationData);
});

// Login Modal Functionality
const loginModal = document.getElementById("login-modal");
const closeLoginModal = document.getElementById("close-login-modal");
const loginForm = document.getElementById("login-form");
const switchToRegister = document.getElementById("switch-to-register");

// Open login modal
function openLoginModal() {
  loginModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// Close login modal
closeLoginModal.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Switch to registration
switchToRegister.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  registrationModal.classList.remove("hidden");
});

// Handle login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("registrations")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", user.email);
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    window.location.href = "user-dashboard.html";
  } else {
    alert("Invalid email or password. Please try again.");
  }
});

// Switch between registration and login modals
const switchToLogin = document.getElementById("switch-to-login");

// Switch from registration to login
switchToLogin.addEventListener("click", () => {
  registrationModal.classList.add("hidden");
  loginModal.classList.remove("hidden");
});

// Switch from login to registration
switchToRegister.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  registrationModal.classList.remove("hidden");
});

// Close login modal
closeLoginModal.addEventListener("click", () => {
  loginModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Close modal when clicking outside
loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});

// Payment Modal Elements
const paymentModal = document.getElementById("payment-modal");
const closePaymentModal = document.getElementById("close-payment-modal");
const paymentForm = document.getElementById("payment-form");
const paymentSuccessModal = document.getElementById("payment-success-modal");
const goToDashboard = document.getElementById("go-to-dashboard");
const downloadTicket = document.getElementById("download-ticket");
const transactionIdElement = document.getElementById("transaction-id");
const transactionDateElement = document.getElementById("transaction-date");

// Format card number input
document.getElementById("card-number").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ");
  e.target.value = formattedValue || value;
});

// Format expiry date input
document.getElementById("expiry-date").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }
  e.target.value = value;
});

// Add generateTicketPDF function to index.html
function generateTicketPDF(user) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Ticket dimensions
    const pageWidth = 210;
    const pageHeight = 297;

    // Create background
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header with pattern
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, pageWidth, 50, "F");

    // TechWave logo/text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TECHWAVE 2025", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text("PREMIER TECHNOLOGY CONFERENCE", pageWidth / 2, 38, {
      align: "center",
    });

    // Ticket content area
    const contentX = 15;
    const contentY = 70;
    const contentWidth = pageWidth - 30;

    // Main ticket box
    doc.setDrawColor(147, 51, 234);
    doc.setLineWidth(1);
    doc.roundedRect(contentX, contentY, contentWidth, 180, 5, 5, "S");

    // User info section
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CONFERENCE PASS", pageWidth / 2, contentY + 20, {
      align: "center",
    });

    // User details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `ATTENDEE: ${user.name.toUpperCase()}`,
      contentX + 10,
      contentY + 45
    );
    doc.text(`EMAIL: ${user.email}`, contentX + 10, contentY + 60);
    doc.text(
      `LOCATION: ${user.city}, ${user.state}`,
      contentX + 10,
      contentY + 75
    );

    // Event details
    doc.text("DATE: NOVEMBER 15-17, 2025", contentX + 10, contentY + 95);
    doc.text(
      "VENUE: NESCO IT PARK, GOREGAON (E)",
      contentX + 10,
      contentY + 110
    );
    doc.text("MUMBAI, INDIA", contentX + 10, contentY + 125);

    // Ticket type and status
    doc.setFont("helvetica", "bold");
    doc.text("TICKET TYPE: GENERAL ADMISSION", contentX + 10, contentY + 145);

    if (user.paymentStatus === "Paid") {
      doc.setTextColor(34, 197, 94); // Green
      doc.text("STATUS: CONFIRMED & PAID", contentX + 10, contentY + 160);
    } else {
      doc.setTextColor(234, 179, 8); // Yellow
      doc.text("STATUS: PAYMENT PENDING", contentX + 10, contentY + 160);
    }

    // Ticket ID
    const ticketId =
      user.transactionId ||
      "TW" + Math.random().toString(36).substr(2, 9).toUpperCase();
    doc.setTextColor(147, 51, 234);
    doc.setFontSize(10);
    doc.text(`TICKET ID: ${ticketId}`, pageWidth / 2, contentY + 175, {
      align: "center",
    });

    // Terms and conditions
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    const terms = [
      "• This ticket grants access to all 3 days of TechWave 2025 conference",
      "• Valid government-issued photo ID required for entry",
      "• Ticket is non-transferable and non-refundable",
      "• Conference schedule subject to change",
      "• For assistance: contact@techwave2025.com | +91 98765 43210",
    ];

    terms.forEach((term, index) => {
      doc.text(term, pageWidth / 2, contentY + 190 + index * 4, {
        align: "center",
      });
    });

    // Save PDF
    doc.save(`TechWave-2025-Ticket-${user.name.replace(/\s+/g, "_")}.pdf`);

    // Show success notification
    showPaymentSuccessNotification("🎫 Ticket downloaded successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    showPaymentSuccessNotification(
      "Error generating ticket. Please try again.",
      "error"
    );
  }
}

// Show notification for payment success modal
function showPaymentSuccessNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
    type === "success" ? "bg-green-600" : "bg-red-600"
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Open payment modal after successful registration
function openPaymentModal(userData) {
  paymentModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Pre-fill cardholder name
  document.getElementById("cardholder-name").value = userData.name;
}

// Close payment modal
closePaymentModal.addEventListener("click", () => {
  paymentModal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Handle payment form submission
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const cardNumber = document.getElementById("card-number").value;
  const expiryDate = document.getElementById("expiry-date").value;
  const cvv = document.getElementById("cvv").value;
  const cardholderName = document.getElementById("cardholder-name").value;

  // Basic validation
  if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
    alert("Please fill all payment details");
    return;
  }

  if (cardNumber.replace(/\s/g, "").length !== 16) {
    alert("Please enter a valid 16-digit card number");
    return;
  }

  if (cvv.length !== 3) {
    alert("Please enter a valid 3-digit CVV");
    return;
  }

  // Simulate payment processing
  const payButton = paymentForm.querySelector('button[type="submit"]');
  const originalText = payButton.innerHTML;
  payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  payButton.disabled = true;

  // Simulate API call delay
  setTimeout(() => {
    processPaymentSuccess();
    payButton.innerHTML = originalText;
    payButton.disabled = false;
  }, 2000);
});

// Process successful payment
function processPaymentSuccess() {
  // Generate random transaction ID
  const transactionId = "TW" + Date.now() + Math.floor(Math.random() * 1000);
  const transactionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Update success modal with transaction details
  transactionIdElement.textContent = transactionId;
  transactionDateElement.textContent = transactionDate;

  // Close payment modal and open success modal
  paymentModal.classList.add("hidden");
  paymentSuccessModal.classList.remove("hidden");

  // Update user registration with payment status
  const currentUserEmail = localStorage.getItem("currentUser");
  let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  const userIndex = registrations.findIndex(
    (user) => user.email === currentUserEmail
  );

  if (userIndex !== -1) {
    registrations[userIndex].paymentStatus = "Paid";
    registrations[userIndex].transactionId = transactionId;
    registrations[userIndex].paymentDate = new Date().toISOString();
    localStorage.setItem("registrations", JSON.stringify(registrations));
  }
}

// Success modal actions
goToDashboard.addEventListener("click", () => {
  paymentSuccessModal.classList.add("hidden");
  document.body.style.overflow = "auto";
  window.location.href = "user-dashboard.html";
});

downloadTicket.addEventListener("click", () => {
  const user = getCurrentUser();
  if (user) {
    generateTicketPDF(user);
  } else {
    alert("User not found. Please try logging in again.");
  }
});

// Close modals when clicking outside
paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) {
    paymentModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});

paymentSuccessModal.addEventListener("click", (e) => {
  if (e.target === paymentSuccessModal) {
    paymentSuccessModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});
