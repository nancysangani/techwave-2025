// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
menuBtn.addEventListener("click", () => {
  const spans = menuBtn.querySelectorAll("span");
  spans[0].classList.toggle("rotate-45");
  spans[1].classList.toggle("opacity-0");
  spans[2].classList.toggle("-rotate-45");

  mobileMenu.classList.toggle("hidden");
});

// Get speakers from localStorage (same source as admin)
function getSpeakers() {
  try {
    const speakers = JSON.parse(localStorage.getItem("speakers")) || [];
    console.log("Loaded speakers from localStorage:", speakers.length);
    return speakers;
  } catch (error) {
    console.error("Error loading speakers from localStorage:", error);
    return [];
  }
}

// Load and display speakers
function loadSpeakers() {
  const container = document.getElementById("speakers-container");
  const noSpeakers = document.getElementById("no-speakers");

  if (!container) {
    console.error("Speakers container not found!");
    return;
  }

  container.innerHTML = "";

  const speakers = getSpeakers();

  if (speakers.length === 0) {
    container.classList.add("hidden");
    noSpeakers.classList.remove("hidden");
    return;
  }

  container.classList.remove("hidden");
  noSpeakers.classList.add("hidden");

  speakers.forEach((speaker) => {
    const track = speaker.track?.toLowerCase() || "general";
    const trackColors = {
      'keynote sessions': { bg: "bg-blue-600", text: "text-blue-300" },
      'panel discussions': { bg: "bg-pink-600", text: "text-pink-300" },
      'awards': { bg: "bg-cyan-600", text: "text-cyan-300" },
      'general': { bg: "bg-gray-600", text: "text-gray-300" },
    };

    const colorClass = trackColors[track] || trackColors.general;

    const speakerCard = document.createElement("div");
    speakerCard.className = `speaker-card glass-card p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg cursor-pointer transition transform hover:-translate-y-2`;
    speakerCard.setAttribute("data-track", track);

    const avatarHtml = speaker.photo
      ? `<img src="${speaker.photo}" alt="${speaker.name}" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 ${colorClass.bg}">`
      : `<div class="w-32 h-32 mx-auto rounded-full ${
          colorClass.bg
        } mb-4 flex items-center justify-center text-white text-4xl font-bold">${speaker.name.charAt(
          0
        )}</div>`;

    speakerCard.innerHTML = `
      ${avatarHtml}
      <h3 class="text-xl font-semibold text-white text-center">${
        speaker.name
      }</h3>
      <p class="text-sm text-gray-300 text-center mb-2">${
        speaker.designation || "Industry Expert"
      }</p>
      <p class="${
        colorClass.text
      } text-sm text-center font-medium capitalize">${track}</p>
    `;

    speakerCard.addEventListener("click", () =>
      openSpeakerModal(speaker, colorClass)
    );
    container.appendChild(speakerCard);
  });

  // Setup filters AFTER speakers are loaded
  setupFilters();
}

// Filter functionality
function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const speakers = document.querySelectorAll(".speaker-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Remove active state from all buttons
      filterButtons.forEach((b) =>
        b.classList.remove("ring-2", "ring-white", "ring-opacity-50")
      );

      // Add active state to clicked button
      btn.classList.add("ring-2", "ring-white", "ring-opacity-50");

      // Filter speakers
      speakers.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-track") === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Modal function
function openSpeakerModal(speaker, colorClass) {
  const speakerModal = document.getElementById("speaker-modal");
  const modalContent = speakerModal.querySelector(".modal-content");

  const avatarHtml = speaker.photo
    ? `<img src="${speaker.photo}" alt="${speaker.name}" class="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 ${colorClass.bg}">`
    : `<div class="w-32 h-32 mx-auto rounded-full ${
        colorClass.bg
      } mb-4 flex items-center justify-center text-white text-4xl font-bold">${speaker.name.charAt(
        0
      )}</div>`;

  modalContent.innerHTML = `
    ${avatarHtml}
    <h3 class="text-2xl font-bold text-white mb-2">${speaker.name}</h3>
    <p class="text-gray-300 mb-2">${
      speaker.designation || "Industry Expert"
    }</p>
    <p class="${colorClass.text} font-medium mb-4 capitalize">${
    speaker.track || "General"
  } Track</p>
    <p class="text-gray-300 text-sm mb-4">${
      speaker.bio || speaker.topic || "Details coming soon..."
    }</p>
    <div class="mt-4 pt-4 border-t border-purple-500/30">
      <p class="text-purple-300 font-semibold">Session Topic:</p>
      <p class="text-white">${speaker.topic || "To be announced"}</p>
    </div>
  `;

  speakerModal.classList.remove("hidden");
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadSpeakers();

  // Modal close functionality
  const modalClose = document.getElementById("modal-close");
  const speakerModal = document.getElementById("speaker-modal");

  modalClose.addEventListener("click", () => {
    speakerModal.classList.add("hidden");
  });

  speakerModal.addEventListener("click", (e) => {
    if (e.target === speakerModal) {
      speakerModal.classList.add("hidden");
    }
  });
});

function redirectToRegister() {
  window.location.href = "index.html?register=open";
}
