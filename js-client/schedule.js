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
    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  }
});

// Closing mobile menu when any of the link is clicked
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.remove("rotate-45");
    spans[1].classList.remove("opacity-0");
    spans[2].classList.remove("-rotate-45");

    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  });
});

// tabs
const tabs = document.querySelectorAll(".tab-btn");
const dayContents = document.querySelectorAll(".day-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active-tab", "bg-purple-800/30"));
    tab.classList.add("active-tab", "bg-purple-800/30");
    const day = tab.getAttribute("data-day");
    dayContents.forEach((c) => c.classList.add("hidden"));
    document.getElementById(day).classList.remove("hidden");
  });
});

// modal
const modal = document.getElementById("sessionModal");
const closeModal = document.getElementById("closeModal");
const sessionCards = document.querySelectorAll(".session-card");

sessionCards.forEach((card) => {
  card.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = card.dataset.title;
    document.getElementById("modalTime").textContent = card.dataset.time;
    document.getElementById("modalSpeaker").textContent = card.dataset.speaker;
    document.getElementById("modalDescription").textContent =
      card.dataset.description;
    modal.classList.remove("hidden");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// Schedule data management
function loadAndDisplayEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];

  // Define the conference dates
  const conferenceDates = {
    day1: "2025-11-15",
    day2: "2025-11-16",
    day3: "2025-11-17",
  };

  // Clearing existing content
  Object.keys(conferenceDates).forEach((day) => {
    const dayContainer = document.getElementById(`${day}-events`);
    if (dayContainer) {
      dayContainer.innerHTML = "";
    }
  });

  // Grouping events by date
  const eventsByDate = {};
  Object.values(conferenceDates).forEach((date) => {
    eventsByDate[date] = [];
  });

  // Sorting events into dates
  events.forEach((event) => {
    if (eventsByDate[event.date]) {
      eventsByDate[event.date].push(event);
    }
  });

  // Displaying events for each day
  Object.keys(conferenceDates).forEach((day) => {
    const date = conferenceDates[day];
    const dayEvents = eventsByDate[date];
    const dayContainer = document.getElementById(`${day}-events`);

    if (dayEvents.length === 0) {
      dayContainer.innerHTML = `
                <div class="mb-10 ml-6 relative">
                    <div class="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 text-center">
                        <p class="text-gray-400">No events scheduled for this day yet.</p>
                    </div>
                </div>
            `;
      return;
    }

    // Sorting events by time if available, otherwise by name
    dayEvents.sort((a, b) => {
      if (
        a.time &&
        b.time &&
        a.time !== "To be announced" &&
        b.time !== "To be announced"
      ) {
        return a.time.localeCompare(b.time);
      }
      return a.name.localeCompare(b.name);
    });

    // Creating event cards
    dayEvents.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.className = "mb-10 ml-6 relative";
      eventCard.innerHTML = `
        <div class="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer session-card"
            data-title="${event.name}" 
            data-speaker="${event.speaker}" 
            data-time="${event.time}" 
            data-description="${event.location}"> <!-- Using location as description -->
            <h3 class="text-xl font-semibold text-purple-300">${event.name}</h3>
            <p class="text-gray-400">${event.time} | ${event.speaker}</p>
            <p class="text-gray-500 text-sm mt-2">📍 ${event.location}</p>
        </div>
    `;
      dayContainer.appendChild(eventCard);
    });
  });

  // re-attaching event listeners to the new session cards
  attachSessionCardListeners();
}

function attachSessionCardListeners() {
  const sessionCards = document.querySelectorAll(".session-card");
  const modal = document.getElementById("sessionModal");

  sessionCards.forEach((card) => {
    card.addEventListener("click", () => {
      document.getElementById("modalTitle").textContent = card.dataset.title;
      document.getElementById("modalTime").textContent = card.dataset.time;
      document.getElementById("modalSpeaker").textContent =
        card.dataset.speaker;
      document.getElementById("modalDescription").textContent =
        card.dataset.description;
      modal.classList.remove("hidden");
    });
  });
}

// Load events when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadAndDisplayEvents();

  // Also reload events when coming back to this pagee
  window.addEventListener("storage", function (e) {
    if (e.key === "events") {
      loadAndDisplayEvents();
    }
  });

  // refresh events afetr every 30 seconds
  setInterval(loadAndDisplayEvents, 30000);
});

function redirectToRegister() {
  window.location.href = 'index.html?register=open';
}